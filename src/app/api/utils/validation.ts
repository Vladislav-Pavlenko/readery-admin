import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  pdfUrl: z.string().url("PDF URL must be valid"),
  imageUrl: z.string().url("Image URL must be valid"),
});
