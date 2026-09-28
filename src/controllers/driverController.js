const DriverService = require("../services/driverService");

const findAllDrivers = async (req, res, next) => {
  try {
    const data = await DriverService.find();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneDriver = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await DriverService.findOne(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findByCedula = async (req, res, next) => {
  try {
    const { params: { cedula } } = req

    console.log(cedula)

    const data = await DriverService.findBy(cedula)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const createDriver = async (req, res, next) => {
  try {
    const { body } = req

    console.log(JSON.stringify(body))

    const data = await DriverService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateDriver =async (req, res, next) => {
  try {
    const { body, params: { id } } = req
    const data = await DriverService.update(id, body)

    res.status(200).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    next(error)
  }
}

const deleteDriver = async(req,res,next)=>{
  try{
    const { params: { id } } = req

    console.log(id)

    const data = await DriverService.remove(id)
    res.status(200).json({
      message:'Deleted',
      data
    })
  } catch(error){
    next(error)
  }
}

module.exports = {
  findAllDrivers,
  findOneDriver,
  findByCedula,
  createDriver,
  updateDriver,
  deleteDriver,
}