const express = require('express')
const passport = require('passport')
const PreOperationalController = require('../../controllers/preOperationController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false })
)

router
  .get('/', PreOperationalController.findAllRecords)
  .get('/:id', PreOperationalController.findOneRecord)
  .get('/co/:co', PreOperationalController.findAllByCo)
  .get('/user/:username', PreOperationalController.findAllByUsername)
  .get('/cedula/:cedula', PreOperationalController.findByCedula)
  .post('/', PreOperationalController.createRecord)
  .patch('/:id', checkRoles("admin"), PreOperationalController.updateRecord)
  .delete('/id/:id', checkRoles("admin"), PreOperationalController.deleteRecord)

module.exports = router