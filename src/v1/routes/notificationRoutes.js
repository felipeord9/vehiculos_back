const express = require('express')
const NotificationController = require('../../controllers/notificationController')

const router = express.Router()

router
  .get('/', NotificationController.findAllnotifications)
  .get('/:id', NotificationController.findOneNotification)
  .get('/co/:co', NotificationController.findAllByCo)
  .get('/crear/todas/notify', NotificationController.rutinaCrearNotificaciones)

  .get('/find/today', NotificationController.findTodaynotifications)
  .get('/find/today/:co', NotificationController.findTodaynotificationsByCo)
  .get('/find/pendientes/today', NotificationController.findPendientesToday)
  .get('/find/pendientes/today/:co', NotificationController.findPendientesTodayByCo)
  .patch("/:id", NotificationController.updateNotification)
  .patch("/agregar/:id", NotificationController.agregarNombreControl)
  
module.exports = router