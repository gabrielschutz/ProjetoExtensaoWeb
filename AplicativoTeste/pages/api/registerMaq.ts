import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeMaq, uuidIOT } = req.body;

    const novaMaq = await prismadb.maquina.create({
      data: {
        nome: nomeMaq,
        iotUUID: uuidIOT,
      },
    });

    return res.status(200).json({ statusSaida: 'Maq criada' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
