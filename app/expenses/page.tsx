"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import UserHeader from "../components/UserHeader";
import { getExpenses, deleteExpense } from "@/lib/api";

interface Expense {
  _id: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  isVerified: boolean;
}

export default function AllExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getExpenses();
      
      if (response.success && response.data) {
        setExpenses(response.data.expenses);
      } else {
        setError(response.message || "Failed to load expenses");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (expenseId: string) => {
    router.push(`/expenses/${expenseId}`);
  };

  const handleEdit = (expenseId: string) => {
    router.push(`/expenses/edit/${expenseId}`);
  };

  const handleDelete = async (expenseId: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteExpense(expenseId);

      if (response.success) {
        // Show success message
        alert("Expense deleted successfully!");
        // Refresh the expenses list
        fetchExpenses();
      } else {
        alert(response.message || "Failed to delete expense. Please try again.");
      }
    } catch (err) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleAddNew = () => {
    router.push("/expenses/new");
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategory = (category: string) => {
    // Capitalize first letter
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Error loading expenses</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchExpenses}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Expenses
        </h1>

        {/* Expenses Table */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No expenses found</p>
            <p className="text-gray-400 text-sm mb-6">Get started by adding your first expense</p>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              + Add New receipt
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Table Header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Merchant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Is Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.merchant}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(expense.amount, expense.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {expense.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(expense.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatCategory(expense.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expense.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.isVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(expense._id)}
                              className="border-green-500 text-green-500 hover:bg-green-50 px-2 py-1 rounded-md border transition duration-200 inline-flex items-center justify-center"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(expense._id)}
                              className="border-blue-500 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded-md border transition duration-200 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="border-red-500 text-red-500 hover:bg-red-50 px-3 py-1 rounded-md border transition duration-200 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New receipt Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
              >
                + Add New receipt
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
