"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserHeader from "../../components/UserHeader";
import { getExpenseById } from "@/lib/api";

interface Receipt {
  _id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  ocrStatus: string;
  ocrResult?: string;
  uploadedAt: string;
}

interface ExpenseDetail {
  _id: string;
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
  paymentMethod?: string;
  notes?: string;
  tags: string[];
  isVerified: boolean;
}

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<ExpenseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getExpenseById(params.id as string);
        
        if (response.success && response.data) {
          setExpense(response.data.expense);
        } else {
          setError(response.message || "Failed to load expense");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchExpense();
    }
  }, [params.id]);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
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

  if (error || !expense) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Expense Not Found</h1>
            <p className="text-gray-600 mb-4">{error || "The expense you're looking for doesn't exist."}</p>
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
            {expense.receiptId?.fileUrl ? (
              <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={expense.receiptId.fileUrl}
                  alt={expense.receiptId.fileName || "Receipt"}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
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
                  <p className="text-gray-500 text-sm">No Receipt Image</p>
                  <p className="text-gray-400 text-xs mt-1">Receipt image not available</p>
                </div>
              </div>
            )}
            {expense.receiptId && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">File:</span> {expense.receiptId.fileName}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize">{expense.receiptId.ocrStatus}</span></p>
                {expense.receiptId.uploadedAt && (
                  <p><span className="font-medium">Uploaded:</span> {formatDate(expense.receiptId.uploadedAt)}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Expense Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Expense Information</h2>
            
            <div className="space-y-4">
              {/* Merchant */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Merchant</span>
                <span className="text-sm text-gray-900">{expense.merchant || "N/A"}</span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Amount</span>
                <span className="text-sm text-gray-900 font-semibold">{formatCurrency(expense.amount, expense.currency)}</span>
              </div>

              {/* Currency */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Currency</span>
                <span className="text-sm text-gray-900">{expense.currency}</span>
              </div>

              {/* Payment Method */}
              {expense.paymentMethod && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Payment Method</span>
                  <span className="text-sm text-gray-900">{expense.paymentMethod}</span>
                </div>
              )}

              {/* OCR Text */}
              {expense.ocrText && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 block mb-2">OCR Text</span>
                  <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {expense.ocrText}
                  </div>
                </div>
              )}

              {/* Notes */}
              {expense.notes && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Notes</span>
                  <span className="text-sm text-gray-700">{expense.notes}</span>
                </div>
              )}

              {/* Tags */}
              {expense.tags && expense.tags.length > 0 && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {expense.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Verification Status</span>
                <span className={`text-sm font-medium ${expense.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {expense.isVerified ? 'Verified' : 'Not Verified'}
                </span>
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
                {formatCurrency(expense.amount, expense.currency)}
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
                {formatCategory(expense.category)}
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
