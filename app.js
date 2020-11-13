const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.BACKEND || process.env.BASEURL,
    changeOrigin: true,
  }),
);

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`klever-web running at port ${port}`);
});
