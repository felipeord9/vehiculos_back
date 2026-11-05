const { Model, DataTypes, Sequelize } = require("sequelize");

const NOTIFICATION_TABLE = "notification"

const NotificationSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  concept: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  co:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaNotificacion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "notication_date",
  },
  huella: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  leidoPor: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "leido_por",
  },
  adjunto1: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "adjunto_1",
  },
  adjunto2: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "adjunto_2",
  },
  adjunto3: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "adjunto_3",
  },
}

class Notification extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTIFICATION_TABLE,
      modelName: 'Notification',
      timestamps: false
    }
  }
}

module.exports = {
  NOTIFICATION_TABLE,
  NotificationSchema,
  Notification
}