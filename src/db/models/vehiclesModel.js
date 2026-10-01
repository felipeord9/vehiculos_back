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
  saneamientoCarnico: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'saneamiento_carnico'
  },
  saneamientoPesquero: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'saneamiento_pesquero'
  },
  fumigacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  poliza: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  invima: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tarjetaPropiedad: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tarjeta_propiedad'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'created_at'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'created_by'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at'
  },
  UpdatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'updated_by'
  },
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