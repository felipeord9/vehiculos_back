const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");

const find = async () => {
  const records = await models.PreOperational.findAll({
    order: [["id", "DESC"]],
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
    }
  });

  if (!record) throw boom.notFound("PreOperational not found");

  return record;
};

const findByAgency = async (co) => {
  const records = await models.PreOperational.findAll({
    where: {
      co: co
    }
  });

  if (!records) throw boom.notFound("record not found");

  return records;
};

const findByUsername = async (username) => {
  const records = await models.PreOperational.findAll({
    where: {
      createdBy: username
    }
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
  create,
  update,
  remove,
};
