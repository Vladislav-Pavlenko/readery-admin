import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
    select: { image: true, title: true },
  });

  if (!book || !book.image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return new Response(book.image, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${book.title}.png"`,
    },
  });
}
