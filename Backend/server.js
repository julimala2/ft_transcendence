require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./src/routes/auth.routes');
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

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

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`Server running on https://localhost:${process.env.PORT}`);
});
