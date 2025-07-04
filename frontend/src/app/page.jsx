'use client';

import { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import { Toaster } from '@/components/ui/sonner'; 
import { toast } from 'sonner'; 
import DashboardSummary from '@/components/DashboardSummary';
import CategoryPieChart from '@/components/CategoryPieChart';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prefillCategory, setPrefillCategory] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      
      await fetchTransactions();
      toast.success('Transaction added successfully!');
    } catch (err) {
      toast.error('Failed to add transaction');
    }
  };

  const handleEditTransaction = async (formData) => {
    try {
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update transaction');
      
      await fetchTransactions();
      setEditingTransaction(null);
      toast.success('Transaction updated successfully!');
      toast.info('Expense updated!'); 
    } catch (err) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      await fetchTransactions();
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleAddCategoryExpense = (category) => {
    setPrefillCategory(category);
    setEditingTransaction(null); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster />
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your expenses and visualize your spending patterns
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <DashboardSummary transactions={transactions} onAddCategoryExpense={handleAddCategoryExpense} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              initialData={editingTransaction || { category: prefillCategory }}
              onCancel={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={fetchTransactions}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
