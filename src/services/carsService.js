import { Op } from "sequelize";

import { CarItems, Cars } from "../model/associateModels.js";

async function createCar(carData) {
  try {
    const car = await Cars.create(carData);
    return { status: 201, data: car };
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return { status: 409, data: { errors: ["car already registered"] } };
    }
    throw error;
  }
}

async function getCarById(id) {
  const car = await Cars.findByPk(id, {
    include: { association: "items", attributes: ["name"] },
  });

  if (!car) {
    return { status: 404, data: { errors: ["car not found"] } };
  }

  const carData = car.get({ plain: true });
  carData.items = carData.items.map((item) => item.name);

  return { status: 200, data: carData };
}

async function listCars(filters = {}, page = 1, limit = 5) {
  const where = {};

  if (filters.year) {
    where.year = { [Op.gte]: filters.year };
  }

  if (filters.final_plate) {
    where.plate = { [Op.like]: `%${filters.final_plate}` };
  }

  if (filters.brand) {
    where.brand = { [Op.like]: `%${filters.brand}%` };
  }

  const adjustedLimit = Math.min(limit, 10);
  const offset = (Math.max(1, page) - 1) * adjustedLimit;

  const { count, rows } = await Cars.findAndCountAll({
    where,
    limit: adjustedLimit,
    offset,
    order: [["created_at", "DESC"]],
  });

  const pages = Math.ceil(count / adjustedLimit);

  return {
    status: 200,
    data: {
      count,
      pages,
      data: rows,
    },
  };
}

async function updateCar(id, updateData) {
  const car = await Cars.findByPk(id);
  const isSamePlate = await Cars.findOne({
    where: { plate: updateData.plate },
  });

  if (!car) {
    return { status: 404, data: { errors: ["car not found"] } };
  }

  if (isSamePlate && isSamePlate.plate === updateData.plate) {
    return { status: 409, data: { errors: ["car already registered"] } };
  }

  try {
    await car.update(updateData);
    return { status: 204 };
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return { status: 409, data: { errors: ["car already registered"] } };
    }
    throw error;
  }
}

async function deleteCar(id) {
  const car = await Cars.findByPk(id);
  if (!car) {
    return { status: 404, data: { errors: ["car not found"] } };
  }

  await car.destroy();
  await CarItems.destroy({ where: { car_id: id } });
  return { status: 204 };
}

export { createCar, getCarById, listCars, updateCar, deleteCar };
