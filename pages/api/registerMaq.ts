import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeMaquina, uuidMaquina, operadorMaquina, idMaquina, gerenteMaquina} = req.body;

    const existingMaquina = await prismadb.dashMaquinas.findUnique({
      where: {
        idMaq: idMaquina
      }
    })

    if (existingMaquina){

      if (existingMaquina.gerentes.includes(gerenteMaquina)) {
        return res.status(200).json({ statusSaida: 'Includes' });
      }

      const maqUpdate = await prismadb.dashMaquinas.update({
        where: {
          idMaq: idMaquina,
        },
        data: {
          gerentes: {
            push: gerenteMaquina,
          },
        },
      });

      return res.status(200).json({ statusSaida: 'Updated' });

    }

    const dashMaquinas = await prismadb.dashMaquinas.create({
      data: {
        idMaq: idMaquina,
        nomeMaq: nomeMaquina,
        uuid: uuidMaquina,
        status: 'Desconhecido',
        operador: operadorMaquina,
        gerentes: {
          set: gerenteMaquina,
        },
      }
    });

    return res.status(200).json({ statusSaida: 'Created' });
    
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
