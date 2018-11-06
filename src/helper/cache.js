const {cache} = require('../config/defaultConfig');
function refreshRes(stats,res) {
  const {maxAge,expires,cacheControl,lastModified,etag} = cache;
  if (expires) {
    //Expires 指定一个日期/时间，超过该时间则认为此回应已经过期
    res.setHeader('Expires',(new Date(Date.now()+ maxAge*1000)).toUTCString());
  }

  if (cacheControl) {
    //Cache-Control通知从服务器到客户端内的所有缓存机制，表示它们是否可以缓存这个对象及缓存有效时间。其单位为秒
    res.setHeader('Cache-Control',`public,max-age = ${maxAge} `);
  }
  if (lastModified) {

    //Last-Modified 所请求的对象的最后修改日期
    res.setHeader('Last-Modified',stats.mtime.toUTCString());
  }

  if (etag) {
    //ETag 对于某个资源的某个特定版本的一个标识符，通常是一个 消息散列

    res.setHeader('ETag',`${stats.size}-${stats.mtimeMs}`);

  }
}

module.exports = function isFresh(stats,req,res) {
  refreshRes(stats,res);
  //读取请求头的信息
  //If-Modified-Since允许在对应的资源未被修改的情况下返回304未修改	If-Modified-Since: Dec, 26 Dec 2015 17:30:00 GMT
  const lastModified = req.headers['if-modified-since'];
  //if-none-match 允许在对应的内容未被修改的情况下返回304未修改（ 304 Not Modified ）,	If-None-Match: "9jd00cdj34pss9ejqiw39d82f20d0ikd"
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
      return false;
  }
  if(lastModified && lastModified !== res.getHeader('Last-Modified')){
      return false;
  }
  if (etag && etag !==res.getHeader('ETag')) {
      return false;
  }
  return true;
}
