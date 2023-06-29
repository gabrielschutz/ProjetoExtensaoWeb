import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeIOT, uuidIOT } = req.body;

    console.log(nomeIOT)
    console.log(uuidIOT)

    const novaIOT = await prismadb.iOT.create({
      data: {
        nome: nomeIOT,
        uuid: uuidIOT,
        ip: '',
      },
    });

    return res.status(200).json({ statusSaida: 'IOT criada' });
    
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
