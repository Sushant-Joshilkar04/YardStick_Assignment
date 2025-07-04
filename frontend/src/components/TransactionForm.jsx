'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TransactionForm({ onSubmit, initialData = {} }) {
  const [amount, setAmount] = useState(initialData.amount || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(initialData.date || '');
  const [category, setCategory] = useState(initialData.category || '');

  useEffect(() => {
    setCategory(initialData.category || '');
  }, [initialData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !date) {
      alert('Please fill all fields');
      return;
    }

    await onSubmit({
      amount: parseFloat(amount),
      description: description.trim(),
      date,
      category
    });

    setAmount('');
    setDescription('');
    setDate('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-class"
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
        <option value="Utilities">Utilities</option>
        <option value="Other">Other</option>
      </select>

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Add Transaction</Button>
    </form>
  );
}
