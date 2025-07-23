import { Request, Response, NextFunction } from 'express';
import { BorrowService } from '../services/borrow.service';

// Borrow a book
const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BorrowService.borrowBook(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get borrowed books summary
const getBorrowedBooksSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BorrowService.getBorrowedBooksSummary();
    
    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BorrowController = {
  borrowBook,
  getBorrowedBooksSummary,
};