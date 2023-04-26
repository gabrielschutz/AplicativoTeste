
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import { useState } from "react";

interface DashboardmaquinasProps {
  user: any,
  teste: any
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

  const teste = await prismadb.user.findUnique({
    where: {
      usuarioid: session.user?.name ?? undefined
    },
    include: {
      DashMaquinas: true,
    },
  });

  const { user } = session;
  return {
    props: { user, teste }
  }
}

const Dashboardmaquinas = ({ user, teste }: DashboardmaquinasProps) => {
  const { data: session, status } = useSession()
  const [dashs, setDashs] = useState([]);

  console.log(teste.usuarioid)
  console.log(teste.senha)
  return (
    <div className="font-popp ins antialiased">
      <div id="view" className="flex h-full w-screen flex-row">
      <Sidebar nome={session?.user?.email ?? "Usuário desconhecido"}/>
      <div className="p-4 flex flex-wrap gap-4 mt-2">
      </div>
      
      </div>
    </div>

  )
}

export default Dashboardmaquinas;

