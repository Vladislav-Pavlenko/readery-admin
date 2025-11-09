"use client";
import { Formik, Form, Field } from "formik";
import styles from "./page.module.css";
import * as Yup from "yup";
import { useId } from "react";
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface FormikValues {
  title: string;
  description: string;
  genre: string;
  author: string;
  image: File | null;
  pdf: File | null;
}

export default function Update() {
  const fieldId = {
    title: useId(),
    description: useId(),
    genre: useId(),
    author: useId(),
    image: useId(),
    pdf: useId(),
  };

  const bookSchema = Yup.object({
    title: Yup.string()
      .min(2, "Title must be at least 2 character")
      .max(150, "Title must be at most 150 character")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 character")
      .max(1000, "Description must be at most 1000 character")
      .required("Description is required"),
    genre: Yup.string()
      .min(2, "Genre must be at least 2 character")
      .max(100, "Genre must be at most 100 character")
      .required("Genre is required"),
    author: Yup.string()
      .min(2, "Author must be at least 2 character")
      .max(100, "Author must be at most 100 character")
      .required("Author is required"),
  });

  const handleSubmit = async (values: FormikValues, { resetForm }: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("genre", values.genre);
    formData.append("author", values.author);
    if (values.image) formData.append("image", values.image);
    if (values.pdf) formData.append("pdf", values.pdf);

    try {
      const response = await axios.post("/api/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Book created!");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };
  return (
    <main className={styles.main}>
      <Toaster />
      <Link className={styles.button_nav} href="/">
        Back
      </Link>
      <h1 className={styles.h1}>Create</h1>
      <Formik
        initialValues={{
          id: "",
          title: "",
          description: "",
          genre: "",
          author: "",
          image: null,
          pdf: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={bookSchema}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form}>
            <label className={styles.label} htmlFor={fieldId.title}>
              <span className={styles.title}>Title</span>
              <Field
                className={styles.field}
                name="title"
                type="text"
                id={fieldId.title}
              />
            </label>

            <label className={styles.label} htmlFor={fieldId.description}>
              <span className={styles.title}>Description</span>
              <Field
                className={styles.field}
                name="description"
                type="text"
                id={fieldId.description}
              />
            </label>

            <label className={styles.label} htmlFor={fieldId.genre}>
              <span className={styles.title}>Genre</span>
              <Field
                className={styles.field}
                name="genre"
                type="text"
                id={fieldId.genre}
              />
            </label>

            <label className={styles.label} htmlFor={fieldId.author}>
              <span className={styles.title}>Author</span>
              <Field
                className={styles.field}
                name="author"
                type="text"
                id={fieldId.author}
              />
            </label>

            <label className={styles.label} htmlFor={fieldId.image}>
              <span className={styles.title}>Image</span>
              <input
                className={styles.field}
                name="image"
                type="file"
                accept="image/*"
                id={fieldId.image}
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files?.[0]);
                }}
              />
            </label>

            <label className={styles.label} htmlFor={fieldId.pdf}>
              <span className={styles.title}>PDF</span>
              <input
                className={styles.field}
                name="pdf"
                type="file"
                accept="application/pdf"
                id={fieldId.pdf}
                onChange={(event) => {
                  setFieldValue("pdf", event.currentTarget.files?.[0]);
                }}
              />
            </label>

            <button className={styles.button} type="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
