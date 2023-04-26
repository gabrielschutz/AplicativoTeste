import { NextPageContext } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";

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

  return {
    props: {}
  }

}

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <div className="font-popp ins antialiased">
      <div id="view" className="flex h-full w-screen flex-row">
      <Sidebar nome={session?.user?.name ?? "Usuário desconhecido"}/>
      <h1>Oiee</h1>
      </div>
    </div>
  )
}
