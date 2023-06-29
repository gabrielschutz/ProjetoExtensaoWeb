import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Sidebar from "@/components/SideBar/Sidebar2";
import prismadb from "@/lib/prismadb";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";


interface unidadeprops {
  dadosUser: any
  IP_PS: any
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

  const usuarioLogado = await axios.post(`http://${process.env.IPBACK}/auth/login`, {
    usuario: session.user?.email ?? undefined,
    senha: session.user?.name ?? undefined,
  });

  const IP_PS = process.env.IPBACK;

  const dadosUser = usuarioLogado.data;

  return {
    props: { dadosUser, IP_PS }
  }
}

const Unidades = ({ dadosUser, IP_PS }: unidadeprops) => {
  const { data: session, status } = useSession();

  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<
    { id: number; nome: string; endereco: string }[]
  >([]);

  const consultarUnidadesDisponiveis = useCallback(async () => {
    try {
      const response = await axios.get(`http://${IP_PS}/consulta/unidade`);
      setUnidadesDisponiveis(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    consultarUnidadesDisponiveis();
  }, []);

  return (
    <div className="flex">
      <Sidebar
        nome={dadosUser.nome ?? "Usuário desconhecido"}
        role={dadosUser.role}
      />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Unidades</h1>
        <div className="flex flex-wrap gap-4">
          {unidadesDisponiveis.map((unidade) => (
            <div
              key={unidade.id}
              className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-2">{unidade.nome}</h2>
              <p className="text-gray-500">{unidade.endereco}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unidades;
