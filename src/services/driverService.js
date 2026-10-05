const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");

const find = async () => {
  const drivers = await models.Driver.findAll();
  return drivers;
};

const findOne = async (id) => {
  const driver = await models.Driver.findByPk(id);

  if (!driver) throw boom.notFound("Driver not found");

  return driver;
};

const findBy = async (cedula) => {
  const driver = await models.Driver.findOne({
    where: {
      rowId: cedula
    }
  });

  if (!driver) throw boom.notFound("Driver not found");

  return driver;
};

const findCo = async (co) => {
  const drivers = await models.Driver.findAll({
    where: {
      co
    }
  });

  if (!drivers) throw boom.notFound("Drivers not found");

  return drivers;
};

const create = async (body) => {
  const driver = await models.Driver.create(body);

  return driver;
};

const update = async (id, changes) => {
  const driver = await findOne(id)
  const updatedDriver = await driver.update(changes)

  return updatedDriver
}

const remove = async(id)=>{
    const driver = findOne(id)
    ;(await driver).destroy(id)
}

module.exports = {
  find,
  findOne,
  findBy,
  findCo,
  create,
  update,
  remove,
};
