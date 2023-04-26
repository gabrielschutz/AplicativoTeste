import React, { useRef } from "react";

interface SidebarProps {
  nome?: string;
  role?: string;
}

export function dashmaquinas(props: SidebarProps) {
  return (
    <div className="flex items-center rounded-3xl bg-yellow-200 p-3 shadow-xl h-40 w-70">
        <div>
          <p className="text-yellow-600text-base font-semibold">DashBoard Maquina: </p>
          <p className=" text-yellow-600 text-xs font-semibold">Operador:</p>
          <p className=" text-yellow-600 text-xs font-semibold">UUID Lora:</p>
          <p className=" text-yellow-600 text-xs font-semibold">Status: </p>
        </div>
      <div>
        <button className="bg-blue-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full">
          Resetar
        </button>
      </div>
    </div>
  );
};

export default dashmaquinas;