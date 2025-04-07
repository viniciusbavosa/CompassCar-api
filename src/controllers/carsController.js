import {
  validateCarCreate,
  validateCarUpdate,
} from "../validators/carsValidation.js";
import {
  createCar,
  getCarById,
  listCars,
  updateCar,
  deleteCar,
} from "../services/carsService.js";

// Controller que processa a requisição de criação de um carro e chama o serviço correspondente
async function createCarController(req, res) {
  const validation = validateCarCreate(req.body);
  if (validation) {
    return res.status(400).json({ errors: validation.errors });
  }

  const result = await createCar(req.body);
  return res.status(result.status).json(result.data);
}

// Controller que processa a requisição de busca de um carro por ID e chama o serviço correspondente
async function getCarController(req, res) {
  const result = await getCarById(req.params.id);
  return res.status(result.status).json(result.data);
}

// Controller que processa a requisição de listagem de carros e chama o serviço correspondente
async function listCarsController(req, res) {
  const { year, final_plate, brand } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const filters = {};
  if (year) filters.year = year;
  if (final_plate) filters.final_plate = final_plate;
  if (brand) filters.brand = brand;

  const result = await listCars(filters, page, limit);
  return res.status(result.status).json(result.data);
}

// Controller que processa a requisição de atualização de um carro e chama o serviço correspondente
async function updateCarController(req, res) {
  const validation = validateCarUpdate(req.body);
  if (validation) {
    return res.status(400).json(validation);
  }

  // Remove empty values
  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v != null && v !== "")
  );

  const result = await updateCar(req.params.id, updateData);
  return res.status(result.status).json(result.data);
}

// Controller que processa a requisição de exclusão de um carro e chama o serviço correspondente
async function deleteCarController(req, res) {
  const result = await deleteCar(req.params.id);
  return res.status(result.status).json(result.data);
}

export {
  createCarController,
  getCarController,
  listCarsController,
  updateCarController,
  deleteCarController,
};
