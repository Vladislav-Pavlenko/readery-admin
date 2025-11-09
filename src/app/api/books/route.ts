import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/prisma";
import { buildBookFilters } from "../utils/filterBooks";
import { BookFilters } from "../types/book";

export const config = {
  api: { bodyParser: false },
};

// GET /api/books?title=&author=&genre=&id=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: BookFilters = {
      id: searchParams.get("id") ? Number(searchParams.get("id")) : undefined,
      title: searchParams.get("title") || undefined,
      author: searchParams.get("author") || undefined,
      genre: searchParams.get("genre") || undefined,
    };

    const books = await prisma.book.findMany({
      where: buildBookFilters(filters),
      select: {
        id: true,
        title: true,
        description: true,
        genre: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: 200,
      message: books.length === 0 ? "No books found" : "Books found",
      data: books,
      count: books.length,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/books
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const genre = formData.get("genre") as string;

    const pdfFile = formData.get("pdf") as File | null;
    const imageFile = formData.get("image") as File | null;

    const pdfBuffer = pdfFile ? Buffer.from(await pdfFile.arrayBuffer()) : null;
    const imageBuffer = imageFile
      ? Buffer.from(await imageFile.arrayBuffer())
      : null;

    const newBook = await prisma.book.create({
      data: {
        title,
        description,
        author,
        genre,
        pdf: pdfBuffer,
        image: imageBuffer,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH /api/books
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const author = formData.get("author") as string | null;
    const genre = formData.get("genre") as string | null;
    const pdfFile = formData.get("pdf") as File | null;
    const imageFile = formData.get("image") as File | null;

    const updateData: {
      title?: string;
      description?: string;
      author?: string;
      genre?: string;
      pdf?: Buffer | null;
      image?: Buffer | null;
    } = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (author) updateData.author = author;
    if (genre) updateData.genre = genre;
    if (pdfFile) updateData.pdf = Buffer.from(await pdfFile.arrayBuffer());
    if (imageFile)
      updateData.image = Buffer.from(await imageFile.arrayBuffer());

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({
      status: 200,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/books?id=<id>
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const id = Number(idParam);
    await prisma.book.delete({ where: { id } });

    return NextResponse.json({
      status: 200,
      message: "Book deleted successfully",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
