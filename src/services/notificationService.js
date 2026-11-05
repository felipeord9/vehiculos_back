const { models } = require('../libs/sequelize')
const { Op, Sequelize } = require("sequelize");

const find = () => {
  const notificaciones = models.Notification.findAll({
    limit: 500,
    order: [["id", "DESC"]],
  })

  return notificaciones
}

const findCo = (co) => {
  const notificaciones = models.Notification.findAll({
    limit: 500,
    order: [["id", "DESC"]],
    where: {
      co: co
    }
  })

  return notificaciones
}

const findByDay = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const dateStr = `${year}-${month}-${day}`;

  const notificaciones = await models.Notification.findAll({
    limit: 500,
    order: [["id", "DESC"]],
    where: {
      fechaNotificacion: {
        [Op.between]: [
          Sequelize.literal(`'${dateStr} 00:00:00'`),
          Sequelize.literal(`'${dateStr} 23:59:59'`)
        ]
      }
    }
  })

  return notificaciones
}

const findDayByCo = async (co) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const dateStr = `${year}-${month}-${day}`;

  const notificaciones = await models.Notification.findAll({
    limit: 500,
    order: [["id", "DESC"]],
    where: {
      fechaNotificacion: {
        [Op.between]: [
          Sequelize.literal(`'${dateStr} 00:00:00'`),
          Sequelize.literal(`'${dateStr} 23:59:59'`)
        ]
      },
      co: co
    }
  })

  return notificaciones
}

const findOne = (id) => {
  const notificacion = models.Notification.findByPk(id)

  if(!notificacion) throw new Error('No se encontro la notificacion')

  return notificacion
}


const findByHuella = (hash) => {
  const notification = models.Notification.findOne({
    where: {
        huella: hash
    }
  })

  if(!notification) throw new Error('No se encontro la notificacion')

  return notification
}

const create = async (body) => {
  const newNotification= models.Notification.create(body)
  return newNotification
}

const update = async (id, changes) => {
  const notification = await findOne(id)
  const updatedProduct = notification.update(changes)

  return updatedProduct
}

const agregarNombre = async (id, nuevoNombre) => {
  const notification = await findOne(id); // Trae el registro actual

  const nombresActuales = notification.leidoPor || '';
  const nombreTrimmed = nuevoNombre;

  // Si está vacío, solo pone el nombre; si ya tiene, le añade la coma y el espacio
  const nuevosNombres = nombresActuales.trim() === '' 
    ? nombreTrimmed 
    : `${nombresActuales}, ${nombreTrimmed}`;

  // Actualiza con el nuevo string concatenado
  const updatedNotification = await notification.update({
    leidoPor: nuevosNombres
  });
  console.log(nuevosNombres)
  return updatedNotification;
};

module.exports = {
  find,
  findCo,
  findOne,
  findByDay,
  findDayByCo,
  findByHuella,
  create,
  update,
  agregarNombre,
}