'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
                  className="flex items-center justify-between p-3 border rounded-lg bg-accent/30"
                  onSubmit={(e) => handleEditSubmit(e, transaction)}
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mb-1"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                      className="mt-1"
                    >
                      <option value="">Select Category</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health">Health</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" type="submit" variant="success">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" type="button" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{transaction.description}</span>
                      <span className="font-semibold text-lg">
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
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