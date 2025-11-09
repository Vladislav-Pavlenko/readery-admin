import { BookFilters } from "../types/book";

export function buildBookFilters(filters: BookFilters) {
  const where: any = {};

  if (filters.id) where.id = filters.id;
  if (filters.title)
    where.title = { contains: filters.title, mode: "insensitive" };
  if (filters.author)
    where.author = { contains: filters.author, mode: "insensitive" };
  if (filters.genre)
    where.genre = { contains: filters.genre, mode: "insensitive" };

  return where;
}
