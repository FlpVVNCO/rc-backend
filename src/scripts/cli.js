import { insertJson } from "./insertJson.js";
import fs from "fs-extra";
import yargs from "yargs";

// script para iniciar
// node src/scripts/cli.js -f src/json/amazon.books.json
const argv = yargs(process.argv.slice(2)).options({
  file: {
    alias: "f",
    description: "Ruta al archivo JSON de entrada",
    type: "string",
    demandOption: true, // Requerir la opción
  },
}).argv;

try {
  const filePath = argv.file;

  const rawData = fs.readFileSync(filePath);
  const books = JSON.parse(rawData);

  if (!Array.isArray(books)) {
    console.error("Los datos JSON no son un array válido.");
    process.exit(1);
  }

  insertJson(books)
    .then((result) => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error al insertar datos:", error);
      process.exit(1);
    });
} catch (error) {
  console.error(`Error al analizar el archivo JSON: ${error.message}`);
  process.exit(1);
}
