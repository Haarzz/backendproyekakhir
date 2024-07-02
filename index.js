const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost", // Your database host
  user: "root", // Your database username
  password: "", // Your database password
  database: "dbdehidrasi", // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

function getRecordById(id, callback) {
  const sql = "SELECT * FROM datadehidrasi WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (results.length === 0) {
      callback(new Error(`Record with id ${id} not found.`), null);
      return;
    }
    callback(null, results[0]);
  });
}

// Example route to fetch all records
app.get("/datadehidrasi", (req, res) => {
  const sql = "SELECT * FROM datadehidrasi";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error Fetching Data");
      console.log(err);
      return;
    }
    res.json(results);
  });
});

// Route to fetch a record by id
app.get("/datadehidrasi/:id", (req, res) => {
  const { id } = req.params;
  getRecordById(id, (err, record) => {
    if (err) {
      console.error("Error fetching record:", err);
      res.status(500).json({ error: "Error fetching record" });
      return;
    }
    res.json(record);
  });
});

// Route to update a record by id
app.put("/datadehidrasi/:id", (req, res) => {
  const { id } = req.params;
  const { nama_pasien, ttl_pasien } = req.body;

  const sql =
    "UPDATE datadehidrasi SET nama_pasien = ?, ttl_pasien = ? WHERE id = ?";
  db.query(sql, [nama_pasien, ttl_pasien, id], (err, results) => {
    if (err) {
      console.error("Error updating record:", err);
      res.status(500).json({ error: "Error updating record" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: `Record with id ${id} not found.` });
      return;
    }
    res.json({ message: "Record updated successfully." });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
