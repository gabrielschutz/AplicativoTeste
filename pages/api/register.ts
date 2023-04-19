import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    
    const {getUsuario, getSenha } = req.body;

    const user = await prismadb.user.create({
      data: {
        nome : '',
        usuarioid : getUsuario,
        senha : getSenha,
      }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}