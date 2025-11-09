"use client";
import { Formik, Form, Field } from "formik";
import styles from "./page.module.css";
import * as Yup from "yup";
import { useId } from "react";
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface FormikValues {
  id: string;
}

export default function Update() {
  const fieldId = {
    id: useId(),
  };

  const bookSchema = Yup.object({
    id: Yup.string().min(1, "Title must be at least 1 character"),
  });

  const handleSubmit = async (values: FormikValues, { resetForm }: any) => {
    try {
      const id = values.id;
      console.log(values);
      const response = await axios.delete(`/api/books?id=${id}`);
      toast.success("Book deleted!");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };
  return (
    <main className={styles.main}>
      <Toaster />
      <h1 className={styles.h1}>Update</h1>
      <Link className={styles.button_nav} href="/">
        Back
      </Link>
      <Formik
        initialValues={{
          id: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={bookSchema}
      >
        <Form className={styles.form}>
          <label className={styles.label} htmlFor={fieldId.id}>
            <span className={styles.title}>Id</span>
            <Field
              className={styles.field}
              name="id"
              type="text"
              id={fieldId.id}
            />
          </label>

          <button className={styles.button} type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </main>
  );
}
