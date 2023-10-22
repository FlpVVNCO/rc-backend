import { pool } from "../db.js";

export const getBooks = async (req, res) => {
  // valores por defecto de la páginación
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const queryFilters = [];
  const queryParams = [];

  // no está el filtro de país porque el json no tenia ese campo
  const filterAuthorsCategories = {
    authors: "authors LIKE ?",
    categories: "categories LIKE ?",
  };

  const filterConditions = {
    pageMin: "page_count >= ?",
    pageMax: "page_count <= ?",
    startDate: "published_date >= ?",
    endDate: "published_date <= ?",
  };

  // Comprobar si se proporciona 'title' como filtro
  if (req.query.title) {
    queryFilters.push("title LIKE ?");
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
      res.json({
        message: "No books matching the search criteria were found.",
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in book query" });
  }
};
