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
  typeLicense: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'type_license'
  },
  co: {
    type: DataTypes.STRING,
    allowNull: true,
  }
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