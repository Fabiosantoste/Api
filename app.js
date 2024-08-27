const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(bodyParser.json());


const readProdutos = () => {
  const data = fs.readFileSync('produtos.json');
  return JSON.parse(data);
};

const writeProdutos = (produtos) => {
  fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
};


app.get('/api/produto/:id', (req, res) => {
  const produtos = readProdutos();
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});


app.get('/api/produtos', (req, res) => {
  const produtos = readProdutos();
  res.json(produtos);
});


app.post('/api/produto/cadastrar', (req, res) => {
  const produtos = readProdutos();
  const novoProduto = {
    id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
    nome: req.body.nome,
    quantidade: req.body.quantidade
  };
  produtos.push(novoProduto);
  writeProdutos(produtos);
  res.status(201).json(novoProduto);
});


app.post('/api/produto/atualizar', (req, res) => {
  const produtos = readProdutos();
  const produto = produtos.find(p => p.id === req.body.id);
  if (produto) {
    produto.quantidade = req.body.quantidade;
    writeProdutos(produtos);
    res.json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});


app.post('/api/produto/excluir', (req, res) => {
  let produtos = readProdutos();
  const produtoIndex = produtos.findIndex(p => p.id === req.body.id);
  if (produtoIndex !== -1) {
    produtos.splice(produtoIndex, 1);
    writeProdutos(produtos);
    res.json({ message: 'Produto excluído com sucesso' });
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});


app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
