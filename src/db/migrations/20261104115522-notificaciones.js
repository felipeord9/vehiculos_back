"use strict";

const { NOTIFICATION_TABLE, NotificationSchema } = require('../models/notificationModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(NOTIFICATION_TABLE, NotificationSchema);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(NOTIFICATION_TABLE);

  },
};