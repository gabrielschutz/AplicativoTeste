
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashmaqProps } from "@/types/types";

interface DashboardmaquinasProps {
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

const Dashboardmaquinas = ({ user, usuarioLogado }: DashboardmaquinasProps) => {

  const { data: session, status } = useSession();
  
  const [socketUrl, setSocketUrl] = useState('ws://192.168.0.102:3001/');
  const [messageHistory, setMessageHistory] = useState<any[]>([]); 
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [listaMaquinas, setListaMaquinas] = useState<Array<DashmaqProps>>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaMaquinas(list.maquinas);
      console.log(list);
      console.log(listaMaquinas);
    }
  }, [lastMessage]); 

  return (
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Máquinas </h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap gap-4">
            {listaMaquinas.map((item, index) => (
              <CompDashMaquinas key={index} codigo={item.codigo} idIot={item.idIot} nome={item.nome} nomeOperador={item.nomeOperador} status={item.status} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboardmaquinas;
