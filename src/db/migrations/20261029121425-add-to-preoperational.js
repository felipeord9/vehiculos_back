'use strict';
const { PRE_OPERATIONAL_TABLE, PreOperationalSchema } = require('../models/preOperationalModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PRE_OPERATIONAL_TABLE, 'motor_thermo', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn(PRE_OPERATIONAL_TABLE, 'temperatura_thermo', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn(PRE_OPERATIONAL_TABLE, 'novedades_motor', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn(PRE_OPERATIONAL_TABLE, 'novedades_latoneria', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn(PRE_OPERATIONAL_TABLE, 'kit_carretera', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    //
  }
};