// API Endpoints - Asistente Vial México
const express = require('express');
const app = express();

// Mock database (replace with real database)
let users = [
  { id: 1, email: 'admin@asistentevial.mx', name: 'Admin', user_type: 'admin' },
  { id: 2, email: 'user@demo.com', name: 'Usuario Demo', user_type: 'user' }
];

let partners = [
  { id: 1, name: 'Taller El Güero', business_type: 'taller', phone: '5551111111', active: true },
  { id: 2, name: 'Grúas Rápidas 24/7', business_type: 'grua', phone: '5552222222', active: true }
];

let services = [];
let emergencies = [];

app.use(express.json());

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    res.json({ user, token: `token-${user.id}` });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, phone, user_type } = req.body;
  const newUser = {
    id: users.length + 1,
    email,
    name,
    phone,
    user_type: user_type || 'user'
  };
  users.push(newUser);
  res.json({ user: newUser, token: `token-${newUser.id}` });
});

// User endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.json(user || { error: 'User not found' });
});

// Partners endpoints
app.get('/api/partners', (req, res) => {
  res.json(partners);
});

app.post('/api/partners', (req, res) => {
  const newPartner = {
    id: partners.length + 1,
    ...req.body,
    active: true
  };
  partners.push(newPartner);
  res.json(newPartner);
});

app.put('/api/partners/:id', (req, res) => {
  const index = partners.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    partners[index] = { ...partners[index], ...req.body };
    res.json(partners[index]);
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

app.delete('/api/partners/:id', (req, res) => {
  const index = partners.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    partners.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

// Services endpoints
app.get('/api/services', (req, res) => {
  res.json(services);
});

app.post('/api/services', (req, res) => {
  const newService = {
    id: services.length + 1,
    ...req.body,
    status: 'pending',
    created_at: new Date()
  };
  services.push(newService);
  res.json(newService);
});

// Emergency endpoints
app.get('/api/emergencies', (req, res) => {
  res.json(emergencies);
});

app.post('/api/emergencies', (req, res) => {
  const newEmergency = {
    id: emergencies.length + 1,
    ...req.body,
    status: 'active',
    created_at: new Date()
  };
  emergencies.push(newEmergency);
  res.json(newEmergency);
});

// Analytics endpoints
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    users_count: users.length,
    partners_count: partners.length,
    services_count: services.length,
    emergencies_count: emergencies.length,
    uptime: 98.7,
    active_users: 2847
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

module.exports = app;