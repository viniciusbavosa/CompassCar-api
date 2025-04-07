import { updateCarItems } from "../services/carItemsService.js";
import { validateCarItems } from "../validators/carItemsValidation.js";

export async function updateCarItemController(req, res) {
  const validation = validateCarItems(req.body);
  if (validation) {
    return res.status(400).json(validation);
  }

  const result = await updateCarItems(req.params.id, req.body);
  return res.status(result.status).end();
}
