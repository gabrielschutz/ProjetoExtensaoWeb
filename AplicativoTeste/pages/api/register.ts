import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeUsuario, senhaUsuario, usernameUsuario, roleUsuario, unidadeUsuario } = req.body;

    console.log(req.body)

    const usuarioExistente = await prismadb.usuario.findFirst({
      where: {
        username: usernameUsuario,
      },
    });

    if (usuarioExistente) {
      return res.status(200).json({ statusSaida: 'Usuário já existe' });
    }

    const novoUsuario = await prismadb.usuario.create({
      data: {
        username: usernameUsuario,
        nome: nomeUsuario,
        role: roleUsuario, 
        senha: senhaUsuario,
        unidadeId: unidadeUsuario,
      },
    });

    return res.status(200).json({ statusSaida: 'Usuário criado' });
    
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
