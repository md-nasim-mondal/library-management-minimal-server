import express from 'express';
import { BorrowController } from '../controllers/borrow.controller';

const router = express.Router();

// Borrow routes
router.post('/', BorrowController.borrowBook);
router.get('/', BorrowController.getBorrowedBooksSummary);

export const borrowRoutes = router;