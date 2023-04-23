
import { NextPageContext } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import useCurrentUser from "@/hooks/useCurrentUser";

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

  const { user } = session;
  return {
    props: { user }
  }

}

const Profiles = () => {
  const { data: session, status } = useSession()
  
  return(
    <div>
      <p>
        Oi {session?.user?.email}
      </p>   
    </div>
  )
}

export default Profiles;

