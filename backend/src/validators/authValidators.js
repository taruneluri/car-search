export const registerSchema = {
  name: { required: true, type: "string", minLength: 2 },
  email: { required: true, email: true },
  password: { required: true, type: "string", minLength: 6 },
};

export const loginSchema = {
  email: { required: true, email: true },
  password: { required: true, type: "string", minLength: 6 },
};

export const adminLoginSchema = {
  email: { required: true, email: true },
  password: { required: true, type: "string", minLength: 8 },
};
