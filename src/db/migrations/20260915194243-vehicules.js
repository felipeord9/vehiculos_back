"use strict";

const { DRIVER_TABLE, DriverSchema } = require('../models/driverModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(DRIVER_TABLE,DriverSchema);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(DRIVER_TABLE);

  },
};
