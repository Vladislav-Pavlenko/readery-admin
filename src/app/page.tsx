import { Formik, Form, Field } from "formik";

export default function Home() {
  const aap =
  return (
    <main>
      <Formik
        initialValues={{
          title: "",
          description: "",
          genre: "",
          author: "",
          image: null,
          pdf: null,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            <label>
              <span>Title</span>
              <Field name="title" type="text" />
            </label>

            <label>
              <span>Description</span>
              <Field name="description" type="text" />
            </label>

            <label>
              <span>Genre</span>
              <Field name="genre" type="text" />
            </label>

            <label>
              <span>Author</span>
              <Field name="author" type="text" />
            </label>

            <label>
              <span>Image</span>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files?.[0]);
                }}
              />
            </label>

            <label>
              <span>PDF</span>
              <input
                name="pdf"
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  setFieldValue("pdf", event.currentTarget.files?.[0]);
                }}
              />
            </label>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
