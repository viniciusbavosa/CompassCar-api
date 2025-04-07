import CarItems from "../model/CarsItems.js";
import Cars from "../model/Cars.js";

export async function updateCarItems(carId, items) {
  const car = await Cars.findByPk(carId);
  if (!car) {
    return { status: 404, data: { errors: ["car not found"] } };
  }

  // Delete existing items
  await CarItems.destroy({ where: { car_id: carId } });

  // Create new items
  const newItems = items.map((name) => ({ name, car_id: carId }));
  await CarItems.bulkCreate(newItems);

  return { status: 204 };
}
