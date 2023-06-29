import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeUnidade, endereco } = req.body;

    const existingUnidade = await prismadb.unidade.findUnique({
      where: {
        nome: nomeUnidade
      }
    });

    if (existingUnidade) {
      return res.status(200).json({ statusSaida: 'EXISTE' });
    }

    const novaUnidade = await prismadb.unidade.create({
      data: {
        nome: nomeUnidade,
        endereco: endereco,
      }
    });

    return res.status(200).json({ statusSaida: 'CRIADA' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
