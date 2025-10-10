export const PASSWORD_REGEXP = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])(?!.*\s).+$/,
);
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_COMPLEXITY:
    "Password must have uppercase, lowercase, number, special character, and no spaces.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",
  PASSWORD_TOO_LONG: "Password must be less than 20 characters",
  PASSWORDS_DO_NOT_MATCH: "Password confirmation does not match",
  PASSWORD_WRONG: "Wrong Password",
  USERNAME_REQUIRED: "Username is required",
  USERNAME_INVALID: "Please enter a valid username",
  USERNAME_TOO_SHORT: "Username must be at least 3 characters long",
  USERNAME_TOO_LONG: "Username must be less than 15 characters",
  USERNAME_CANNOT_CONTAIN_ADMIN: "Username cannot contain 'admin'",
};
