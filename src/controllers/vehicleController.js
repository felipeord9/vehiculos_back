const VehicleService = require("../services/vehicleService");

const findAllVehicles = async (req, res, next) => {
  try {
    const data = await VehicleService.find();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneVehicle = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await VehicleService.findOne(id)

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

    const data = await VehicleService.findBy(cedula)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findByCo = async (req, res, next) => {
  try {
    const { params: { co } } = req

    console.log(co)

    const data = await VehicleService.findCo(co)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const createVehicle = async (req, res, next) => {
  try {
    const { body } = req

    console.log(JSON.stringify(body))

    const data = await VehicleService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateVehicle =async (req, res, next) => {
  try {
    const { body, params: { id } } = req
    const data = await VehicleService.update(id, body)

    res.status(200).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    next(error)
  }
}

const deleteVehicle = async(req,res,next)=>{
  try{
    const { params: { id } } = req

    console.log(id)

    const data = await VehicleService.remove(id)
    res.status(200).json({
      message:'Deleted',
      data
    })
  } catch(error){
    next(error)
  }
}

module.exports = {
  findAllVehicles,
  findOneVehicle,
  findByCedula,
  findByCo,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}