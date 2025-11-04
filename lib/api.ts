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

interface Receipt {
  _id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  ocrStatus: string;
  uploadedAt: string;
  ocrResult?: string;
}

interface Expense {
  _id: string;
  userId: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  receiptId?: Receipt;
  ocrText?: string;
  parsedData?: {
    parsedMerchant?: string;
    parsedDate?: string | null;
    parsedAmount?: number;
  };
  tags: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExpensesResponse {
  expenses: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get access token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

/**
 * Fetch all expenses for the authenticated user
 */
export async function getExpenses(): Promise<ApiResponse<ExpensesResponse>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Authentication required. Please login.',
        errors: [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to fetch expenses',
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

