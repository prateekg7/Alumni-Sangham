import ApiError from "../../utils/ApiError.js";
import { ROLE_VALUES } from "../../constants/roles.js";

const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

const validatePasswordStrength = (password) => {
  const errors = [];
  if (!password || typeof password !== "string") return ["Password is required"];
  if (password.length < PASSWORD_RULES.minLength)
    errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
  if (!PASSWORD_RULES.hasUppercase.test(password))
    errors.push("One uppercase letter");
  if (!PASSWORD_RULES.hasLowercase.test(password))
    errors.push("One lowercase letter");
  if (!PASSWORD_RULES.hasDigit.test(password))
    errors.push("One number");
  if (!PASSWORD_RULES.hasSpecial.test(password))
    errors.push("One special character (!@#$%^&* etc.)");
  return errors;
};

export const validateRegister = (payload) => {
  const { email, password, role, firstName, lastName } = payload ?? {};

  const missing = ["email", "password", "role", "firstName", "lastName"]
    .filter((key) => !payload?.[key]);

  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!ROLE_VALUES.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${ROLE_VALUES.join(", ")}`);
  }

  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length) {
    // Pass individual rule failures as the errors[] array — frontend can display them as a list
    throw new ApiError(400, "Password does not meet requirements", passwordErrors);
  }
};

export const validateLogin = (payload) => {
  const { email, password } = payload ?? {};
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }
};