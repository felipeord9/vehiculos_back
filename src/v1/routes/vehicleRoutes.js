const express = require('express')
const passport = require('passport')
const VehicleController = require('../../controllers/vehicleController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false })
)

router
  .get('/', VehicleController.findAllVehicles)
  .get('/:id', VehicleController.findOneVehicle)
  .get('/cedula/:cedula', VehicleController.findByCedula)
  .post('/', checkRoles("admin"), VehicleController.createVehicle)
  .patch('/:id', checkRoles("admin"), VehicleController.updateVehicle)
  .delete('/id/:id', checkRoles("admin"), VehicleController.deleteVehicle)

module.exports = router