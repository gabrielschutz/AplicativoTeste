import { NextPageContext } from "next"
import { getSession, signOut } from "next-auth/react"
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

  return {
    props: {}
  }

}

const Profiles = () => {
  const {data : userP } = useCurrentUser();
  return(
    <div>
      <p>
        Oi
      </p>
    </div>
  )
}

export default Profiles;