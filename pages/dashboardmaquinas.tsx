
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashLinhaMaquinas, DashmaqProps } from "@/types/types";

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


  const { user } = session;
  return {
    props: { user }
  }
}


const Dashboardmaquinas = ({ user }: DashboardmaquinasProps) => {

  const { data: session, status } = useSession();
  
  const [socketUrl, setSocketUrl] = useState('ws://localhost:3001/');
  const [messageHistory, setMessageHistory] = useState<any[]>([]); 
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [listaMaquinas, setListaMaquinas] = useState<Array<DashmaqProps>>([]);

  

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaMaquinas(list.maquinas);
      console.log(list);
    }
  }, [lastMessage]); 

  return (
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className="flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8">Máquinas</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap gap-4">
            {listaMaquinas.map((item, index) => (
                <CompDashMaquinas key={index} iotUUID={item.iotUUID} nome={item.nome} status={item.status} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboardmaquinas;
