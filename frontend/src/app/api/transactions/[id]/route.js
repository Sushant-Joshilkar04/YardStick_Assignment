import connectToDB from '@/lib/mongoDB';
import Transaction from '@/models/transaction';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(req, context) {
  const { id } = await context.params; 

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
  }

  try {
    const { amount, description, date, category } = await req.json();

    if (!amount || !description || !date || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    await connectToDB();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(date),
        category
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const formattedTransaction = {
      id: updatedTransaction._id.toString(),
      amount: updatedTransaction.amount,
      description: updatedTransaction.description,
      date: updatedTransaction.date.toISOString().split('T')[0],
      category: updatedTransaction.category,
      createdAt: updatedTransaction.createdAt,
      updatedAt: updatedTransaction.updatedAt
    };

    return NextResponse.json(formattedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
  }

  try {
    await connectToDB();

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

