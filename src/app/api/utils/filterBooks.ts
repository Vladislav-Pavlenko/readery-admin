interface BookQuery {
  title?: string | null;
  author?: string | null;
  genre?: string | null;
}

export const buildBookFilters = (query: BookQuery) => {
  const filters: any = {};

  if (query.title) {
    filters.title = {
      contains: query.title,
      mode: "insensitive",
    };
  }

  if (query.author) {
    filters.author = {
      contains: query.author,
      mode: "insensitive",
    };
  }

  if (query.genre) {
    filters.genre = {
      contains: query.genre,
      mode: "insensitive",
    };
  }

  return filters;
};
