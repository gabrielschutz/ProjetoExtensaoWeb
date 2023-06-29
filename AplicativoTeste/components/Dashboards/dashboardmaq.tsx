import { DashmaqProps } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export function Dashmaquinas(props: DashmaqProps) {

  const [statusColor, setStatusColor] = useState("");
  const [statusName, setStatusName] = useState("");

  function getStatusColor(value: String) {
    if (value == 'Ativo') {
      setStatusName('Ativo');
      setStatusColor("bg-green-400");
    } else if (value == 'Atencao') {
      setStatusColor("bg-yellow-600");
      setStatusName('Atenção');
    } else if (value == 'Manutencao'){
      setStatusColor("bg-red-600");
      setStatusName("Manutenção");
    }
  }

  useEffect(() => {
    getStatusColor(props.status ?? '');
  }, [props.status])

  async function handleChangeStatus(status: String) {
    try {

      console.log("Enviei o Status: ",status);
      console.log(props.ip);


      await axios.post(`http://${props.ip}/changeStatusMaquina`, {
        //http://192.168.1.104:3002/changeStatusMaquina
        codigo: props.iotUUID,
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
    <div
      className={`flex items-center rounded-2xl ${statusColor} p-3 shadow-xl h-40 min-w-[300px]`}
    >
      <div>
        <p className="text-grey-900 text-base font-semibold">
          Nome: {props.nome}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">
          UUID Lora: {props.iotUUID}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">Status: {statusName} </p>
        <div className="my-3">
          <button className="bg-green-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-" onClick={(e) => { e.preventDefault(); handleChangeStatus("Ativo");}}>
            Ativar
          </button>
          <button className="bg-red-400 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-3" onClick={(e) => { e.preventDefault(); handleChangeStatus("Manutencao");}}>
            Manutenção
          </button>
          <button className="bg-yellow-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-3" onClick={(e) => { e.preventDefault(); handleChangeStatus("Atencao");}}>
            Atenção
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashmaquinas;
