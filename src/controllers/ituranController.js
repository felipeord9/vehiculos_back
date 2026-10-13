const IturanService = require("../services/ituranService");

const getInformation = async (req, res, next) => {
  try {
    const data = await IturanService.getCarsInfoIturan();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInformation
}