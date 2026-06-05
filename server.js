
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE models (id INTEGER PRIMARY KEY, name TEXT, baseCost REAL, timeCost REAL, options TEXT)");
  db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY, modelId INTEGER, quantity INTEGER, customOptions TEXT, status TEXT, totalPrice REAL)");
});

app.get('/api/models', (req,res)=>{
  db.all("SELECT * FROM models", (err,rows)=>res.json(rows));
});

app.post('/api/models', (req,res)=>{
  const {name, baseCost, timeCost, options} = req.body;
  db.run("INSERT INTO models (name, baseCost, timeCost, options) VALUES (?,?,?,?)",[name,baseCost,timeCost,options], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({id:this.lastID});
  });
});

app.get('/api/orders', (req,res)=>{
  db.all("SELECT * FROM orders", (err,rows)=>res.json(rows));
});

app.post('/api/orders', (req,res)=>{
  const {modelId, quantity, customOptions, totalPrice} = req.body;
  db.run("INSERT INTO orders (modelId, quantity, customOptions, status, totalPrice) VALUES (?,?,?,?,?)",[modelId,quantity,customOptions,'créée',totalPrice], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({id:this.lastID});
  });
});

app.listen(port, ()=>console.log(`Server running on http://localhost:${port}`));
