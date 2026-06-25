const express = require("express");
const app = express();
const port = 3000;

// Halaman utama
app.get("/", (req, res) => {
    res.send("Selamat Datang...");
});

// Halaman home
app.get("/home", (req, res) => {
    res.send("Halaman Berada (Home)..");
});

// Halaman profil
app.get("/profil", (req, res) => {
    res.send("Halaman Profil ..");
});

// Halaman produk snack
app.get("/user/snack", (req, res) => {
    res.send("Halaman Produk Snack..");
});

// Halaman produk soft drink
app.get("/user/drink", (req, res) => {
    res.send("Halaman Produk Soft Drink..");
});

// Detail produk snack berdasarkan ID
app.get("/user/snack/:id", (req, res) => {
    res.send(`Halaman Produk Snack.. (id = ${req.params.id})`);
});

// Detail produk soft drink berdasarkan ID
app.get("/user/drink/:id", (req, res) => {
    res.send(`Halaman Produk Soft Drink.. (id = ${req.params.id})`);
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});