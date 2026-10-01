const { Model, DataTypes, Sequelize } = require("sequelize");

const DRIVER_TABLE = "drivers";

const DriverSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rowId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'row_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeLicense1: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'type_license_1'
  },
  fechaVencimiento1:{
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_vencimiento_1'
  },
  typeLicense2: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'type_license_2'
  },
  fechaVencimiento2:{
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_vencimiento_2'
  },
  co: {
    type: DataTypes.STRING,
    allowNull: true,
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

class Driver extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DRIVER_TABLE,
      modelName: 'Driver',
      timestamps: false
    }
  }
}

module.exports = {
  DRIVER_TABLE,
  DriverSchema,
  Driver
}