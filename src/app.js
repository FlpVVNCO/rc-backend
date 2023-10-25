import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import booksRoutes from "./routes/books.routes.js";

const app = express();

// para ver todas las solicitudes que se hacen al backend
app.use(morgan("dev"));

// para convertir los datos en json
app.use(express.json());
//para
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// usando las rutas creadas
app.use("/api", indexRoutes);
app.use("/api", usersRoutes);
app.use("/api", authRoutes);
app.use("/api", booksRoutes);

// not found
app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res
    .status(404)
    .json({ error: "Resource not found", requestedResource: req.originalUrl });
});

export default app;
