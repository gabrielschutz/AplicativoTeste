import React, { useRef } from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DashmaqProps {
  nomeMaq?: string;
  operador?: string;
  idMaq?: string;
  uuid?: string;
}


export function Dashmaquinas(props: DashmaqProps) {

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
    <div className={`flex items-center rounded-3xl ${statusColor} p-3 shadow-xl h-40 min-w-[300px]`}>
      <div>
        <p className="text-grey-900 text-base font-semibold">Nome: {props.nomeMaq}</p>
        <p className=" text-grey-900 text-xs font-semibold">Operador: {props.operador}</p>
        <p className=" text-grey-900 text-xs font-semibold">UUID Lora: {props.uuid}</p>
        <p className=" text-grey-900 text-xs font-semibold">ID Maq:{props.idMaq}</p>
        <p className=" text-grey-900 text-xs font-semibold">Status: {status} </p>
      </div>
    </div>
  );
};

export default Dashmaquinas;