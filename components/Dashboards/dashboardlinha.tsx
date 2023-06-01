import { DashmaqProps, DashLinhaMaquinas } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import CompDashMaquinas from '../Dashboards/dashboardmaq'

export function Dashlinhas( propsLinha: DashLinhaMaquinas,propsMaq: DashmaqProps) {

  const [socketUrl, setSocketUrl] = useState('ws://192.168.0.102:3001/');
  const [messageHistory, setMessageHistory] = useState<any[]>([]); 
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [listaMaquinas, setListaMaquinas] = useState<Array<DashmaqProps>>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
      const list = JSON.parse(lastMessage.data);
      setListaMaquinas(list.maquinas);
      console.log(list);
      console.log(listaMaquinas);
    }
  }, [lastMessage]);

  async function handleDisableLinha(status: String) {
    try {
      console.log("Enviei o Status: ", status);
      await axios.post('http://localhost:3002/changeStatusLinha', {
        codigo: propsLinha.handle,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div>
        <p className="text-grey-900 text-base font-semibold">
          Nome da linha: {propsLinha.nomeLinha}
        </p>
        <div>
          {listaMaquinas.map((item, index) => (
            <CompDashMaquinas key={index} codigo={item.codigo} idIot={item.idIot} nome={item.nome} nomeOperador={item.nomeOperador} status={item.status} />
          ))}
        </div>
        <div className="my-3">
          <button className="bg-green-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-" onClick={(e) => { e.preventDefault(); handleDisableLinha("1"); }}>
            Ativar
          </button>
          <button className="bg-yellow-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-3" onClick={(e) => { e.preventDefault(); handleDisableLinha("2"); }}>
            Manutenção
          </button>
          <button className="bg-red-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-3xl mx-3" onClick={(e) => { e.preventDefault(); handleDisableLinha("3"); }}>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashlinhas;
