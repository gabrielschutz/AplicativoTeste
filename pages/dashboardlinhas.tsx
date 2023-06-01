
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import Dashlinhas from '../components/Dashboards/dashboardlinha'
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashmaqProps, DashLinhaMaquinas } from "@/types/types";

interface DashboardLinhasProps {
  user: any,
  usuarioLogado: any
}

export async function getServerSideProps(context: NextPageContext) {

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  const usuarioLogado = await prismadb.user.findUnique({
    where: {
      usuarioid: session.user?.email ?? undefined
    },
  });

  const { user } = session;
  return {
    props: { user, usuarioLogado }
  }
}

const DashBoardLinhas = ({ user, usuarioLogado }: DashboardLinhasProps) => {

  const { data: session, status } = useSession();
  const [socketUrl, setSocketUrl] = useState('ws://192.168.0.102:3001/');
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [listaLinhas, setListaLinhas] = useState<Array<DashLinhaMaquinas>>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaLinhas(list.linhas);
      console.log(list);
      console.log(listaLinhas);
    }
  }, [lastMessage]);

  return (
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Linhas de Produção </h1>
        {listaLinhas.map((item, index) => (
          <Dashlinhas key={index} nomeLinha={item.nomeLinha}/>
        ))}
      </div>
    </div>
  )
}

export default DashBoardLinhas;
