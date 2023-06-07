import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeMaquina, iotUUID, linhaId } = req.body;

    const maquinaExistente = await prismadb.maquina.findFirst({
      where: {
        nome: nomeMaquina,
      },
    });

    if (maquinaExistente) {
      return res.status(200).json({ statusSaida: 'Máquina já existe' });
    }

    const novaMaquina = await prismadb.maquina.create({
      data: {
        nome: nomeMaquina,
        iotUUID: iotUUID,
        linhaId: linhaId,
      },
    });

    return res.status(200).json({ statusSaida: 'Máquina criada' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
