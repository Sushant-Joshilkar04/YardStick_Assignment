import connectToDB from '@/lib/mongoDB';
import Budget from '@/models/budget';
import { NextResponse } from 'next/server';

const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    
    await connectToDB();
    
    let query = {};
    if (month) {
      query.month = month;
    }
    
    const budgets = await Budget.find(query).sort({ category: 1 }).lean();
    
    const formattedBudgets = budgets.map(budget => ({
      id: budget._id.toString(),
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt
    }));

    return NextResponse.json(formattedBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { category, amount, month } = await req.json();

    if (!category || !amount || !month || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    await connectToDB();

    const budget = new Budget({
      category: category.trim(),
      amount: parseFloat(amount),
      month
    });

    const savedBudget = await budget.save();

    const formattedBudget = {
      id: savedBudget._id.toString(),
      category: savedBudget.category,
      amount: savedBudget.amount,
      month: savedBudget.month,
      createdAt: savedBudget.createdAt,
      updatedAt: savedBudget.updatedAt
    };

    return NextResponse.json(formattedBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Budget already exists for this category and month' }, { status: 400 });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, category, amount, month } = await req.json();

    if (!id || !category || !amount || !month || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    await connectToDB();

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        category: category.trim(),
        amount: parseFloat(amount),
        month
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    const formattedBudget = {
      id: updatedBudget._id.toString(),
      category: updatedBudget.category,
      amount: updatedBudget.amount,
      month: updatedBudget.month,
      createdAt: updatedBudget.createdAt,
      updatedAt: updatedBudget.updatedAt
    };

    return NextResponse.json(formattedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Budget ID required' }, { status: 400 });
    }

    await connectToDB();

    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}