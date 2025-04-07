function validateCarCreate(data) {
  const errors = [];

  if (!data.brand) errors.push("brand is required");
  if (!data.model) errors.push("model is required");
  if (!data.year) errors.push("year is required");
  if (!data.plate) errors.push("plate is required");

  if (errors.length) return { errors };

  const nextYear = new Date().getFullYear() + 1;
  if (data.year < nextYear - 10 || data.year > nextYear) {
    errors.push(`year must be between ${nextYear - 10} and ${nextYear}`);
  }

  const plateRegex = /^[A-Z]{3}-[0-9][A-J0-9][0-9]{2}$/;
  if (!plateRegex.test(data.plate)) {
    errors.push("plate must be in the correct format ABC-1C34");
  }

  return errors.length ? { errors } : null;
}

function validateCarUpdate(data) {
  const errors = [];

  if (data.brand && !data.model) {
    errors.push("model must also be informed");
  }

  if (data.year) {
    const nextYear = new Date().getFullYear() + 1;
    if (data.year < nextYear - 10 || data.year > nextYear) {
      errors.push(`year must be between ${nextYear - 10} and ${nextYear}`);
    }
  }

  if (data.plate) {
    const plateRegex = /^[A-Z]{3}-[0-9][A-J0-9][0-9]{2}$/;
    if (!plateRegex.test(data.plate)) {
      errors.push("plate must be in the correct format ABC-1C34");
    }
  }

  return errors.length ? { errors } : null;
}

export { validateCarCreate, validateCarUpdate };
