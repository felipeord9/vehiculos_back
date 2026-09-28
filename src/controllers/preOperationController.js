const PreOperationalService = require("../services/preOperationService");

const findAllRecords = async (req, res, next) => {
  try {
    const data = await PreOperationalService.find();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneRecord = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await PreOperationalService.findOne(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findByCedula = async (req, res, next) => {
  try {
    const { params: { cedula } } = req

    console.log(cedula)

    const data = await PreOperationalService.findBy(cedula)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findAllByCo = async (req, res, next) => {
  try {
    const { params: { co } } = req

    console.log(co)

    const data = await PreOperationalService.findByAgency(co)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const findAllByUsername = async (req, res, next) => {
  try {
    const { params: { username } } = req

    console.log(username)

    const data = await PreOperationalService.findByUsername(username)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const createRecord = async (req, res, next) => {
  try {
    const { body } = req

    console.log(JSON.stringify(body))

    const data = await PreOperationalService.create({
        plate: body.platesSeleccionado.plate,
        typeVehicle: body.platesSeleccionado.typeVehicle,
        rowId: body.driverSeleccionado.rowId,
        driver: body.driverSeleccionado.name,
        health: body.health,
        diagnosis: body?.diagnosis,
        co: body?.platesSeleccionado.co,
        createdAt: new Date(),
        createdBy: body.createdBy,
        lastKm: body?.dataVerification ? body?.dataVerification.ultimoKilometraje : null,
        licenciaConduccion: body?.dataVerification ? body?.dataVerification.portaLicenciaConduccion : null,
        licenciaTransito: body?.dataVerification ? body?.dataVerification.portaLicenciaTransito : null,
        soat: body?.dataVerification ? body?.dataVerification.portaSOAT : null,
        tecno: body?.dataVerification ? body?.dataVerification.portaTecnicoMecanica : null,
        cedula: body?.dataVerification ? body?.dataVerification.portaCedula : null,
        aceiteMotor: body?.dataVerification ? body?.dataVerification.aceiteMotor : null,
        liquidoFrenos: body?.dataVerification ? body?.dataVerification.liquidoFrenos : null,
        nivelCombustuble: body?.dataVerification ? body?.dataVerification.nivelCombustible : null,
        liquidoRefrigerante: body?.dataVerification ? body?.dataVerification.liquidoRefrigerante : null,
        llantas: body?.dataVerification ? body?.dataVerification.estadoLlantas : null,
        lucesPrincipales: body?.dataVerification ? body?.dataVerification.lucesPrincipales : null,
        lucesDireccionales: body?.dataVerification ? body?.dataVerification.lucesDireccionales : null,
        luzStop: body?.dataVerification ? body?.dataVerification.lucesStop : null,
        estadoFrenos: body?.dataVerification ? body?.dataVerification.frenosGeneral : null,
        maniguetaFrenos: body?.dataVerification ? body?.dataVerification.ManiguetaFreno : null,
        casco: body?.dataVerification ? body?.dataVerification.casco : null,
        calzado: body?.dataVerification ? body?.dataVerification.calzado : null,
        chaleco: body?.dataVerification ? body?.dataVerification.chaleco : null,
        impermeable: body?.dataVerification ? body?.dataVerification.impermeable : null,
        guardabarros: body?.dataVerification ? body?.dataVerification.guardabarros : null,
        sillin: body?.dataVerification ? body?.dataVerification.sillin : null,
        reposaPies: body?.dataVerification ? body?.dataVerification.Reposapies : null,
        espejoLateral: body?.dataVerification ? body?.dataVerification.Espejos : null,
        pito: body?.dataVerification ? body?.dataVerification.Pito : null,
        cadena: body?.dataVerification ? body?.dataVerification.cadena : null,
        pataEncendido: body?.dataVerification ? body?.dataVerification.pata : null,
        protectorExhosto: body?.dataVerification ? body?.dataVerification.protectorExhosto : null,
        maletin: body?.dataVerification ? body?.dataVerification.maletin : null,
        velocimetro: body?.dataVerification ? body?.dataVerification.velocimetro : null,
        placa: body?.dataVerification ? body?.dataVerification.placa : null,
        clutch: body?.dataVerification ? body?.dataVerification.clutch : null,
        fallas: body?.tieneFalla ? body?.tieneFalla : null,
        resumenFallas: body?.resumen ? body?.resumen : null,
        evidencia: body?.evidencia ? body?.evidencia : null,
        firmaConductor: body?.firmaConductor ? body?.firmaConductor: null,
    })

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updateRecord =async (req, res, next) => {
  try {
    const { body, params: { id } } = req
    const data = await PreOperationalService.update(id, body)

    res.status(200).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    next(error)
  }
}

const deleteRecord = async(req,res,next)=>{
  try{
    const { params: { id } } = req

    console.log(id)

    const data = await PreOperationalService.remove(id)
    res.status(200).json({
      message:'Deleted',
      data
    })
  } catch(error){
    next(error)
  }
}

module.exports = {
  findAllRecords,
  findOneRecord,
  findByCedula,
  findAllByCo,
  findAllByUsername,
  createRecord,
  updateRecord,
  deleteRecord,
}