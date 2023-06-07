import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { username, nome, senha, unidadeId, role } = req.body;

    console.log(username, nome, senha, unidadeId, role)

    const usuarioCriado = await prismadb.usuario.create({
      data: {
        username,
        nome,
        senha,
        unidadeId,
        role,
      },
    });

    console.log("Criei essa merda")

    return res.status(200).json({ status: 'Usuário criado'});
  } catch (error) {
    console.log("Deu erro essa merda")
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
