import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";
import { buildBookFilters } from "../utils/filterBooks";
import { bookSchema } from "../utils/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title");
    const author = searchParams.get("author");
    const genre = searchParams.get("genre");

    const filters = buildBookFilters({ title, author, genre });

    const books = await prisma.book.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: 200,
      message: books.length === 0 ? "No books found" : "Books found",
      data: books,
      count: books.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch books: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookSchema.safeParse(body);

    // console.log(parsed);
    // if (!parsed.success) {
    //   return NextResponse.json(
    //     { error: "Invalid input", issues: parsed.error.format() },
    //     { status: 400 },
    //   );
    // }
    //
    // const data = parsed.data;
    //
    // const newBook = await prisma.book.create({
    //   data: {
    //     title: data.title,
    //     description: data.description,
    //     author: data.author,
    //     genre: data.genre,
    //     pdfUrl: data.pdfUrl,
    //     imageUrl: data.imageUrl,
    //   },
    // });
    //
    // return NextResponse.json({
    //   status: 201,
    //   message: "Book created successfully",
    //   data: newBook,
    // });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create book: ${error}` },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const bookUpdateSchema = bookSchema.partial();
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 },
      );
    }

    const parsed = bookUpdateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.format() },
        { status: 400 },
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      status: 200,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update book: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 },
      );
    }
    const id = parseInt(idParam, 10);
    await prisma.book.delete({ where: { id } });

    return NextResponse.json({
      status: 200,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete book: ${error}` },
      { status: 500 },
    );
  }
}
