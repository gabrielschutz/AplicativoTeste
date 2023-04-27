import { NextPageContext } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";

interface indexProps {
  user: any,
  usuarioLogado: any,
}

export async function getServerSideProps(context: NextPageContext){
  const session = await getSession(context);
  if(!session){
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
    }
  });

  const { user } = session;
  return {
    props: { user, usuarioLogado }
  }

}


const Home = ({ user, usuarioLogado }: indexProps) => {
  const { data: session, status } = useSession()
  return (
    <div className="font-popp ins antialiased">
      <div id="view" className="flex h-full w-screen flex-row">
      <Sidebar nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <h1 className="text-5xl font-extrabold dark:text-gray-700 mt-8 mb-4">Bem vindo: {usuarioLogado?.nome} </h1>
      </div>
    </div>
  )
}
export default Home;
