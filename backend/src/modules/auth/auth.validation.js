export const validateRegister = (payload) => {
  if (!payload?.email || !payload?.password || !payload?.role) {
    const err = new Error("email, password and role are required");
    err.statusCode = 400;
    throw err;
  }
};

export const validateLogin = (payload) => {
  if (!payload?.email || !payload?.password) {
    const err = new Error("email and password are required");
    err.statusCode = 400;
    throw err;
  }
};
