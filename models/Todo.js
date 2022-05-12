import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide todo title'],
      maxlength: 50,
    },
    message: {
      type: String,
      required: [true, 'Please provide todo message'],
      maxlength: 300,
    },
    category: {
      type: String,
      required: [true, 'Please provide todo category'],
    },
    status: {
      type: String,
      enum: ['done', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Todo', TodoSchema)
