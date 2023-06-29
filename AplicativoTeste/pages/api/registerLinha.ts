import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeDaLinha, unidadeId, Maquinas } = req.body;

    const novaLinha = await prismadb.linha.create({
      data: {
        nome: nomeDaLinha,
        unidadeId: unidadeId,
        maquinas: Maquinas,
      },
    });

    return res.status(200).json({ statusSaida: 'Linha criada' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
