import Cars from "./Cars.js";
import CarItems from "./CarsItems.js";

Cars.hasMany(CarItems, {
  foreignKey: "car_id",
  as: "items",
});

CarItems.belongsTo(Cars, {
  foreignKey: "car_id",
  as: "car",
});

export { Cars, CarItems };
