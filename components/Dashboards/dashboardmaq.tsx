import React, { useRef } from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface SidebarProps {
  nomeMaq?: string;
  operador?: string;
  uuid?: string;
}


export function Dashmaquinas(props: SidebarProps) {

  const [status, setStatus] = useState(null);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get('/api/StatusLora');
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    getStatus();

    const interval = setInterval(getStatus, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  let statusColor;

  if (status === 'on') {
    statusColor = 'bg-green-400';
  } else if (status === 'off') {
    statusColor = 'bg-red-400';
  } else {
    statusColor = 'bg-orange-300';
  }

  return (
    <div className={`flex items-center rounded-3xl ${statusColor} p-3 shadow-xl h-40 w-70`}>
      <div>
        <p className="text-grey-900 text-base font-semibold">DashBoard Maquina: {props.nomeMaq}</p>
        <p className=" text-grey-900 text-xs font-semibold">Operador: {props.operador}</p>
        <p className=" text-grey-900 text-xs font-semibold">UUID Lora: {props.uuid}</p>
        <p className=" text-grey-900 text-xs font-semibold">Status: {status} </p>
      </div>
      <div className="m-8">
        <button className="bg-blue-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full">
          Resetar
        </button>
      </div>
    </div>
  );
};

export default Dashmaquinas;