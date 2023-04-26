import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    
    const {nomeUsuario, senhaUsuario, usernameUsuario, roleUsuario } = req.body;

    const user = await prismadb.user.create({
      data: {
        usuarioid : usernameUsuario,
        senha : senhaUsuario,
        nome : nomeUsuario,
        role : roleUsuario,
      }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}