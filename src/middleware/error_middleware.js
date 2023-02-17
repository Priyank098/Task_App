const dashLogger = require("../logger");
const time = new Date();


const error_middleware = (err, req, res, next) => {
  dashLogger.error(`Error : ${err.message},Request : ${req.originalUrl},stack:${err.stack}`);
  // console.log(err.cause.status)
  if (!err.cause)
  res.status(500).json({ error: err.message });
  else
  res.status(err.cause.status).json({ error: err.message });
}


module.exports = { error_middleware }