import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { username, nome, senha, unidadeId, usuario, role } = req.body;

    const usuarioExistente = await prismadb.usuario.findFirst({
      where: {
        username: username,
      },
    });

    if (usuarioExistente) {
      return res.status(200).json({ statusSaida: 'Usuário já existe' });
    }

    const novoUsuario = await prismadb.usuario.create({
      data: {
        username: username,
        nome: nome,
        role: role, // Defina o role do usuário de acordo com a sua lógica
        senha: senha,
        unidadeId: unidadeId,
      },
    });

    return res.status(200).json({ statusSaida: 'Usuário criado' });
  } catch (error) {
    return res.status(400).json({ error: `Ocorreu um erro: ${error}` });
  }
}
