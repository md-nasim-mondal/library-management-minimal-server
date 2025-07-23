import { Request, Response } from 'express';
import { BorrowService } from '../services/borrow.service';

// Borrow a book
const borrowBook = async (req: Request, res: Response) => {
  try {
    const result = await BorrowService.borrowBook(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to borrow book',
      success: false,
      error: error.message || error,
    });
  }
};

// Get borrowed books summary
const getBorrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const result = await BorrowService.getBorrowedBooksSummary();
    
    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to retrieve borrowed books summary',
      success: false,
      error: error.message || error,
    });
  }
};

export const BorrowController = {
  borrowBook,
  getBorrowedBooksSummary,
};