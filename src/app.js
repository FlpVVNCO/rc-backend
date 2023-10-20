import express from "express";
import usersRoutes from "./routes/users.routes.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// para convertir los datos en json
app.use(express.json());

// usando las rutas creadas
app.use("/api", indexRoutes);
app.use("/api", usersRoutes);

// not found
app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res
    .status(404)
    .json({ error: "Resource not found", requestedResource: req.originalUrl });
});

export default app;
