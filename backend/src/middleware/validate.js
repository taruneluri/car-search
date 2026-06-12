import { ApiError } from "../utils/apiError.js";

const getValue = (source, path) =>
  path.split(".").reduce((value, key) => (value ? value[key] : undefined), source);

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === "string" && value.trim() === "");

const validators = {
  string: (value) => typeof value === "string",
  number: (value) => Number.isFinite(Number(value)),
  array: (value) => Array.isArray(value),
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "")),
};

export const validate = (schema) => (req, _res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = getValue(req.body, field);

    if (rules.required && isMissing(value)) {
      errors.push({ field, message: `${field} is required.` });
      return;
    }

    if (isMissing(value)) return;

    if (rules.type && !validators[rules.type]?.(value)) {
      errors.push({ field, message: `${field} must be a ${rules.type}.` });
    }

    if (rules.email && !validators.email(value)) {
      errors.push({ field, message: `${field} must be a valid email.` });
    }

    if (rules.minLength && String(value).length < rules.minLength) {
      errors.push({
        field,
        message: `${field} must be at least ${rules.minLength} characters.`,
      });
    }

    if (rules.min !== undefined && Number(value) < rules.min) {
      errors.push({ field, message: `${field} must be at least ${rules.min}.` });
    }

    if (rules.max !== undefined && Number(value) > rules.max) {
      errors.push({ field, message: `${field} must be at most ${rules.max}.` });
    }
  });

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed.", errors));
  }

  return next();
};
