const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const sportRoutes = require('./routes/sportRoutes');
const planRoutes = require('./routes/planRoutes');
const memberRoutes = require('./routes/memberRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle specific admin routes
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'dashboard.html'));
});

app.get('/admin/sports', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'sports.html'));
});

app.get('/admin/plans', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'plans.html'));
});

app.get('/admin/members', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'members.html'));
});

app.get('/admin/payments', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'payments.html'));
});

app.get('/admin/member-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'member-profile.html'));
});

// Handle admin root route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'dashboard.html'));
});

app.use('/auth', authRoutes);
app.use('/sports', sportRoutes);
app.use('/plans', planRoutes);
app.use('/members', memberRoutes);
app.use('/payments', paymentRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

module.exports = app;
