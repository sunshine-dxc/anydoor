//zlib模块提供通过 Gzip 和 Deflate/Inflate 实现的压缩功能
const {createGzip,createDeflate} = require("zlib");

module.exports = (rs,req,res) => {

  const acceptEncoding = req.headers['accept-encoding'];
  if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)){

    return rs;

  }else if(acceptEncoding.match(/\bgzip\b/)){

    res.setHeader('Content-Encoding','gzip');
    return rs.pipe(createGzip());

  }else if(acceptEncoding.match(/\bdeflate\b/)){

    res.setHeader('Content-Encoding','deflate');
    return rs.pipe(createDeflate());
  }

}
