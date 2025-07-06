import instance from "@/axios/axios";

interface RegisterSchema {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  statusCode: number;
  data: {
    id: number;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
  };
  timestamp: Date;
}

interface Error {
  message: string;
  error: string;
  statusCode: number;
}

const register = async (
  registerSchema: RegisterSchema
): Promise<RegisterResponse | any> => {
  try {
    const response: Response = await instance.post(
      "/auth/register",
      registerSchema
    );
    return response;
  } catch (error: any) {
    return error.response.data;
  }
};

interface LoginSchema {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  statusCode: number;
  data: {
    id: number;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    access_token: string;
  };
  timestamp: Date;
}

const login = async (
  loginSchema: LoginSchema
): Promise<LoginResponse | any> => {
  try {
    const response: LoginResponse = await instance.post(
      "auth/login",
      loginSchema
    );
    localStorage.setItem("access_token", response.data.access_token);
    return response;
  } catch (error: any) {
    return error.response.data;
  }
};

export { register, login };
