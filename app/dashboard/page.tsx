"use client";

import { useState } from "react";
import UserHeader from "../components/UserHeader";
import Sidebar from "../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

// Static data for dashboard
const categoryData = [
  { name: "Groceries", value: 850, color: "#3B82F6" },
  { name: "Dining", value: 650, color: "#10B981" },
  { name: "Transportation", value: 520, color: "#F59E0B" },
  { name: "Entertainment", value: 380, color: "#8B5CF6" },
  { name: "Other", value: 800, color: "#EF4444" },
];

const monthlyData = [
  { month: "Jan", amount: 500 },
  { month: "Feb", amount: 700 },
  { month: "Mar", amount: 850 },
  { month: "Apr", amount: 1050 },
  { month: "May", amount: 1200 },
];

const totalSpending = 3200;
const topCategory = { name: "Groceries", amount: 850 };

export default function DashboardPage() {
  const [filterOption, setFilterOption] = useState("2025");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <UserHeader />

      {/* Main Layout with Sidebar */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              
              {/* Filter Dropdown */}
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2025">By Year: 2025</option>
                <option value="2024">By Year: 2024</option>
                <option value="2023">By Year: 2023</option>
              </select>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Total Spending Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">Total Spending ({filterOption})</h2>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  ${totalSpending.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Across all categories</p>
              </div>

              {/* Top Spending Category Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">Top Spending Category for ({filterOption})</h2>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{topCategory.name}</p>
                <p className="text-xl text-gray-600">${topCategory.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expenses by Category - Pie Chart */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">Expenses by Category for ({filterOption})</h2>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Category Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {category.name}: ${category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spending Comparison - Bar Chart */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Monthly Spending Comparison for ({filterOption})
                  </h2>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6B7280" }}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280" }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "#FFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill="#3B82F6"
                      radius={[8, 8, 0, 0]}
                      name="Spending"
                    />
                  </BarChart>
                </ResponsiveContainer>

                {/* Monthly Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average per month:</span>
                    <span className="font-semibold text-gray-900">
                      $
                      {(
                        monthlyData.reduce((acc, curr) => acc + curr.amount, 0) /
                        monthlyData.length
                      ).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Quick Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-90 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-1 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categoryData.reduce((acc, curr) => acc + curr.value, 0)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-1 font-medium">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-1 font-medium">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${monthlyData[monthlyData.length - 1].amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

