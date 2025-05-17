const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = './products.json';

function readProducts() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

app.post('/products', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product topilmadi' });
  }
});

app.put('/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id == req.params.id);
  if (index !== -1) {
    products[index].name = req.body.name;
    writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product topilmadi' });
  }
});

app.delete('/products/:id', (req, res) => {
  let products = readProducts();
  const filtered = products.filter((p) => p.id != req.params.id);
  if (filtered.length === products.length) {
    return res.status(404).json({ message: 'Product topilmadi' });
  }
  writeProducts(filtered);
  res.json({ message: 'Product ochirildi' });
});

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT} `);
});
