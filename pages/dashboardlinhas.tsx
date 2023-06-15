import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from "@/lib/prismadb";
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashmaqProps, DashLinhaMaquinas } from "@/types/types";
import CompDashMaquinas from "../components/Dashboards/dashboardmaq";
import styles from "../styles/linhas.module.css";
import axios from "axios";

interface DashboardLinhasProps {
  user: any;
  usuarioLogado: any;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const { user } = session;
  return {
    props: { user },
  };
}

const DashBoardLinhas = ({ user }: DashboardLinhasProps) => {
  const { data: session, status } = useSession();
  const [socketUrl, setSocketUrl] = useState("ws://localhost:3001/");
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [listaLinhas, setListaLinhas] = useState<Array<DashLinhaMaquinas>>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaLinhas(list.linhas);
      console.log(list.linhas);
    }
  }, [lastMessage]);

  async function handleChangeStatusLine(nome: String, status: String){
    try {
      console.log("Enviei o Status: ",status);
      await axios.post('http://localhost:3002/changeStatusLinha', {
        nome: nome,
        status: status
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex">
      <Sidebar2
        nome={session?.user?.name ?? "Usuário desconhecido"}
      />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">
          Linhas de Produção{" "}
        </h1>
        {listaLinhas.map((item, index) => (
          <div className={styles.linha} key={index}>
            <h1 className={styles.h1_linha}>{item.nomeLinha}</h1>
            <button
            className={styles.botao_linha}
              onClick={() => {
                handleChangeStatusLine(item.nomeLinha ?? '', 'Atencao');
              }}
            >
              Desativar linha
            </button>
            <div className={styles.cadaLinha}>
              {item.maquinas &&
                item.maquinas.map((item2, index2) => (
                  <CompDashMaquinas
                    key={index2}
                    iotUUID={item2.iotUUID}
                    nome={item2.nome}
                    status={item2.status}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoardLinhas;
