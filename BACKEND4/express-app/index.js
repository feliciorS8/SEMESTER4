import express from "express";

const app = express();

app.use(express.json());

// contoh API
app.get("/api/rumahsakit", (req, res) => {
  res.json({
    nama: "HAECHAN",
    nim: "1122334455",
    jurusan: "Informatika",
  });
});

app.listen(3000, () => {
  console.log("Server Running at http://localhost:3000");
});
