import { pool } from "../db.js";

export const getBooksBySearch = async (req, res) => {
  const searchTerm = `%${req.query.search}%`;
  const query = `
    SELECT * FROM books
    WHERE title LIKE ? OR authors LIKE ? OR categories LIKE ?
  `;
  const queryParams = [searchTerm, searchTerm, searchTerm];

  try {
    const [results] = await pool.execute(query, queryParams);
    if (results.length === 0) {
      res.status(404).json({
        message: "No books matching the search criteria were found.",
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in book query" });
  }
};

// obtiene los libros, con filtros incluidos
export const getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const queryFilters = [];
  const queryParams = [];

  // no está el filtro de país porque el json no tenia ese campo
  const filterAuthorsCategories = {
    authors: "LOWER(authors) LIKE LOWER(?)",
    categories: "LOWER(categories) LIKE LOWER(?)",
  };

  const filterConditions = {
    pageMin: "page_count >= ?",
    pageMax: "page_count <= ?",
    startDate: "published_date >= ?",
    endDate: "published_date <= ?",
  };

  // Comprobar si se proporciona 'title' como filtro
  if (req.query.title) {
    queryFilters.push("LOWER(title) LIKE LOWER(?)");
    queryParams.push(`%${req.query.title}%`);
  }

  for (const filterKey in filterAuthorsCategories) {
    if (req.query[filterKey]) {
      const filterValues = req.query[filterKey].split(","); // Separa los valores del filtro
      const filterConditionsArray = filterValues.map(
        (value) => filterAuthorsCategories[filterKey]
      );
      queryFilters.push(`(${filterConditionsArray.join(" OR ")})`);
      queryParams.push(...filterValues.map((value) => `%${value}%`));
    }
  }

  for (const filterKey in filterConditions) {
    if (req.query[filterKey]) {
      queryFilters.push(filterConditions[filterKey]);
      queryParams.push(req.query[filterKey]);
    }
  }

  let query = "SELECT * FROM books";

  // Si existen filtros de consulta, agregar una cláusula WHERE a la consulta
  if (queryFilters.length > 0) {
    query += " WHERE " + queryFilters.join(" AND ");
  }

  // Ordenar los resultados según 'sortBy' y 'order'
  if (req.query.sortBy) {
    let sortOrder = req.query.order === "desc" ? "DESC" : "ASC";
    if (req.query.sortBy === "authors" || req.query.sortBy === "categories") {
      // Si se selecciona 'authors' o 'categories', ordenar alfabéticamente por el primer valor
      query += ` ORDER BY ${req.query.sortBy}->>'$[0]' ${sortOrder}`;
    } else {
      // En otros casos, ordenar por el campo especificado
      query += ` ORDER BY ${req.query.sortBy} ${sortOrder}`;
    }
  }

  // Aplicar paginación a la consulta
  const offset = (page - 1) * perPage;
  query += ` LIMIT ${offset}, ${perPage}`;

  try {
    const [results] = await pool.execute(query, queryParams);
    if (results.length === 0) {
      res.status(404).json({
        message: "No books matching the search criteria were found.",
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in book query" });
  }
};

export const getBook = async (req, res) => {
  const { name } = req.query;

  try {
    const [results] = await pool.query("SELECT * FROM books WHERE title = ?", [
      name,
    ]);
    if (results.length === 0) {
      res.status(404).json({
        message: "No books matching the search criteria were found.",
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in book query" });
  }
};

// crea una lista de libros *funcionalidad extra*
export const createBookList = async (req, res) => {
  const { nameList, userId } = req.body;
  try {
    const [results] = await pool.query(
      "INSERT INTO book_list (name_list, user_id) VALUES (?,?)",
      [nameList, userId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// obtiene las listas por usuario
export const getBookList = async (req, res) => {
  const userId = req.query.userId;
  try {
    const [results] = await pool.query(
      "SELECT * FROM book_list WHERE user_id = ?",
      [userId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const insertBook = async (req, res) => {
  const { bookId, bookListId } = req.body;
  try {
    const [results] = await pool.query(
      "INSERT INTO book_list_relationship (book_list_id, book_id) VALUES (?,?)",
      [bookListId, bookId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const voteBook = async (req, res) => {
  const { bookId, rate } = req.body;

  try {
    // Insertar el voto en la tabla "book_votes"
    pool.query(
      "INSERT INTO book_votes (book_id, rate) VALUES (?, ?)",
      [bookId, rate],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error adding the vote" });
          return;
        }

        // Actualizar el campo "total_votes" en la tabla "books"
        pool.query(
          "UPDATE books SET total_votes = (SELECT COUNT(*) FROM book_votes WHERE book_id = ?) WHERE book_id = ?",
          [bookId, bookId],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: "Error updating total votes" });
              return;
            }

            // Calcular el promedio de votos y actualizar el campo "rating" en la tabla "books"
            pool.query(
              "UPDATE books SET rating = (SELECT AVG(rate) FROM book_votes WHERE book_id = ?) WHERE book_id = ?",
              [bookId, bookId],
              (err, result) => {
                if (err) {
                  console.error(err);
                  res
                    .status(500)
                    .json({ error: "Error calculating the average votes" });
                  return;
                }

                res.json({ message: "Vote added and average updated" });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error voting" });
  }
};

const query = `SELECT
book_list.name_list as name_list,
books.title as title_book,
users.name as name_user,
 users.user_id as id_user
FROM
book_list_relationship
INNER JOIN
book_list ON book_list_relationship.book_list_id = book_list.book_list_id
INNER JOIN
books ON book_list_relationship.book_id = books.book_id
INNER JOIN
users ON book_list.user_id = users.user_id
WHERE
users.user_id = 49
LIMIT 0, 1000;`;
