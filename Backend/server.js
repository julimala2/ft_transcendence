const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Data du mensonge
const fakeUsers = [
  { id: 1, nom: 'Pepito', age: 28 },
  { id: 2, nom: 'Pascal', age: 34 },
  { id: 3, nom: 'Prout', age: 22 },
];

app.get('/', (req, res) => {
  res.send('Hello du backend!');
});

app.get('/api/getrequest',async (req,res) => {
  // const result = await pool.query('SELECT * FROM TEST');
  console.log('Api Get request');
  await new Promise(resolve => setTimeout(resolve, 1000)); //Timer pour simuler latence serveur
  res.json(fakeUsers);
});

app.post('/api/postrequest', async (req,res) => {
  console.log('API Post request :',req.body);
  const fakeMsg = [
    {id : 1, message: "Get request recue", test: "test"}
  ]
  await new Promise(resolve => setTimeout(resolve, 2000)); //Timer pour simuler latence serveur
  res.json(fakeMsg);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});