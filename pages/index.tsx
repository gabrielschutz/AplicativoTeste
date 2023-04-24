import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext } from "next"
import { getSession, signOut } from "next-auth/react"

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
  return (
    <div>
      <h1 className='text-2xl'>
        Hello World
      </h1>
      <p>Login in as: </p>
      <button className="h-10 w-full bg-white" onClick={() => signOut()}>Sair</button>
    </div>
  )
}
