
import { NextPageContext } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";

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

const Profiles = () => {
  const { data: session, status } = useSession()

  return (

      <div>
        <Sidebar/>
        <div>
        <h1>Home Page Oi {session?.user?.email}</h1>
        <p>Teste to the home page.</p>
      </div>
      </div>
    

  )
}

export default Profiles;

