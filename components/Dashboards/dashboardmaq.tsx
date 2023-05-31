import { DashmaqProps } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export function Dashmaquinas(props: DashmaqProps) {
  const [statusColor, setStatusColor] = useState("");
  const [statusName, setStatusName] = useState("");

  function getStatusColor(value: String) {
    if(value == '1'){
      setStatusName('Ativo');
      setStatusColor("bg-green-400");
    } else if(value == '2'){
      setStatusColor("bg-orange-300");
      setStatusName('Atenção');
    } else {
      setStatusColor("bg-red-400");
      setStatusName("Manutenção");
    }
  }

  useEffect(() => {
    getStatusColor(props.status ?? '');
    console.log('pegou a cor!')
  }, [props.status])

  async function handleDisableMaquina(status: String){
    try {
      await axios.post('http://localhost:3002/changeStatus', {
        codigo: props.codigo,
        status: status
      });
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div
      className={`flex items-center rounded-3xl ${statusColor} p-3 shadow-xl h-40 min-w-[300px]`}
    >
      <div>
        <p className="text-grey-900 text-base font-semibold">
          Nome: {props.nome}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">
          Operador: {props.nomeOperador}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">
          UUID Lora: {props.idIot}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">
          ID Maq: {props.codigo}
        </p>
        <p className=" text-grey-900 text-xs font-semibold">Status: {statusName} </p>
      </div>
    </div>
  );
}

export default Dashmaquinas;
