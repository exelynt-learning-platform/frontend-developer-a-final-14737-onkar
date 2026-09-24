// Centralised, reusable validation for the Employee form.
// Each field validator returns an error string, or '' when the value is valid.

const NAME_MIN = 2;
const NAME_MAX = 50;
const STATE_MIN = 2;
const STATE_MAX = 50;
const DISTRICT_MIN = 2;
const DISTRICT_MAX = 50;

// Letters, spaces, apostrophes and hyphens only (rejects digits/symbols).
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Valid 10-digit Indian mobile numbers start with 6, 7, 8 or 9.
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export const validateName = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Name is required.';
  if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
    return `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`;
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return 'Name can only contain letters, spaces, hyphens and apostrophes.';
  }
  return '';
};

export const validateEmail = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_PATTERN.test(trimmed)) return 'Please enter a valid email address.';
  return '';
};

export const validateMobile = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Mobile number is required.';
  if (!MOBILE_PATTERN.test(trimmed)) return 'Mobile number must be a valid 10-digit Indian mobile number.';
  return '';
};

export const validateCountry = (value) => {
  if (!value || !String(value).trim()) return 'Country is required.';
  return '';
};

export const validateState = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'State is required.';
  if (trimmed.length < STATE_MIN || trimmed.length > STATE_MAX) {
    return `State must be between ${STATE_MIN} and ${STATE_MAX} characters.`;
  }
  return '';
};

export const validateDistrict = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'District is required.';
  if (trimmed.length < DISTRICT_MIN || trimmed.length > DISTRICT_MAX) {
    return `District must be between ${DISTRICT_MIN} and ${DISTRICT_MAX} characters.`;
  }
  return '';
};

export const validateEmployeeForm = (values) => {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    mobile: validateMobile(values.mobile),
    country: validateCountry(values.country),
    state: validateState(values.state),
    district: validateDistrict(values.district),
  };
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });
  return errors;
};

export const validateEmployeeId = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Please enter an employee ID to search.';
  return '';
};

export const isFormValid = (errors) => Object.keys(errors).length === 0;
