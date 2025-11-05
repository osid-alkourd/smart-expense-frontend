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

interface ExpenseResponse {
  expense: Expense;
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
 * Handle authentication errors (401 status)
 * Clears localStorage and redirects to login page
 */
function handleAuthError() {
  if (typeof window !== 'undefined') {
    // Clear authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse<null>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      // If no token, just clear local storage and redirect
      handleAuthError();
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Clear local storage regardless of response
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }

    // Handle 401 or other errors
    if (!response.ok) {
      // Even if logout fails on server, we clear local storage
      return {
        success: true,
        message: result.message || 'Logged out successfully',
      };
    }

    return {
      success: true,
      message: result.message || 'Logged out successfully',
    };
  } catch (error) {
    // Even on network error, clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}

/**
 * Fetch a single expense by ID with receipt information
 */
export async function getExpenseById(expenseId: string): Promise<ApiResponse<ExpenseResponse>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      handleAuthError();
      return {
        success: false,
        message: 'Authentication required. Please login.',
        errors: [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Handle 401 Unauthorized - Invalid or expired token
    if (response.status === 401) {
      handleAuthError();
      return {
        success: false,
        message: result.message || 'Authentication required. Please login.',
        errors: result.errors || [],
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to fetch expense',
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
 * Fetch all expenses for the authenticated user
 */
export async function getExpenses(): Promise<ApiResponse<ExpensesResponse>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      handleAuthError();
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

    // Handle 401 Unauthorized - Invalid or expired token
    if (response.status === 401) {
      handleAuthError();
      return {
        success: false,
        message: result.message || 'Authentication required. Please login.',
        errors: result.errors || [],
      };
    }

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

/**
 * Upload a receipt image
 */
export async function uploadReceipt(file: File): Promise<ApiResponse<{
  receipt: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    ocrStatus: string;
    uploadedAt: string;
  };
}>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      handleAuthError();
      return {
        success: false,
        message: 'Authentication required. Please login.',
        errors: [],
      };
    }

    // Validate file type (only images)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedImageTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
        errors: [],
      };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
        errors: [],
      };
    }

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch(`${API_BASE_URL}/receipts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      },
      body: formData,
    });

    const result = await response.json();

    // Handle 401 Unauthorized - Invalid or expired token
    if (response.status === 401) {
      handleAuthError();
      return {
        success: false,
        message: result.message || 'Authentication required. Please login.',
        errors: result.errors || [],
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to upload receipt',
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
 * Update an expense by ID
 */
export async function updateExpense(
  expenseId: string,
  updateData: {
    merchant?: string;
    amount?: number;
    category?: string;
    isVerified?: boolean;
  }
): Promise<ApiResponse<ExpenseResponse>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      handleAuthError();
      return {
        success: false,
        message: 'Authentication required. Please login.',
        errors: [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    // Handle 401 Unauthorized - Invalid or expired token
    if (response.status === 401) {
      handleAuthError();
      return {
        success: false,
        message: result.message || 'Authentication required. Please login.',
        errors: result.errors || [],
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to update expense',
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
 * Delete an expense by ID
 */
export async function deleteExpense(expenseId: string): Promise<ApiResponse<null>> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      handleAuthError();
      return {
        success: false,
        message: 'Authentication required. Please login.',
        errors: [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Handle 401 Unauthorized - Invalid or expired token
    if (response.status === 401) {
      handleAuthError();
      return {
        success: false,
        message: result.message || 'Authentication required. Please login.',
        errors: result.errors || [],
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to delete expense',
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

