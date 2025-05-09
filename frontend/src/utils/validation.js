/**
 * Email validation regex
 * @type {RegExp}
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
 * @type {RegExp}
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

/**
 * Phone number validation regex
 * @type {RegExp}
 */
const PHONE_REGEX = /^\d{10,15}$/;

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  return PHONE_REGEX.test(phone);
};

/**
 * Validate login form
 * @param {Object} values - Form values
 * @returns {Object} - Validation errors
 */
export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

/**
 * Validate registration form
 * @param {Object} values - Form values
 * @returns {Object} - Validation errors
 */
export const validateRegistrationForm = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.gender) {
    errors.gender = 'Gender is required';
  }

  if (values.role === 'doctor') {
    if (!values.specialization) {
      errors.specialization = 'Specialization is required';
    }
  }

  return errors;
};

/**
 * Validate profile update form
 * @param {Object} values - Form values
 * @returns {Object} - Validation errors
 */
export const validateProfileForm = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  if (values.phone && !isValidPhone(values.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  if (values.role === 'doctor') {
    if (!values.specialization) {
      errors.specialization = 'Specialization is required';
    }

    if (!values.ticketPrice) {
      errors.ticketPrice = 'Ticket price is required';
    } else if (isNaN(values.ticketPrice) || values.ticketPrice <= 0) {
      errors.ticketPrice = 'Ticket price must be a positive number';
    }
  }

  return errors;
};

/**
 * Validate password update form
 * @param {Object} values - Form values
 * @returns {Object} - Validation errors
 */
export const validatePasswordForm = (values) => {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!isValidPassword(values.newPassword)) {
    errors.newPassword = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
