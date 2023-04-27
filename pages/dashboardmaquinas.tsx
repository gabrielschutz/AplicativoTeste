
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";
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
    <div id="view" className="flex h-full w-screen flex-row">
      <Sidebar nome={session?.user?.email ?? "Usuário desconhecido"} />
      <div className="flex flex-col items-center ml-3">
        <h1 className="text-5xl font-extrabold dark:text-gray-700 mt-8 mb-4">Dashboard Maquinas</h1>
        <div className="flex flex-wrap gap-4">
          {dashs.map((dash: { id: string, nomeMaq: string, uuid: string, operador: string}) => (
            <CompDashMaquinas key={dash.id} uuid={dash.uuid} nomeMaq={dash.nomeMaq} operador={dash.operador} />
          ))}
        </div>
      </div>
    </div>

  )
}

export default Dashboardmaquinas;



// import { NextPageContext } from "next"
// import { getSession, useSession } from "next-auth/react"
// import Sidebar from "@/components/SideBar/Sidebar";
// import prismadb from '@/lib/prismadb'
// import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
// import CompDashMaquinasWeb from '../components/Dashboards/dashboardmaqwebsocket'
// import { useState } from "react";

// interface DashboardmaquinasProps {
//   user: any,
//   usuarioLogado: any
//   dashs: any
// }

// export async function getServerSideProps(context: NextPageContext) {

//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false,
//       }
//     }
//   }

//   const usuarioLogado = await prismadb.user.findUnique({
//     where: {
//       usuarioid: session.user?.email ?? undefined
//     },
//   });

//   const dashs = await prismadb.dashMaquinas.findMany({
//     where: {
//       gerentes: {
//         hasEvery: [session.user?.name ?? ''],
//       },
//     },
//   })


//   const { user } = session;
//   return {
//     props: { user, usuarioLogado, dashs }
//   }
// }

// const Dashboardmaquinas = ({ user, usuarioLogado, dashs }: DashboardmaquinasProps) => {
//   const { data: session, status } = useSession()

//   return (
//     <div id="view" className="flex h-full w-screen flex-row">
//       <Sidebar nome={session?.user?.email ?? "Usuário desconhecido"} />
//       <div className="flex flex-col items-center ml-3">
//         <h1 className="text-5xl font-extrabold dark:text-gray-700 mt-8 mb-4">Dashboard Maquinas</h1>
//         <div className="flex flex-wrap gap-4">
//           {dashs.map((dash: { id: string, nomeMaq: string, uuid: string, operador: string}) => (
//             <CompDashMaquinas key={dash.id} uuid={dash.uuid} nomeMaq={dash.nomeMaq} operador={dash.operador} />
//           ))}
//         </div>
//       </div>
//     </div>

//   )
// }

// export default Dashboardmaquinas;



