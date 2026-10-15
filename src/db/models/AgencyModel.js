const { Model, DataTypes, Sequelize } = require("sequelize");

const AGENCY_TABLE = 'agencies'

const AgencySchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rowId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "row_id"
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

class Agency extends Model {
  static associate(models) {
    this.hasMany(models.PreOperational, {
      as: 'records',
      foreignKey: 'rowId',
      sourceKey: 'rowId'
    });

    //asociacion con drivers
    this.hasMany(models.Driver, {
      as: 'coDriver',
      foreignKey: 'co',
      sourceKey: 'rowId'
    });

    //asociacion con vehiculos
    this.hasMany(models.Vehicle, {
      as: 'coVehicle',
      foreignKey: 'co',
      sourceKey: 'rowId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AGENCY_TABLE,
      modelName: 'Agency',
      timestamps: false
    }
  }
}

module.exports = {
  AGENCY_TABLE,
  AgencySchema,
  Agency
}