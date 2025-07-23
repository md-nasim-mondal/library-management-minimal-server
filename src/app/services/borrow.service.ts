import { IBorrow } from '../interfaces/borrow.interface';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';

// Borrow a book
const borrowBook = async (borrowData: IBorrow) => {
  // Start a session for transaction
  const session = await Borrow.startSession();
  
  try {
    session.startTransaction();
    
    // Check if book has enough copies
    const book = await Book.findById(borrowData.book);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (book.copies < borrowData.quantity) {
      throw new Error('Not enough copies available');
    }
    
    // Update book copies
    book.copies -= borrowData.quantity;
    await book.save({ session });
    
    // Update book availability if copies become 0
    if (book.copies === 0) {
      book.available = false;
      await book.save({ session });
    }
    
    // Create borrow record
    const result = await Borrow.create([borrowData], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get borrowed books summary using aggregation
const getBorrowedBooksSummary = async () => {
  const result = await Borrow.aggregate([
    {
      $group: {
        _id: '$book',
        totalQuantity: { $sum: '$quantity' },
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'bookDetails',
      },
    },
    {
      $unwind: '$bookDetails',
    },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        'bookDetails.title': 1,
        'bookDetails.isbn': 1,
      },
    },
  ]);
  
  return result;
};

export const BorrowService = {
  borrowBook,
  getBorrowedBooksSummary,
};