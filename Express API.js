const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = 'banksecret';
let balance = 1000;

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'user' || password !== 'pass') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Auth middleware
function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });

  const [, token] = header.split(' ');
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Balance
app.get('/balance', auth, (req, res) => {
  res.json({ balance });
});

// Deposit
app.post('/deposit', auth, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  balance += amount;
  res.json({ balance });
});

// Withdraw
app.post('/withdraw', auth, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (amount > balance) return res.status(400).json({ error: 'Insufficient funds' });
  balance -= amount;
  res.json({ balance });
});

app.listen(3000, () => console.log('Server running'));
