'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TransactionForm({ onSubmit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

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
    });

    setAmount('');
    setDescription('');
    setDate('');
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
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Add Transaction</Button>
    </form>
  );
}
