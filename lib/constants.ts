export const PASSWORD_REGEXP = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])(?!.*\s).+$/,
);
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const TITLE_MIN_LENGTH = 2;
export const TITLE_MAX_LENGTH = 50;

export const PRODUCT_DESCRIPTION_MIN_LENGTH = 10;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 500;

export const POST_DESCRIPTION_MIN_LENGTH = 2;
export const POST_DESCRIPTION_MAX_LENGTH = 100;

export const COMMENT_MIN_LENGTH = 1;
export const COMMENT_MAX_LENGTH = 50;
export const COMMENT_LIMIT_COUNT = 3;
export const COMMENT_LIMIT_TIME = 5 * 60 * 1000; // 5 minutes

export const STREAM_TITLE_MAX_LENGTH = 30;

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  EMAIL_TAKEN: "This email is already registered",
  EMAIL_NOT_REGISTERED: "This email is not registered",

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
  USERNAME_TAKEN: "This username is already taken",

  CODE_INVALID: "Code does not exist",
  CODE_EXPIRED: "Code is expired",

  PHONE_INVALID_FORMAT: "Please enter a valid phone number",
  PHONE_INVALID_LOCALE: "Only Korean phone numbers are allowed",

  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_SHORT: "Title must be at least 2 characters long",
  TITLE_TOO_LONG: "Title must be less than 50 characters",

  PRICE_REQUIRED: "Price is required",
  PRICE_INVALID: "Please enter a valid price",
  PRICE_NEGATIVE: "Price cannot be negative",

  DESCRIPTION_REQUIRED: "Description is required",
  PRODUCT_DESCRIPTION_TOO_SHORT:
    "Description must be at least 10 characters long",
  PRODUCT_DESCRIPTION_TOO_LONG: "Description must be less than 500 characters",
  POST_DESCRIPTION_TOO_SHORT: "Description must be at least 2 characters long",
  POST_DESCRIPTION_TOO_LONG: "Description must be less than 100 characters",

  PHOTO_REQUIRED: "Photo is required",

  COMMENT_REQUIRED: "Comment is required",
  COMMENT_TOO_LONG: "Comment must be less than 50 characters",

  COMMENT_LIMIT_REACHED: "Oops! You can only post 3 comments in 5 minutes.",

  STREAM_TITLE_NOT_STRING: "Stream title must be a string",
  STREAM_TITLE_REQUIRED: "Stream title is required",
  STREAM_TITLE_TOO_LONG: `Stream title must be less than ${STREAM_TITLE_MAX_LENGTH} characters`,
  STREAM_CREATION_FAILED: "Failed to start the live stream. Please try again.",

  PROFILE_EDIT_ERROR: "User Profile Edit failed.",
};

export const HASH_ROUNDS = 12;

export const BASE_PHOTO = "/goguma.jpg";

export const SECOND = 1000;
export const MINUTE = 1000 * 60;
export const HOUR = 1000 * 60 * 60;
export const DAY = 1000 * 60 * 60 * 24;
export const MONTH = 1000 * 60 * 60 * 24 * 30;
export const YEAR = 1000 * 60 * 60 * 24 * 365;

export const PRODUCTS_PER_PAGE = 1;

export const ALLOWED_TYPES = ["image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
