'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      currencyDisplay: 'symbol',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const startEditing = (transaction) => {
    setEditId(transaction.id);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount.toString());
    setEditDate(transaction.date);
    setEditCategory(transaction.category);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditDescription('');
    setEditAmount('');
    setEditDate('');
    setEditCategory('');
  };

  const handleEditSubmit = async (e, transaction) => {
    e.preventDefault();
    if (!editAmount || !editDescription || !editDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(editAmount),
          description: editDescription.trim(),
          date: editDate,
          category: editCategory,
        }),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      if (onEdit) await onEdit();
    } catch (err) {
      alert('Failed to update transaction');
    }
    cancelEditing();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Add your first transaction above!
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) =>
              editId === transaction.id ? (
                <form
                  key={transaction.id}
                  className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-3 border rounded-lg bg-accent/30"
                  onSubmit={(e) => handleEditSubmit(e, transaction)}
                >
                  <div className="flex-1 w-full flex flex-col gap-2">
                    <Input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full sm:w-32"
                      />
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full sm:w-40"
                      />
                    </div>
                    <Select value={editCategory} onValueChange={setEditCategory} required>
                      <SelectTrigger className="w-full sm:w-60">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end mt-2 lg:mt-0">
                    <Button size="sm" type="submit" variant="success" className="w-full sm:w-auto">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={cancelEditing}
                      className="w-full sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                      <span className="font-medium">{transaction.description}</span>
                      <span className="font-semibold text-lg">
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
