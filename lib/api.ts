const API_BASE_URL = 'http://localhost:5000/api';

interface ApiError {
  field?: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailConfirmed: boolean;
  };
  accessToken: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailConfirmed: boolean;
  };
  accessToken: string;
}

/**
 * Register a new user
 */
export async function register(
  data: RegisterData
): Promise<ApiResponse<RegisterResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Registration failed',
        errors: result.errors || [],
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      errors: [],
    };
  }
}

/**
 * Login user
 */
export async function login(
  data: LoginData
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Login failed',
        errors: result.errors || [],
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      errors: [],
    };
  }
}

