const { Model, DataTypes, Sequelize } = require("sequelize");

const VEHICLE_TABLE = "vehicles";

const VehicleSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeVehicle: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'type_vehicle'
  },
  co: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gpsIturan: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'gps_ituran'
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  chip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soat: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tecno: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  km: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastMaintenance: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_maintenance'
  },
  saneamiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fumigacion: {
    type: DataTypes.DATE,
    allowNull: true,
  }
};

class Vehicle extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: VEHICLE_TABLE,
      modelName: 'Vehicle',
      timestamps: false
    }
  }
}

module.exports = {
  VEHICLE_TABLE,
  VehicleSchema,
  Vehicle
}