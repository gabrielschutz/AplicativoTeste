import React, { useEffect, useState } from 'react';

interface SidebarProps {
  nomeMaq?: string;
  operador?: string;
  uuid?: string;
}

export function dashmaquinas(props: SidebarProps) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Conexão WebSocket estabelecida');
    };

    socket.onmessage = (event) => {
      const statusData = JSON.parse(event.data);
      setStatus(statusData.status);
    };
    
    socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };
    return () => {
      socket.close();
    };

  }, []);

  return (
    <div className="flex items-center rounded-3xl bg-yellow-200 p-3 shadow-xl h-40 w-70">
      <div>
        <p className="text-yellow-600text-base font-semibold">DashBoard Maquina: {props.nomeMaq}</p>
        <p className=" text-yellow-600 text-xs font-semibold">Operador: {props.operador}</p>
        <p className=" text-yellow-600 text-xs font-semibold">UUID Lora: {props.uuid}</p>
        <p className=" text-yellow-600 text-xs font-semibold">Status: {status} </p>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full">
          Resetar
        </button>
      </div>
    </div>
  );
}

export default dashmaquinas;