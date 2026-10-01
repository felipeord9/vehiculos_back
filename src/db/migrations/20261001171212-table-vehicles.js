"use strict";

const { VEHICLE_TABLE, VehicleSchema } = require('../models/vehiclesModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(VEHICLE_TABLE,VehicleSchema);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(VEHICLE_TABLE);

  },
};