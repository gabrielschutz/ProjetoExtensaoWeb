import { NextPageContext } from "next"
import { getSession, signOut, useSession } from "next-auth/react"

import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from "@/lib/prismadb";


interface indexProps {
  user: any,
  usuarioLogado: any,
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


  const { user } = session;
  return {
    props: { user }
  }

}


const Home = ({ user }: indexProps) => {
  const { data: session, status } = useSession()
  return (
    
    <div className="flex">
      <Sidebar2 nome={session?.user?.name ?? "Usuário desconhecido"} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
          <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Projeto Toyota</h1>
          <div className="flex flex-col items-center space-y-4">
            <p>Bem Vindo {session?.user?.name}</p>
          </div>
        </div>
    </div>
  )
}
export default Home;
