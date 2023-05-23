
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import CompDashMaquinasWeb from '../components/Dashboards/dashboardmaqwebsocket'
import { useState } from "react";

interface DashboardmaquinasProps {
  user: any,
  usuarioLogado: any
  dashs: any
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

  const dashs = await prismadb.dashMaquinas.findMany({
    where: {
      gerentes: {
        hasEvery: [session.user?.name ?? ''],
      },
    },
  })


  const { user } = session;
  return {
    props: { user, usuarioLogado, dashs }
  }
}

const Dashboardmaquinas = ({ user, usuarioLogado, dashs }: DashboardmaquinasProps) => {
  const { data: session, status } = useSession()

  return (
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Máquinas </h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap gap-4">
            {dashs.map((dash: { id: string, nomeMaq: string, uuid: string, operador: string }) => (
              <CompDashMaquinas key={dash.id} uuid={dash.uuid} nomeMaq={dash.nomeMaq} operador={dash.operador} />
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Dashboardmaquinas;
