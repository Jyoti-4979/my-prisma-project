const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// ------------------ USERS ------------------

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { analyses: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user
app.post('/users', async (req, res) => {
  try {
    const { email, name, provider } = req.body;
    const user = await prisma.user.create({
      data: { email, name, provider }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ ANALYSES ------------------

// Get all analyses
app.get('/analyses', async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: { user: true, files: true, findings: true }
    });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new analysis
app.post('/analyses', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const analysis = await prisma.analysis.create({
      data: { name, userId }
    });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ FILES ------------------

app.post('/files', async (req, res) => {
  try {
    const { filename, filetype, storagePath, analysisId } = req.body;
    const file = await prisma.file.create({
      data: { filename, filetype, storagePath, analysisId }
    });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ FINDINGS ------------------

app.post('/findings', async (req, res) => {
  try {
    const { content, maskedFile, analysisId } = req.body;
    const finding = await prisma.finding.create({
      data: { content, maskedFile, analysisId }
    });
    res.json(finding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ START SERVER ------------------

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
