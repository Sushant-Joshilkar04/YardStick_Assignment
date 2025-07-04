'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      <Select value={category} onValueChange={setCategory} required>
        <SelectTrigger className="input-class">
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
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Add Transaction</Button>
    </form>
  );
}
