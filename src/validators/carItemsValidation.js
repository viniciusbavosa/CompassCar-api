export function validateCarItems(items) {
  const errors = [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items is required");
    return { errors };
  }

  if (items.length > 5) {
    errors.push("items must be a maximum of 5");
  }

  const uniqueItems = new Set(items);
  if (uniqueItems.size !== items.length) {
    errors.push("items cannot be repeated");
  }

  return errors.length ? { errors } : null;
}
