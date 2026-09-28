"use strict";

const { AGENCY_TABLE, AgencySchema } = require('../models/AgencyModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(AGENCY_TABLE, AgencySchema);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(AGENCY_TABLE);

  },
};