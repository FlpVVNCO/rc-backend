import { pool } from "../db.js";

// inserta los datos del amazon.books.json a la base de datos
export const insertJson = async (books) => {
  try {
    for (const bookData of books) {
      const {
        _id,
        title,
        isbn,
        pageCount,
        publishedDate,
        thumbnailUrl,
        shortDescription,
        longDescription,
        status,
        authors,
        categories,
      } = bookData;

      const formattedDate =
        publishedDate && publishedDate.$date
          ? new Date(publishedDate.$date)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          : null;

      const values = [
        _id || null,
        title || null,
        isbn || null,
        pageCount || 0,
        formattedDate,
        thumbnailUrl || null,
        longDescription || null,
        status || null,
        JSON.stringify(authors), // Convierte el arreglo de autores a JSON
        JSON.stringify(categories), // Convierte el arreglo de categorías a JSON
        shortDescription || null,
      ];

      // console.log(bookData.isbn);

      const [rows] = await pool.execute(
        `
        INSERT INTO books
        (book_id, title, isbn, page_count, published_date, thumbnail_url, long_description, status, authors, categories, short_description)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `,
        values
      );
      console.log("Filas afectadas:", rows.affectedRows);
      if (rows.affectedRows !== 1) {
        console.error(`Error: No se pudo insertar el libro con ISBN: ${isbn}`);
      }
    }
    console.log("Inserción exitosa. Total de libros insertados:", books.length);
  } catch (error) {
    console.error(error);
  }
};
