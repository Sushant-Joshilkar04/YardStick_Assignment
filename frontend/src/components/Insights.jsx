'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];

export default function SpendingInsights({ transactions, budgets, selectedMonth }) {
  const filteredBudgets = budgets.filter(b => ALLOWED_CATEGORIES.includes(b.category));
  const filteredTransactions = transactions.filter(t => ALLOWED_CATEGORIES.includes(t.category));

  const actualSpending = filteredTransactions
    .filter(t => t.date.startsWith(selectedMonth))
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const insights = [];

  filteredBudgets.forEach(budget => {
    const actual = actualSpending[budget.category] || 0;
    const percentage = (actual / budget.amount) * 100;
    
    if (percentage > 90) {
      insights.push({
        type: 'warning',
        category: budget.category,
        message: `You've spent ${percentage.toFixed(1)}% of your ${budget.category} budget`,
        icon: AlertTriangle,
        color: 'text-yellow-600'
      });
    } else if (percentage > 100) {
      insights.push({
        type: 'danger',
        category: budget.category,
        message: `You've exceeded your ${budget.category} budget by ₹${(actual - budget.amount).toFixed(2)}`,
        icon: TrendingUp,
        color: 'text-red-600'
      });
    } else if (percentage < 50) {
      insights.push({
        type: 'good',
        category: budget.category,
        message: `Great job! You're well under budget for ${budget.category}`,
        icon: CheckCircle,
        color: 'text-green-600'
      });
    }
  });

  Object.keys(actualSpending).forEach(category => {
    if (!filteredBudgets.find(b => b.category === category)) {
      insights.push({
        type: 'info',
        category,
        message: `Consider setting a budget for ${category} (spent ₹${actualSpending[category].toFixed(2)})`,
        icon: TrendingDown,
        color: 'text-blue-600'
      });
    }
  });

  const totalBudget = filteredBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalActual = Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>
          Smart insights about your spending patterns for {selectedMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall summary */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Budget vs Actual</span>
              <span className={`font-bold ${totalActual > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                ₹{totalActual.toFixed(2)} / ₹{totalBudget.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${totalActual > totalBudget ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((totalActual / totalBudget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                    <p className="text-sm">{insight.message}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No insights available. Set budgets to get spending insights.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}