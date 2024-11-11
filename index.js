const express = require("express");
const connection = require("./db");
const path = require("path");

const app = express();

// Encargado de parsear a los json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Archivos html
app.use(express.static(path.join(__dirname, "templates")));

/*
// Ruta prueba 
app.get('/api/prueba', (req, res)=>{

    res.send('Api funcionando de manera correcta');

});
*/

app.get("/api/prueba1", (req, res) => {
  res.status(200).json({
    message: "LA API RESPONDE CORRECTAMENTE",
    port: PORT,
    status: "success",
  });
});

// Crear registro
app.post("/api/guardar", (req, res) => {
  const { cedula, nombre, edad, profesion } = req.body;

  const query =
    "INSERT INTO persona (cedula, nombre, edad, profesion) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [cedula, nombre, edad, profesion],
    (error, result) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res
          .status(201)
          .json({ cedula: result.insertId, cedula, nombre, edad, profesion });
      }
    }
  );
});

// Obtener registros de la base de datos
app.get("/api/obtener", (req, res) => {
  const query = "select * from persona";
  connection.query(query, (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error al recuperar los datos",
        details: error.message,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Datos de la tabla",
        data: result,
      });
    }
  });
});

// API para eliminar registro
app.delete("/api/eliminar/:cedula", (req, res) => {
  const { cedula } = req.params;
  const query = "DELETE FROM persona WHERE cedula = ?";
  connection.query(query, [cedula], (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error al Eliminar el registro",
        details: error.message,
      });
    } else if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: `No existe el registro ${cedula}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Dato eliminado de la tabla",
        data: result,
      });
    }
  });
});

app.put("/api/persona/:cedula", (req, res) => {
  const { cedula } = req.params;
  const { nombre, edad, profesion } = req.body;

  const query = `
      UPDATE persona 
      SET 
        nombre = COALESCE(?, nombre),
        edad = COALESCE(?, edad),
        profesion = COALESCE(?, profesion)
      WHERE cedula = ?
    `;

  connection.query(
    query,
    [nombre, edad, profesion, cedula],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json({
          message: "Persona actualizada",
          cedula,
          nombre,
          edad,
          profesion,
        });
      }
    }
  );
});

// API ACTUALIZAR
/*app.put("/api/actualizar/:cedula", (req, res) => {
  const { cedula } = req.params;

  const { nombre, edad, profesion } = req.body;

  const query = `
      UPDATE persona 
      SET 
        nombre = COALESCE(?, nombre),
        edad = COALESCE(?, edad),
        profesion = COALESCE(?, profesion)
      WHERE cedula = ?
    `;
    connection.query(query, [nombre, edad, profesion, cedula], (error, results) => {
        if (error) {
          res.status(500).json({ error });
        } else {
  res.json({ message: 'Persona actualizada', cedula, nombre, edad, profesion });
        }
      });
  });

  //const query = 'UPDATE persona SET nombre = ?, edad = ?, profesion = ? WHERE cedula = ?';

  connection.query(
    query,
    [nombre, edad, profesion, cedula],
    (error, result) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: "Error al actualizar",
          details: error.message,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Persona Actualizada",
        });
      }
    }
  );
});*/

// Puerto de Conexion del servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Servidor Corriendo");
});
