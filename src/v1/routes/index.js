const express = require('express')
const UserRoutes = require('./userRoutes')
const MailRoutes = require('./mailRoutes')
const DriverRoutes = require('./driverRoutes')
const VehicleRoutes = require('./vehicleRoutes')
const AuthRoutes = require('./authRoutes')
const EvidenceRoutes = require('./evidenceRoutes')
const PreOperationalRoutes = require('./preOperationalRoutes')
const AgencyRoutes = require('./agencyRoutes')

function routerApi(app) {
    const router = express.Router()

    app.use('/api/v1/', router)

    router.use('/auth', AuthRoutes)
    router.use('/users', UserRoutes)
    router.use('/mail', MailRoutes)
    router.use('/drivers', DriverRoutes)
    router.use('/vehicles', VehicleRoutes)
    router.use('/upload', EvidenceRoutes)
    router.use('/preoperational', PreOperationalRoutes)
    router.use('/agencies', AgencyRoutes)

}

module.exports = routerApi