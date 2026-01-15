import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = Number(process.env.PORT) || 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});