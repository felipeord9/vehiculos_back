const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");

const find = async () => {
  const agencies = await models.Agency.findAll();
  return agencies;
};

const findOne = async (id) => {
  const agency = await models.Agency.findByPk(id);

  if (!agency) throw boom.notFound("Agency not found");

  return agency;
};

const findBy = async (cedula) => {
  const agency = await models.Agency.findOne({
    where: {
      rowId: cedula
    }
  });

  if (!agency) throw boom.notFound("Agency not found");

  return agency;
};

const create = async (body) => {
  const agency = await models.Agency.create(body);

  return agency;
};

const update = async (id, changes) => {
  const agency = await findOne(id)
  const updatedAgency = await agency.update(changes)

  return updatedAgency
}

const remove = async(id)=>{
    const agency = findOne(id)
    ;(await agency).destroy(id)
}

module.exports = {
  find,
  findOne,
  findBy,
  create,
  update,
  remove,
};
