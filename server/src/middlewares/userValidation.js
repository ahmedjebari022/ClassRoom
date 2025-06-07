const yup = require('yup');


const handleValidationErrors = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = error.inner.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }
      next(error);
    }
  };
};


const registrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .trim(),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .trim(),

  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .lowercase()
    .trim(),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    ),

  role: yup
    .string()
    .oneOf(['student', 'instructor', 'admin'], 'Role must be either student, instructor, or admin')
    .default('student')
});


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .trim(),

  password: yup
    .string()
    .required('Password is required')
});


const profileUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .trim(),

  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .trim(),

  email: yup
    .string()
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .lowercase()
    .trim(),

  
});


const changePasswordSchema = yup.object().shape({
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

  
});

module.exports = {
  validateRegistration: handleValidationErrors(registrationSchema),
  validateLogin: handleValidationErrors(loginSchema),
  validateProfileUpdate: handleValidationErrors(profileUpdateSchema),
  validateChangePassword: handleValidationErrors(changePasswordSchema),
  
 
  registrationSchema,
  loginSchema,
  profileUpdateSchema,
  changePasswordSchema
};