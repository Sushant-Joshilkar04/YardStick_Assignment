import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
  type: String,
  enum: ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'],
  required: true,
},
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  }
}, {
  timestamps: true
});

TransactionSchema.index({ date: -1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
