"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import UserHeader from "../components/UserHeader";

export default function AllExpensesPage() {
  const router = useRouter();

  // Static mock data for expenses
  const expenses = [
    {
      id: 1,
      store: "Starbucks",
      amount: 4.50,
      date: "2024-01-15",
      category: "Food & Dining"
    },
    {
      id: 2,
      store: "Shell Gas Station",
      amount: 45.20,
      date: "2024-01-14",
      category: "Transportation"
    },
    {
      id: 3,
      store: "Amazon",
      amount: 89.99,
      date: "2024-01-13",
      category: "Shopping"
    },
    {
      id: 4,
      store: "Whole Foods",
      amount: 125.30,
      date: "2024-01-12",
      category: "Groceries"
    },
    {
      id: 5,
      store: "Netflix",
      amount: 15.99,
      date: "2024-01-11",
      category: "Entertainment"
    },
    {
      id: 6,
      store: "CVS Pharmacy",
      amount: 23.45,
      date: "2024-01-10",
      category: "Health & Wellness"
    },
    {
      id: 7,
      store: "Uber",
      amount: 12.80,
      date: "2024-01-09",
      category: "Transportation"
    },
    {
      id: 8,
      store: "Target",
      amount: 67.89,
      date: "2024-01-08",
      category: "Shopping"
    }
  ];

  const handleViewDetails = (expenseId: number) => {
    router.push(`/expenses/${expenseId}`);
  };

  const handleEdit = (expenseId: number) => {
    // Placeholder for edit functionality
    console.log("Edit expense:", expenseId);
    alert(`Edit expense with ID: ${expenseId}`);
  };

  const handleDelete = (expenseId: number) => {
    // Placeholder for delete functionality
    console.log("Delete expense:", expenseId);
    alert(`Delete expense with ID: ${expenseId}`);
  };

  const handleAddNew = () => {
    router.push("/expenses/new");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Expenses
        </h1>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.store}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(expense.id)}
                          className="border-green-500 text-green-500 hover:bg-green-50 px-2 py-1 rounded-md border transition duration-200 inline-flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(expense.id)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded-md border transition duration-200 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
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

        {/* Add New Expense Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            + Add New Expense
          </button>
        </div>
      </div>
    </div>
  );
}
