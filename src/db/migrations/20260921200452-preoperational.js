"use strict";

const { PRE_OPERATIONAL_TABLE, PreOperationalSchema } = require('../models/preOperationalModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PRE_OPERATIONAL_TABLE,PreOperationalSchema);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PRE_OPERATIONAL_TABLE);

  },
};