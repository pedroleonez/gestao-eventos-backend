import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rota protegida (Só acessa quem enviar o Token)
app.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId }
  });

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const { password: _, ...userWithoutPassword } = user;
  return res.json(userWithoutPassword);
});

// Rota de Cadastro
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

// Rota de Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // 2. Verifica a senha (compara o texto puro com o hash do banco)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // 3. Gera o Token (vale por 1 dia)
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, token });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para criar um evento (protegida)
app.post('/events', authMiddleware, async (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: Number(capacity),
        organizerId: req.userId,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar evento.' });
  }
});

const PORT = Number(process.env.PORT) || 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});