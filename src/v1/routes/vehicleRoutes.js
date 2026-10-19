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
  .get('/agencia/:co', VehicleController.findByCo)
  .post('/', checkRoles("admin", "jefe"), VehicleController.createVehicle)
  .patch('/:id', checkRoles("admin", "jefe"), VehicleController.updateVehicle)
  .delete('/id/:id', checkRoles("admin", "jefe"), VehicleController.deleteVehicle)

module.exports = router