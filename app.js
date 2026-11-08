const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const publicDir = __dirname;

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.static(publicDir));

app.get('/', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.post('/api/send-email', async (req, res) => {
  const { name = '', email = '', message = '' } = req.body || {};
  if (!String(name).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()) || !String(message).trim()) {
    return res.status(400).json({ error: 'Nama, email valid, dan pesan wajib diisi.' });
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.INQUIRY_TO) {
    return res.status(503).json({ error: 'Layanan email belum dikonfigurasi.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: `King Safety Website <${process.env.SMTP_USER}>`,
      to: process.env.INQUIRY_TO,
      replyTo: String(email).trim(),
      subject: `Inquiry King Safety — ${String(name).trim()}`,
      text: `Nama: ${String(name).trim()}\nEmail: ${String(email).trim()}\n\nPesan:\n${String(message).trim()}`
    });
    return res.json({ message: 'Pesan berhasil dikirim.' });
  } catch (error) {
    console.error('SMTP send failed:', error.message);
    return res.status(502).json({ error: 'Pesan gagal dikirim.' });
  }
});

module.exports = app;