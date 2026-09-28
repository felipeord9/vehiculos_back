const AgencyService = require("../services/agencyService");

const findAllAgencies = async (req, res, next) => {
  try {
    const data = await AgencyService.find();

    res.status(200).json({
      message: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneAgency = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await AgencyService.findOne(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const createAgency = async (req, res, next) => {
  try {
    const { body } = req

    console.log(JSON.stringify(body))

    const data = await AgencyService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateAgency =async (req, res, next) => {
  try {
    const { body, params: { id } } = req
    const data = await AgencyService.update(id, body)

    res.status(200).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    next(error)
  }
}

const deleteAgency = async(req,res,next)=>{
  try{
    const { params: { id } } = req

    console.log(id)

    const data = await AgencyService.remove(id)
    res.status(200).json({
      message:'Deleted',
      data
    })
  } catch(error){
    next(error)
  }
}

module.exports = {
  findAllAgencies,
  findOneAgency,
  createAgency,
  updateAgency,
  deleteAgency,
}