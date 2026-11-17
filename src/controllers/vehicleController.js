const VehicleService = require("../services/vehicleService");
const { config } = require('../config/config')
const crypto = require('crypto');
const NotificationService = require('../services/notificationService')

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

async function rutinaAllVecimiento() {
  try {

    //buscamos los registros que esta proximos a vencer
    const registros = await VehicleService.findVencimientos();

    if(registros){
      for(const record of registros){
        const concepto = 'vencimiento'
        const placa = record.plate
        const fecha = new Date().toLocaleDateString()
        const huellaHash = crypto.createHash('md5').update(`${placa}-${concepto}-${fecha}`).digest('hex');

        // Verificar si YA se le notificó esto al usuario antes
        const yaNotificado = await NotificationService.findByHuella(huellaHash)

        if(!yaNotificado){
          await NotificationService.create({
            concept: 'vencimiento',
            co: record.co,
            fechaNotificacion: new Date(),
            huella: huellaHash,
            leido: false,
            adjunto1: record.plate,
            adjunto2: record.typeVehicle,
            adjunto3: `soat:${record.diasVencimiento.soat},tecno:${record.diasVencimiento.tecno}`
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  findAllVehicles,
  findOneVehicle,
  findByCedula,
  findByCo,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  rutinaAllVecimiento,
}