'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetForm from '@/components/BudgetForm';
import BudgetList from '@/components/BudgetList';
import BudgetVsActualChart from '@/components/BvsAChart';
import SpendingInsights from '@/components/Insights';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import DashboardSummary from '@/components/DashboardSummary';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [prefillCategory, setPrefillCategory] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

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

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${selectedMonth}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      toast.error('Failed to load budgets');
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      await fetchTransactions();
      setEditingTransaction(null);
      toast.success('Transaction updated successfully!');
    } catch (err) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete transaction');
      await fetchTransactions();
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleAddBudget = async (formData) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add budget');
      await fetchBudgets();
      toast.success('Budget set successfully!');
    } catch (err) {
      toast.error('Failed to set budget');
    }
  };

  const handleEditBudget = async (formData) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingBudget.id }),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      await fetchBudgets();
      setEditingBudget(null);
      toast.success('Budget updated successfully!');
    } catch (err) {
      toast.error('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    try {
      const response = await fetch(`/api/budgets?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete budget');
      await fetchBudgets();
      toast.success('Budget deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditingBudget(null);
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
          <p className="text-muted-foreground">Loading...</p>
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
            Track expenses, set budgets, and get insights on your spending
          </p>
        </header>

        <DashboardSummary transactions={transactions} onAddCategoryExpense={handleAddCategoryExpense} />

        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              onEdit={setEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Label htmlFor="month-select">Select Month:</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {
                    Array.from({ length: 12 }).map((_, i) => {
                      const month = new Date(new Date().setMonth(new Date().getMonth() - i));
                      const monthStr = month.toISOString().slice(0, 7);
                      return (
                        <SelectItem key={monthStr} value={monthStr}>
                          {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </SelectItem>
                      );
                    })
                  }
                </SelectContent>
              </Select>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-1">
                            <BudgetForm
                              onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
                              initialData={editingBudget || { month: selectedMonth }}
                              onCancel={handleCancelEdit}
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <BudgetList
                              budgets={budgets}
                              onEdit={setEditingBudget}
                              onDelete={handleDeleteBudget}
                            /><br/>
                            <BudgetVsActualChart
                              budgets={budgets}
                              transactions={transactions.filter(
                                (t) => t.date.slice(0, 7) === selectedMonth
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
            
                      <TabsContent value="insights" className="space-y-6">
                        <SpendingInsights
                          transactions={transactions}
                          budgets={budgets}
                          selectedMonth={selectedMonth}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              );
            }