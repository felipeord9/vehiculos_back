const express = require('express')
const passport = require('passport')
const DriverController = require('../../controllers/driverController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false })
)

router
  .get('/', DriverController.findAllDrivers)
  .get('/:id', DriverController.findOneDriver)
  .get('/cedula/:cedula', DriverController.findByCedula)
  .get('/agencia/:co', DriverController.findByCo)
  .post('/', checkRoles("admin", "jefe"), DriverController.createDriver)
  .patch('/:id', checkRoles("admin", "jefe"), DriverController.updateDriver)
  .delete('/id/:id', checkRoles("admin", "jefe"), DriverController.deleteDriver)

module.exports = router