"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getDashboardData, DashboardData } from "@/lib/api";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#22D3EE",
  "#F472B6",
  "#34D399",
];

const DEFAULT_FILTER_YEAR = "2025";
const YEAR_OPTIONS = Array.from({ length: 16 }, (_, index) => `${2025 + index}`);

const getMonthLabel = (monthNumber: number) => {
  if (Number.isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return "Unknown";
  }

  return new Date(0, monthNumber - 1).toLocaleString("en-US", {
    month: "short",
  });
};

type CategoryChartItem = {
  name: string;
  value: number;
  color: string;
  percentage: number;
  expenseCount: number;
};

type MonthlyChartItem = {
  month: string;
  amount: number;
  expenseCount: number;
};

export default function DashboardPage() {
  const [filterOption, setFilterOption] = useState<string>(DEFAULT_FILTER_YEAR);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const yearNumber = Number(filterOption);
        const response = await getDashboardData(
          Number.isNaN(yearNumber) ? undefined : yearNumber
        );

        if (!isMounted) {
          return;
        }

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setDashboardData(null);

          const message = response.message || "Failed to load dashboard data.";
          const normalizedMessage =
            message === "Invalid token."
              ? "Unauthenticated: Please log in to continue."
              : message;
          setError(normalizedMessage);

          if (typeof window !== "undefined" && message === "Invalid token.") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setDashboardData(null);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [filterOption]);

  const categoryData = useMemo<CategoryChartItem[]>(() => {
    if (!dashboardData?.categoryBreakdown?.length) {
      return [];
    }

    return dashboardData.categoryBreakdown.map((item, index) => ({
      name: item.category || "Uncategorized",
      value: Number(item.totalAmount ?? 0),
      color: CHART_COLORS[index % CHART_COLORS.length],
      percentage: Number(item.percentageOfYear ?? 0),
      expenseCount: Number(item.expenseCount ?? 0),
    }));
  }, [dashboardData]);

  const monthlyData = useMemo<MonthlyChartItem[]>(() => {
    if (!dashboardData?.monthlyComparison?.length) {
      return [];
    }

    return dashboardData.monthlyComparison.map((item) => ({
      month: getMonthLabel(Number(item.month)),
      amount: Number(item.totalAmount ?? 0),
      expenseCount: Number(item.expenseCount ?? 0),
    }));
  }, [dashboardData]);

  const totalSpending = dashboardData?.yearlySummary?.totalAmount ?? 0;
  const expenseCount = dashboardData?.yearlySummary?.expenseCount ?? 0;
  const averageMonthlySpending =
    dashboardData?.yearlySummary?.averageMonthlySpending ?? 0;
  const topCategory = dashboardData?.topCategory ?? null;
  const totalExpensesAllTime = dashboardData?.allTimeSummary?.totalAmount ?? 0;
  const categoryCount = dashboardData?.allTimeSummary?.categoryCount ?? categoryData.length;
  const currentMonthTotal = dashboardData?.allTimeSummary?.currentMonthTotal ?? 0;
  const hasData = !!dashboardData;

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
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    By Year: {year}
                  </option>
                ))}
              </select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && !hasData && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-6 text-center text-gray-600">
                No dashboard data available for the selected year.
              </div>
            )}

            {!loading && hasData && (
              <>
                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Total Spending Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Total Spending ({filterOption})
                      </h2>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      ${totalSpending.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expenseCount} expense(s) recorded this year
                    </p>
                  </div>

                  {/* Top Spending Category Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Top Spending Category for ({filterOption})
                      </h2>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {topCategory?.name ?? "No data"}
                    </p>
                    <p className="text-xl text-gray-600">
                      ${Number(topCategory?.totalAmount ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                    {topCategory && (
                      <p className="text-sm text-gray-500 mt-1">
                        {topCategory.percentageOfYear.toFixed(1)}% of yearly spending
                      </p>
                    )}
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Expenses by Category - Pie Chart */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Expenses by Category for ({filterOption})
                      </h2>
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
                          label={({ name, percent }) =>
                            typeof percent === "number"
                              ? `${name}: ${(percent * 100).toFixed(0)}%`
                              : name
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
                          formatter={(value: number) =>
                            `$${value.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Category Legend */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categoryData.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No category data available.
                        </p>
                      )}
                      {categoryData.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm text-gray-700">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <p>
                              ${category.value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p>
                              {category.percentage.toFixed(1)}% · {category.expenseCount} expense(s)
                            </p>
                          </div>
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
                      <BarChart
                        data={monthlyData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 32 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "#6B7280" }}
                          axisLine={{ stroke: "#E5E7EB" }}
                          interval={0}
                          tickMargin={12}
                        />
                        <YAxis
                          tick={{ fill: "#6B7280" }}
                          axisLine={{ stroke: "#E5E7EB" }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`,
                            "Amount",
                          ]}
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
                          ${averageMonthlySpending.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                        ${totalExpensesAllTime.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4">
                      <p className="text-gray-700 text-sm mb-1 font-medium">Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{categoryCount}</p>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4">
                      <p className="text-gray-700 text-sm mb-1 font-medium">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${currentMonthTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

