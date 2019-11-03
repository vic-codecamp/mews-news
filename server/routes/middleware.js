const middlewareSetMimeTypeTextHtml = function(req, res, next) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  next();
};

const middlewareSetMimeTypeJson = function(req, res, next) {
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
};

module.exports = {
  middlewareSetMimeTypeTextHtml,
  middlewareSetMimeTypeJson
};
