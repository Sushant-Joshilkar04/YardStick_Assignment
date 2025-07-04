'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];

export default function BudgetVsActualChart({ transactions, budgets, selectedMonth }) {
  const month = selectedMonth || new Date().toISOString().slice(0, 7);

  const filteredBudgets = budgets.filter(b => ALLOWED_CATEGORIES.includes(b.category));
  const filteredTransactions = transactions.filter(
    t => ALLOWED_CATEGORIES.includes(t.category) && t.date.startsWith(month)
  );

  const actualSpending = filteredTransactions
    .filter(t => t.date.startsWith(month))
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const allCategories = Array.from(new Set([
    ...filteredBudgets.map(b => b.category),
    ...Object.keys(actualSpending)
  ]));

  const chartData = allCategories.map(category => {
    const budgetObj = filteredBudgets.find(b => b.category === category);
    return {
      category,
      budget: budgetObj ? budgetObj.amount : 0,
      actual: actualSpending[category] || 0,
      remaining: Math.max(0, (budgetObj ? budgetObj.amount : 0) - (actualSpending[category] || 0))
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
        <CardDescription>
          Compare your budgeted amounts with actual spending for {selectedMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}