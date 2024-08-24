// Modulos externos
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

// Configuracion del servidor en express
app.listen(3000, () => {
  console.log("Server running")
});

//Middlewares.
app.use(bodyParser.urlencoded({ extended: true })); // Para analizar peticiones URL
app.use(bodyParser.json()); // Para analizar peticiones JSON
app.use(express.static('view')); // Para usar archivos estaticos de la carpeta vista