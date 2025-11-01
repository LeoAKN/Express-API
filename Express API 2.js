const express = require("express");
const app = express();

const products = [
  { name: "Laptop", price: 50000 },
  { name: "Phone", price: 20000 }
];

app.get("/", (req, res) => {
  let html = `<h1>Products</h1><ul>`;
  products.forEach(p => {
    html += `<li>${p.name}: ₹${p.price}</li>`;
  });
  html += `</ul>`;
  res.send(html);
});

app.listen(5000);
