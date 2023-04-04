module.exports = (err, req, res, next) => {

  console.log(err);

  if (err.isCustomException) {
    res.status(err.statusCode).json({
      exceptionType: err.type,
      message: err.message
    });
  } else {
    res.status(500).json({
      exceptionType: "internalException",
      message: `Please report this at https://github.com/HonzaKubita/jecnaAPI/issues Error: ${err.message}`
    });
  }

}