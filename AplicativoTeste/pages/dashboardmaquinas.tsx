
import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DashLinhaMaquinas, DashmaqProps } from "@/types/types";
import axios from 'axios';
require('dotenv').config();

interface DashboardmaquinasProps {
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
    props: { dadosUser, IP_WS, IP_PS}
  }
}


const Dashboardmaquinas = ({ dadosUser, IP_WS, IP_PS}: DashboardmaquinasProps) => {


  const [socketUrl, setSocketUrl] = useState(`ws://${IP_WS}/`);

  const [messageHistory, setMessageHistory] = useState<any[]>([]); 
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [listaMaquinas, setListaMaquinas] = useState<Array<DashmaqProps>>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaMaquinas(list.maquinas);
      console.log(list);
    }
  }, [lastMessage]); 

  return (
    <div className="flex">
      <Sidebar nome={dadosUser?.nome ?? "Usuário desconhecido"} role={dadosUser?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className="flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8">Máquinas</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap gap-4">
            {listaMaquinas.map((item, index) => (
                <CompDashMaquinas key={index} iotUUID={item.iotUUID} nome={item.nome} status={item.status} ip={IP_PS} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboardmaquinas;
