const path = require('path');
//多用途Internet邮件扩展（MIME）类型 是一种标准化的方式来表示文档的性质和格式。

const mimeTypes = {
  "css" : "text/css",
  "gif" : "images/gif",
  "html" : "text/html",
  "ico" : "image/x-icon",
  "jpeg" : "image/jpeg",
  "jpg" : "image/jpg",
  "js" : "text/javascript",
  "json" : "application/json",
  "pdf" : "application/pdf",
  "png" : "image/png",
  "svg" : "image/svg+xml",
  "swf" : "application/x-shockwave-flash",
  "tiff" : "image/tiff",
  "txt" : "text/plain",
  "wav" : "audio/x-wav",
  "wma" : "audio/x-ms-wma",
  "wmv" : "audio/x-ms-wmv",
  "xml" : "text/xml"
};

module.exports = (filename) => {
  let ext = path.extname(filename)
            .split(".")
            .pop()
            .toLowerCase();
  if (!ext) {
    ext = filename;
  }

  return mimeTypes[ext] || mimeTypes['txt'];
}
