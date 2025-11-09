"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  description: string;
  genre: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const handler = async () => {
      try {
        const response = await axios.get("/api/books");
        setBooks(response.data.data);
        console.log("✅ Success:", response.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error(errorMessage);
      }
    };
    handler();
  }, []);

  return (
    <main className={styles.main}>
      <table className={styles.table}>
        <caption className={styles.caption}>Books</caption>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th} scope="col">
              Id
            </th>
            <th className={styles.th} scope="col">
              Title
            </th>
            <th className={styles.th} scope="col">
              Description
            </th>
            <th className={styles.th} scope="col">
              Genre
            </th>
            <th className={styles.th} scope="col">
              Author
            </th>
            <th className={styles.th} scope="col">
              Created At
            </th>
            <th className={styles.th} scope="col">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {books.map((book) => {
            return (
              <tr className={styles.tr} key={book.id}>
                <th className={styles.th} scope="row">
                  {book.id}
                </th>
                <td className={styles.th}>{book.title}</td>
                <td className={styles.th}>{book.description}</td>
                <td className={styles.th}>{book.genre}</td>
                <td className={styles.th}>{book.author}</td>
                <td className={styles.th}>{book.createdAt}</td>
                <td className={styles.th}>{book.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav className={styles.nav}>
        <Link className={styles.button} href="/create">
          Create
        </Link>
        <Link className={styles.button} href="/update">
          Update
        </Link>
        <Link className={styles.button} href="/delete">
          Delete
        </Link>
      </nav>
    </main>
  );
}
