const fs = require("fs");
const path = require("path");
//模板引擎
const Handlebars = require("handlebars");
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const mine = require('../helper/mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

//拼接模板路径
const tplPath = path.join(__dirname,"../template/dir.tpl");
const source = fs.readFileSync(tplPath,"utf-8");
//生成template
//使用Handlebars.compile()方法来预编译模板
const template = Handlebars.compile(source);

// module.exports = async function(req,res,filePath){

// //   fs.stat(filePath,function(err,stats){

// //   if(err){
// //     //如果出现异常
// //   }
// //   if(stats.isFile){
// //     //

// //   }else if(stats.isDirectory){
// //     //
// //   }

// // })

// try {
//    const stats = await stat(filePath);
//    if(stats.isFile){
//       //
//    }else if (stats.isDirectory) {
//      //
//    }


// } catch (error) {
//   //如果出现异常
// }
// }



module.exports = async function (req,res,filePath,config) {
  try {
    const stats = await stat(filePath);

    if(stats.isFile()){
      const contentType = mine(filePath);

      res.setHeader('Content-Type',`${contentType};charset=utf-8`);

      if (isFresh(stats,req,res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const {code,start,end} = range(stats.size,req,res);

      if(code ===200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      }else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath,{start,end});
      }

      if(filePath.match(config.compress)){
        rs = compress(rs,req,res);
      }
      rs.pipe(res);

    }else if(stats.isDirectory()){

      //读取一个目录的内容
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type','text/html');
      const dir = path.relative(config.root,filePath);

      const data = {
        title: path.basename(filePath),
        dir: dir? `/${dir}` : '',
        files: files.map(file => {
          return {
            file,
            icon:mine(file)
          }
        })
      }

      res.end(template(data));
    }
  } catch (exception) {
      console.error(exception);
      res.statusCode = 404;
      res.setHeader('Content-Type',"text/plain");
      res.end(`${filePath} is not a directory or file.\n ${exception.toString()}`);

  }
}
