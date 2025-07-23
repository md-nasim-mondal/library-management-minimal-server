import express, { Application, Request, Response } from "express";
import cors from "cors";
// import { bookRoutes } from './app/routes/book.routes';
// import { borrowRoutes } from './app/routes/borrow.routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
// app.use('/api/books', bookRoutes);
// app.use('/api/borrow', borrowRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Library Management API",
  });
});

// Not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found!',
  });
});

// Error handling route
app.use((req: Request, res: Response) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error!',
  });
});

export default app;
