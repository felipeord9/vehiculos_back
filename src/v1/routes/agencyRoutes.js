const express = require('express')
const passport = require('passport')
const AgencyController = require('../../controllers/agencyController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false })
)

router
  .get('/', AgencyController.findAllAgencies)
  .get('/:id', AgencyController.findOneAgency)
  .post('/', checkRoles("admin"), AgencyController.createAgency)
  .patch('/:id', checkRoles("admin"), AgencyController.updateAgency)
  .delete('/id/:id', checkRoles("admin"), AgencyController.deleteAgency)

module.exports = router