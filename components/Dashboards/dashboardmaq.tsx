import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface DashmaqProps {
  nomeMaq?: string;
  operador?: string;
  idMaq?: string;
  uuid?: string;
}

export function Dashmaquinas(props: DashmaqProps) {
  const [status, setStatus] = useState(null);
  
  const [socketUrl, setSocketUrl] = useState('ws://192.168.0.102:3001/');

  const [messageHistory, setMessageHistory] = useState<any[]>([]); 

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]); 
    }
  }, [lastMessage]); 

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
}

export default Dashmaquinas;
