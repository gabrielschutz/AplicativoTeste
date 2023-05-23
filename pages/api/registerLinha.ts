import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { nomeLinha, idsMaq, idDaLinha, unidadeLinha } = req.body;

    const existingLinha = await prismadb.dashLinhas.findUnique({
      where: {
        idLinha: idDaLinha
      }
    })

    if (existingLinha) {

      if(idsMaq.some((element: string) => existingLinha.maquinasCadastradas.includes(element))){
        return res.status(200).json({ statusSaida: 'Passou id de Maq que ja existe na linha fornecida'});
      }

      const maquinasEncontradas = await prismadb.dashMaquinas.findMany({
        where: {
          idMaq: {
            in: idsMaq
          }
        }
      });

      if (maquinasEncontradas.length !== idsMaq.length) {
        return res.status(200).json({ statusSaida: 'Passou id de Maq Inexiste impossivel criar/atualizar essa Linha'});
      }

      const linhaUpdate = await prismadb.dashLinhas.update({
        where: {
          idLinha: idDaLinha,
        },
        data: {
          maquinasCadastradas: {
            push: idsMaq,
          },
          maquinas: {
            connect: maquinasEncontradas.map(maquina => ({ id: maquina.id }))
          },
        },
      });

      return res.status(200).json({statusSaida: 'Linha Atualizada com Sucesso'});
    }

    const maquinasEncontradas = await prismadb.dashMaquinas.findMany({
      where: {
        idMaq: {
          in: idsMaq
        }
      }
    });

    if (maquinasEncontradas.length !== idsMaq.length) {
      return res.status(200).json({ statusSaida: 'Passou id de Maq Inexiste impossivel criar/atualizar essa Linha'});
    }
    
    const dashLinhas = await prismadb.dashLinhas.create({
      data: {
        idLinha: idDaLinha,
        nomeLinha: nomeLinha,
        unidade: unidadeLinha,
        maquinas: {
          connect: maquinasEncontradas.map(maquina => ({ id: maquina.id }))
        },
        maquinasCadastradas: {
          set: idsMaq,
        },
      }
    });
    

    return res.status(200).json({ statusSaida: 'Foi criado uma linha com os Ids fornecidos' });

  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
