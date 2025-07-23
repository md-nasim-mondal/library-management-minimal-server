import { IBook } from '../interfaces/book.interface';
import { Book } from '../models/book.model';

// Create a new book
const createBook = async (bookData: IBook) => {
  const result = await Book.create(bookData);
  return result;
};

// Get all books with filtering and sorting
const getAllBooks = async (filter: string, sortBy: string, sort: string, limit: number) => {
  const query: any = {};
  
  // Apply genre filter if provided
  if (filter) {
    query.genre = filter;
  }
  
  // Set default sort options
  const sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sort === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default sort by createdAt desc
  }
  
  // Set default limit
  const limitValue = limit || 10;
  
  const result = await Book.find(query)
    .sort(sortOptions)
    .limit(limitValue);
    
  return result;
};

// Get a book by ID
const getBookById = async (id: string) => {
  const result = await Book.findById(id);
  return result;
};

// Update a book
const updateBook = async (id: string, payload: Partial<IBook>) => {
  const result = await Book.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete a book
const deleteBook = async (id: string) => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};

export const BookService = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};