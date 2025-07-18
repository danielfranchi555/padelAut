// Tipo del estado devuelto

export type ActionStateLogin = {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  success: boolean;
  formError?: string;
  values?: {
    email?: string;
    password?: string;
  };
};

export type ActionStateRegister = {
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  formError?: string;
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export type login = {
  email: string;
  password: string;
};
