import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from "@/lib/prismadb";
import { useEffect, useState } from "react";
import Dashmaquinas from "../components/Dashboards/dashboardmaq";

interface DashboardLinhasProps {
  user: any;
  usuarioLogado: any;
  linhas: any;
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

  const usuarioLogado = await prismadb.user.findUnique({
    where: {
      usuarioid: session.user?.email ?? undefined,
    },
  });

  const linhas = await prismadb.dashLinhas.findMany({
    where: {
      unidade: usuarioLogado?.unidade,
    },
    include: {
      maquinas: true,
    },
  });

  const { user } = session;
  return {
    props: { user, usuarioLogado, linhas },
  };
}

const DashboardLinhas = ({
  user,
  usuarioLogado,
  linhas,
}: DashboardLinhasProps) => {
  const { data: session, status } = useSession();

  return (
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className="flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8">Linhas</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap gap-4 bg-gray-400 rounded-2xl">
            {linhas.map((linha: any) => (
              <div key={linha.idLinha} className="mb-4">
                <h2 className="flex flex-col items-center space-y-4 text-2xl font-extrabold dark:text-yellow-500 mb-4 mt-2">{linha.nomeLinha}</h2>
                <div className="flex flex-wrap gap-4">
                  {linha.maquinas.map((maquina: any) => (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" key={maquina.idMaq}>
                      <Dashmaquinas
                        nomeMaq={maquina.nomeMaq}
                        operador={maquina.operador}
                        uuid={maquina.uuid}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLinhas;
