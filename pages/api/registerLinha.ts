import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeLinha, unidadeId } = req.body;

    const linhaExistente = await prismadb.unidade.findUnique({
      where: {
        nome: nomeLinha
      }
    });

    if (linhaExistente) {
      return res.status(200).json({ statusSaida: 'Linha já existe' });
    }

    const novaLinha = await prismadb.linha.create({
      data: {
        nome: nomeLinha,
        unidadeId: unidadeId,
      },
    });

    return res.status(200).json({ statusSaida: 'Linha criada' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
