const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");
const { Op, Sequelize } = require("sequelize");

const find = async () => {
  const records = await models.PreOperational.findAll({
    order: [["id", "DESC"]],
    include: [
      "agency",
    ],
  });
  return records;
};

const findRecordsToday = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const dateStr = `${year}-${month}-${day}`;

  const records = await models.PreOperational.findAll({
    order: [["id", "DESC"]],
    include: [
      "agency",
    ],
    where: {
      createdAt: {
        [Op.between]: [
          Sequelize.literal(`'${dateStr} 00:00:00'`),
          Sequelize.literal(`'${dateStr} 23:59:59'`)
        ]
      }
    }
  });
  return records;
};

const findRecordsTodayByCo = async (co) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const dateStr = `${year}-${month}-${day}`;

  const records = await models.PreOperational.findAll({
    order: [["id", "DESC"]],
    include: [
      "agency",
    ],
    where: {
      createdAt: {
        [Op.between]: [
          Sequelize.literal(`'${dateStr} 00:00:00'`),
          Sequelize.literal(`'${dateStr} 23:59:59'`)
        ]
      },
      co: co
    }
  });
  return records;
};


const findOne = async (id) => {
  const record = await models.PreOperational.findByPk(id);

  if (!record) throw boom.notFound("record not found");

  return record;
};

const findBy = async (cedula) => {
  const record = await models.PreOperational.findOne({
    where: {
      rowId: cedula
    },
    include: [
      "agency",
    ],
    order: [["id", "DESC"]],
  });

  if (!record) throw boom.notFound("PreOperational not found");

  return record;
};

const findByAgency = async (co) => {
  const records = await models.PreOperational.findAll({
    where: {
      co: co
    },
    include: [
      "agency",
    ],
    order: [["id", "DESC"]],
  });

  if (!records) throw boom.notFound("record not found");

  return records;
};

const findByUsername = async (username) => {
  const records = await models.PreOperational.findAll({
    where: {
      createdBy: username
    },
    include: [
      "agency",
    ],
    order: [["id", "DESC"]],
  });

  if (!records) throw boom.notFound("record not found");

  return records;
};

const create = async (body) => {
  const record = await models.PreOperational.create(body);

  return record;
};

const update = async (id, changes) => {
  const record = await findOne(id)
  const updatedRecord = await record.update(changes)

  return updatedRecord
}

const remove = async(id)=>{
    const record = findOne(id)
    ;(await record).destroy(id)
}

module.exports = {
  find,
  findOne,
  findBy,
  findByAgency,
  findByUsername,
  findRecordsToday,
  findRecordsTodayByCo,
  create,
  update,
  remove,
};
