const NotificationService = require('../services/notificationService')
const PreOperationService = require('../services/preOperationService')
const VehicleService = require('../services/vehicleService')
const { config } = require('../config/config')
const crypto = require('crypto');

const findAllnotifications = async (req, res, next) => {
  try {
    const data = await NotificationService.find();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findAllByCo = async (req, res, next) => {
  try {
    const { params: { co } } = req
    const data = await NotificationService.findCo(co);

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneNotification = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await NotificationService.findOne(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateNotification = async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const data = await NotificationService.update(id, body)

    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    next(error)
  }
}

const agregarNombreControl = async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const data = await NotificationService.agregarNombre(id, body.nuevoNombre)

    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

//funciones para hallar las notificaciones actuales
const findTodaynotifications = async (req, res, next) => {
  try {
    //buscamos notificaciones globales del dia
    const data = await NotificationService.findByDay();

    res.status(200).json({
      message: "OK",
      data
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
const findTodaynotificationsByCo = async (req, res, next) => {
  const { params: { co } } = req
  try {
    //buscamos notificaciones globales del dia por co
    const data = await NotificationService.findDayByCo(co);

    res.status(200).json({
      message: "OK",
      data
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
///////////

//funcion para hallar los preoperacionales pendientes
const findPendientesToday = async (req, res, next) => {
  try {
    //buscamos las placas
    const placas = await VehicleService.find();

    //buscamos los registros de hoy
    const registros = await PreOperationService.findRecordsToday();

    //buscamos los que no han hecho registro hoy
    const diferencia = await placas.filter(
      item1 => !registros.some(item2 => item2.plate === item1.plate)
    )

    const data = [...diferencia]

    res.status(200).json({
      message: "OK",
      data
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
const findPendientesTodayByCo = async (req, res, next) => {
  const { params: { co } } = req
  try {
    //buscamos las placas
    const placas = await VehicleService.findCo(co);

    //buscamos los registros de hoy
    const registros = await PreOperationService.findRecordsTodayByCo(co);

    //buscamos los que no han hecho registro hoy
    const diferencia = await placas.filter(
      item1 => !registros.some(item2 => item2.plate === item1.plate)
    )

    const data = [...diferencia]

    res.status(200).json({
      message: "OK",
      data
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
///////

//rutinas para crear las notificaciones
async function rutinaCrearNotificaciones() {
  try {
    //buscamos las placas
    const placas = await VehicleService.find();

    //buscamos los registros de hoy
    const registros = await PreOperationService.findRecordsToday();

    //buscamos los que no han hecho registro hoy
    const diferencia = await placas.filter(
      item1 => !registros.some(item2 => item2.plate === item1.plate)
    )

    const arrayDiferent = [...diferencia]

    if(arrayDiferent){
      for(const record of arrayDiferent){
        const concepto = 'preoperacional'
        const placa = record.plate
        const fecha = new Date().toLocaleDateString()
        const huellaHash = crypto.createHash('md5').update(`${placa}-${concepto}-${fecha}`).digest('hex');

        // Verificar si YA se le notificó esto al usuario antes
        const yaNotificado = await NotificationService.findByHuella(huellaHash)

        if(!yaNotificado){
          await NotificationService.create({
            concept: 'preoperacional',
            co: record.co,
            fechaNotificacion: new Date(),
            huella: huellaHash,
            leido: false,
            adjunto1: record.plate,
            adjunto2: record.typeVehicle,
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
};
async function rutinaCrearByCoNotificaciones () {
  const { params: { co } } = req
  try {
    //buscamos las placas
    const placas = await VehicleService.findCo(co);

    //buscamos los registros de hoy
    const registros = await PreOperationService.findRecordsTodayByCo(co);

    //buscamos los que no han hecho registro hoy
    const diferencia = await placas.filter(
      item1 => !registros.some(item2 => item2.plate === item1.plate)
    )

    const arrayDiferent = [...diferencia]

    if(arrayDiferent){
      for(const record of arrayDiferent){
        const concepto = 'preoperacional'
        const placa = record.plate
        const fecha = new Date().toLocaleDateString()
        const huellaHash = crypto.createHash('md5').update(`${placa}-${concepto}-${fecha}`).digest('hex');

        // Verificar si YA se le notificó esto al usuario antes
        const yaNotificado = await NotificationService.findByHuella(huellaHash)

        if(!yaNotificado){
          await NotificationService.create({
            concept: 'preoperacional',
            co: record.co,
            fechaNotificacion: new Date(),
            huella: huellaHash,
            leido: false,
            adjunto1: record.plate,
            adjunto2: record.typeVehicle,
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
};
////////////

module.exports = {
  findAllnotifications,
  findAllByCo,
  findOneNotification,
  findTodaynotifications,
  findTodaynotificationsByCo,
  findPendientesToday,
  findPendientesTodayByCo,
  updateNotification,
  agregarNombreControl,
  rutinaCrearNotificaciones,
  rutinaCrearByCoNotificaciones,
};