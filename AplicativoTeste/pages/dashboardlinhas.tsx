import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Sidebar2 from "@/components/SideBar/Sidebar2";
import prismadb from "@/lib/prismadb";
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashmaqProps, DashLinhaMaquinas } from "@/types/types";
import CompDashMaquinas from "../components/Dashboards/dashboardmaq";
import styles from "../styles/linhas.module.css";
import axios from "axios";

interface DashboardLinhasProps {
  dadosUser: any
  IP_WS: any
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

  const IP_WS = process.env.IPBACKWS;
  const IP_PS = process.env.IPBACK;


  const dadosUser = usuarioLogado.data;

  return {
    props: { dadosUser, IP_WS, IP_PS }
  }
}

const DashBoardLinhas = ({ dadosUser, IP_WS, IP_PS }: DashboardLinhasProps) => {

  const { data: session, status } = useSession();
  const [socketUrl, setSocketUrl] = useState(`ws://${IP_WS}/`);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [listaLinhas, setListaLinhas] = useState<Array<DashLinhaMaquinas>>([]);
  const [listaMaquinas, setListaMaquinas] = useState<Array<DashmaqProps>>([]);

  useEffect(() => {


    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);

      const list = JSON.parse(lastMessage.data);
      setListaMaquinas(list.maquinas);

      const linhasSet = new Set<number>();
      list.maquinas.forEach((maquina: { linha: { id: number; nomeLinha: string; } }) => {
        linhasSet.add(maquina.linha.id);
      });

      const linhas = Array.from(linhasSet).map((id: number) => {
        const maquina = list.maquinas.find((m: { linha: { id: number; nomeLinha: string; } }) => m.linha.id === id);
        return maquina ? maquina.linha : null;
      }).filter((linha: { id: number; nomeLinha: string; } | null) => linha !== null);

      setListaLinhas(linhas);
      //console.log(linhas);
    }

  }, [lastMessage]);

  async function handleChangeStatusLine(nome: String, status: String) {
    try {
      console.log("Enviei o Status: ", status);
      await axios.post(`http://${IP_PS}/changeStatusLinha`, {
        nome: nome,
        status: status
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex">
      <Sidebar2 nome={dadosUser?.nome ?? "Usuário desconhecido"} role={dadosUser?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">
          Linhas de Produção{" "}
        </h1>
        {listaLinhas.map((item, index) => (
          <div className={styles.linha} key={index}>
            <h1 className={styles.h1_linha}>{item.nomeLinha}</h1>
            <button
              className={styles.botao_linha}
              onClick={() => {
                handleChangeStatusLine(item.nomeLinha ?? '', 'Manutencao');
              }}
            >
              Desativar linha
            </button>
            <div className={styles.cadaLinha}>
              {listaMaquinas.map((item, index) => (
                <CompDashMaquinas key={index} iotUUID={item.iotUUID} nome={item.nome} status={item.status} ip={IP_PS} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default DashBoardLinhas;
