import connectToDB from '@/lib/mongoDB';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const transactions = await Transaction.find({}).sort({ date: -1 }).lean();

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id.toString(),
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category, 
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { amount, description, date, category } = await req.json();

    if (!amount || !description || !date || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    await connectToDB();

    const transaction = new Transaction({
      amount: parseFloat(amount),
      description: description.trim(),
      date: new Date(date),
      category
    });

    const savedTransaction = await transaction.save();

    const formattedTransaction = {
      id: savedTransaction._id.toString(),
      amount: savedTransaction.amount,
      description: savedTransaction.description,
      date: savedTransaction.date.toISOString().split('T')[0],
      category: savedTransaction.category,
      createdAt: savedTransaction.createdAt,
      updatedAt: savedTransaction.updatedAt
    };

    return NextResponse.json(formattedTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
