const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");

const find = async () => {
  const vehicles = await models.Vehicle.findAll();
  return vehicles;
};

const findOne = async (id) => {
  const vehicle = await models.Vehicle.findByPk(id);

  if (!vehicle) throw boom.notFound("Vehicle not found");

  return vehicle;
};

const findBy = async (cedula) => {
  const vehicle = await models.Vehicle.findOne({
    where: {
      rowId: cedula
    }
  });

  if (!vehicle) throw boom.notFound("Vehicle not found");

  return vehicle;
};

const create = async (body) => {
  const vehicle = await models.Vehicle.create(body);

  return vehicle;
};

const update = async (id, changes) => {
  const vehicle = await findOne(id)
  const updatedVehicle = await vehicle.update(changes)

  return updatedVehicle
}

const remove = async(id)=>{
    const vehicle = findOne(id)
    ;(await vehicle).destroy(id)
}

module.exports = {
  find,
  findOne,
  findBy,
  create,
  update,
  remove,
};
