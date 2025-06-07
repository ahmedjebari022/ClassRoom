import * as yup from 'yup';

// Profile update validation schema
export const profileUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

 
});

// Password change validation schema
export const passwordChangeSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),

  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    ),

  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .test('passwords-match', 'Password confirmation does not match new password', function(value) {
      return this.parent.newPassword === value;
    })
});

// Registration validation schema
export const registrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, '*only contains letters and spaces'),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase lowercase numbers'
    ),

  role: yup
    .string()
    .oneOf(['student', 'instructor', 'admin'], 'Role must be either student, instructor, or admin')
});

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address'),

  password: yup
    .string()
    .required('Password is required')
});