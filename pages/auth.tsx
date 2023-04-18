import Input from "@/components/Input";
import { useState } from "react";

const Auth = () => {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')

  return (
    <div className="relative h-full w-full bg-[url('/images/factory-bg.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">

        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <div className="flex flex-col items-center justify-items-center">
              <img src="/images/logo.png" alt="Logo" className="h-22 mb-8" />
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label="Usuario"
                onChange={(ev) => setUsuario(ev.target.value)}
                id="usuario"
                type="usuario"
                value={usuario}
              />
              <Input
                label="Senha"
                onChange={(ev) => setSenha(ev.target.value)}
                id="senha"
                value={senha}
              />

            </div>
            <button className="bg-zinc-500 py-3 text-white rounded-md w-full mt-10 hover:bg-zinc-300 transition">
              Entrar
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;