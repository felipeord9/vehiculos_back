const express = require('express')
const passport = require('passport')
const IturanController = require('../../controllers/ituranController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router
  .get('/', IturanController.getInformation)

module.exports = router