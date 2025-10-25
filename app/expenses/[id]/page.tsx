"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserHeader from "../../components/UserHeader";

interface ExpenseDetail {
  id: string;
  storeName: string;
  orderNumber: string;
  tax: number;
  total: number;
  paymentMethod: string;
  amount: number;
  date: string;
  category: string;
  receiptImage: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<ExpenseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Static mock data - in real app, this would be fetched based on the ID
  const mockExpense: ExpenseDetail = {
    id: params.id as string,
    storeName: "Starbucks Coffee",
    orderNumber: "SB-2024-001234",
    tax: 0.36,
    total: 4.50,
    paymentMethod: "Credit Card (****1234)",
    amount: 4.50,
    date: "2024-01-15",
    category: "Food & Dining",
    receiptImage: "/images/sample-receipt.jpg", // Placeholder image
    items: [
      { name: "Grande Latte", quantity: 1, price: 4.14 },
      { name: "Tax", quantity: 1, price: 0.36 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchExpense = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExpense(mockExpense);
      setLoading(false);
    };

    fetchExpense();
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading expense details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Expense Not Found</h1>
            <p className="text-gray-600 mb-4">The expense you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/expenses')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Back to Expenses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Expense Detail
        </h1>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Receipt Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt</h2>
            <div className="aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">Receipt Image</p>
                <p className="text-gray-400 text-xs mt-1">Upload receipt to view image</p>
              </div>
            </div>
          </div>

          {/* Right Column - Expense Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Expense Information</h2>
            
            <div className="space-y-4">
              {/* Store Name */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Store Name</span>
                <span className="text-sm text-gray-900">{expense.storeName}</span>
              </div>

              {/* Order Number */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Order Number</span>
                <span className="text-sm text-gray-900 font-mono">{expense.orderNumber}</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Payment Method</span>
                <span className="text-sm text-gray-900">{expense.paymentMethod}</span>
              </div>

              {/* Items List */}
              <div className="py-2">
                <span className="text-sm font-medium text-gray-600 block mb-3">Items</span>
                <div className="space-y-2">
                  {expense.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Tax</span>
                <span className="text-sm text-gray-900">{formatCurrency(expense.tax)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(expense.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Amount */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatCurrency(expense.amount)}
              </div>
              <div className="text-sm text-blue-800 font-medium">Amount</div>
            </div>

            {/* Date */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600 mb-1">
                {formatDate(expense.date)}
              </div>
              <div className="text-sm text-green-800 font-medium">Date</div>
            </div>

            {/* Category */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600 mb-1">
                {expense.category}
              </div>
              <div className="text-sm text-purple-800 font-medium">Category</div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/expenses')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Expenses
          </button>
        </div>
      </div>
    </div>
  );
}
