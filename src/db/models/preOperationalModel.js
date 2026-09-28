const { Model, DataTypes, Sequelize } = require("sequelize");

const PRE_OPERATIONAL_TABLE = "preoperational";

const PreOperationalSchema = {
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
  rowId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'row_id'
  },
  driver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  health: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  co: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastKm: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'last_km'
  },
  licenciaConduccion:{
    type: DataTypes.STRING,
    allowNull: true,
    field: 'porta_licencia_conduccion'
  },
  licenciaTransito: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'porta_licencia_transito',
  },
  soat: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'porta_soat'
  },
  tecno: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'porta_tecno'
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'porta_cedula'
  },

  aceiteMotor: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'aceite_motor'
  },
  liquidoFrenos: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'liquido_frenos'
  },
  nivelCombustuble: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nivel_combustuble'
  },
  liquidoRefrigerante: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'liquido_refrigerante'
  },

  llantas: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  lucesPrincipales: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'luces_principales'
  },
  lucesDireccionales: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'luces_direccionales'
  },
  luzStop: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'luz_stop'
  },

  estadoFrenos: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'estado_frenos'
  },
  maniguetaFrenos: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'manigueta_frenos'
  },

  casco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calzado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  chaleco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  impermeable: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'manigueta_frenos'
  },
  guardabarros: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'guarda_barros'
  },
  sillin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reposaPies: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reposa_pies'
  },
  espejoLateral: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'espejo_lateral'
  },
  pito: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cadena: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pataEncendido: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'pata_encendido'
  },
  protectorExhosto: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'protector_exhosto'
  },
  maletin: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  velocimetro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clutch: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fallas: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumenFallas: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'resumen_fallas'
  },
  evidencia: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  firmaConductor: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  firmaJefe: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
};

class PreOperational extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRE_OPERATIONAL_TABLE,
      modelName: 'PreOperational',
      timestamps: false
    }
  }
}

module.exports = {
  PRE_OPERATIONAL_TABLE,
  PreOperationalSchema,
  PreOperational
}