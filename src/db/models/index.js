const { User, UserSchema } = require('./userModel')
const { Vehicle, VehicleSchema } = require('./vehiclesModel')
const { Driver, DriverSchema } = require('./driverModel')
const { PreOperational, PreOperationalSchema } = require('./preOperationalModel')
const { Agency, AgencySchema } = require('./AgencyModel')

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Vehicle.init(VehicleSchema, Vehicle.config(sequelize))
  Driver.init(DriverSchema, Driver.config(sequelize))
  PreOperational.init(PreOperationalSchema, PreOperational.config(sequelize))
  Agency.init(AgencySchema, Agency.config(sequelize))

  User.associate(sequelize.models)
  Vehicle.associate(sequelize.models)
  Driver.associate(sequelize.models)
  PreOperational.associate(sequelize.models)
  Agency.associate(sequelize.models)

}

module.exports = setupModels