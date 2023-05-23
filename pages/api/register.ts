import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    
    const { nomeUsuario, senhaUsuario, usernameUsuario, roleUsuario, unidadeUsuario } = req.body;

    const existingUser = await prismadb.user.findUnique({
      where: {
        usuarioid: usernameUsuario
      }
    })

    if(existingUser){
      return res.status(200).json({statusSaida : "UsuarioExistente"});
    }

    const user = await prismadb.user.create({
      data: {
        usuarioid: usernameUsuario,
        unidade: unidadeUsuario,
        senha: senhaUsuario,
        nome: nomeUsuario,
        role: roleUsuario,
      }
    });

    return res.status(200).json({statusSaida : "UsuarioCriado"});
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
