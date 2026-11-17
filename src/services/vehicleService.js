const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");
const { Op } = require("sequelize");

const find = async () => {
  const vehicles = await models.Vehicle.findAll({
    include: [
      "coVehicle",
    ],
  });
  return vehicles;
};

const findOne = async (id) => {
  const vehicle = await models.Vehicle.findByPk(id);

  if (!vehicle) throw boom.notFound("Vehicle not found");

  return vehicle;
};

const findVencimientos = async () => {
  const hoy = new Date();

  // Inicio del día actual
  const fechaInicio = new Date(hoy);
  fechaInicio.setHours(0, 0, 0, 0);

  // Final del séptimo día
  const fechaFin = new Date(hoy);
  fechaFin.setDate(fechaFin.getDate() + 7);
  fechaFin.setHours(23, 59, 59, 999);

  const records = await models.Vehicle.findAll({
    where: {
      [Op.or]: [
        {
          soat: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        {
          tecno: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        }
      ]
    },
    include: [
      "coVehicle"
    ],
    order: [["id", "DESC"]]
  });

  // Identificar qué documento está próximo a vencer
  const resultado = records.map(vehicle => {
    const data = vehicle.toJSON();

    const calcularDias = (fecha) => {
      if (!fecha) return null;

      const vencimiento = new Date(fecha);
      const fechaDocumento = new Date(
        vencimiento.getFullYear(),
        vencimiento.getMonth(),
        vencimiento.getDate()
      );

      const fechaActual = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
      );

      return Math.ceil(
        (fechaDocumento - fechaActual) / (1000 * 60 * 60 * 24)
      );
    };

    const diasSoat = calcularDias(data.soat);
    const diasTecno = calcularDias(data.tecno);

    return {
      ...data,
      vencimientos: {
        soat: diasSoat !== null && diasSoat >= 0 && diasSoat <= 7,
        tecno: diasTecno !== null && diasTecno >= 0 && diasTecno <= 7
      },
      diasVencimiento: {
        soat: diasSoat,
        tecno: diasTecno
      }
    };
  });

  return resultado;
};


const findBy = async (cedula) => {
  const vehicle = await models.Vehicle.findOne({
    where: {
      rowId: cedula
    },
    include: [
      "coVehicle",
    ],
  });

  if (!vehicle) throw boom.notFound("Vehicle not found");

  return vehicle;
};

const findCo = async (co) => {
  const vehicles = await models.Vehicle.findAll({
    where: {
      co
    },
    include: [
      "coVehicle",
    ],
  });

  if (!vehicles) throw boom.notFound("vehicles not found");

  return vehicles;
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
  findCo,
  findVencimientos,
  create,
  update,
  remove,
};
