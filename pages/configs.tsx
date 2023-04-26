import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import { useCallback, useState } from "react";
import axios from 'axios';

interface DashboardmaquinasProps {
  user: any,
  teste: any
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

  const teste = await prismadb.user.findUnique({
    where: {
      usuarioid: session.user?.email ?? undefined
    }
  });

  const { user } = session;
  return {
    props: { user, teste }
  }
}


const Configs = ({ user, teste }: DashboardmaquinasProps) => {
  const { data: session, status } = useSession()
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const [nomeUsuario, setnomeUsuario] = useState('')
  const [senhaUsuario, setsenhaUsuario] = useState('')
  const [usernameUsuario, setusernameUsuario] = useState('')
  const [roleUsuario, setroleUsuario] = useState('Administrador')

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        nomeUsuario,
        senhaUsuario,
        usernameUsuario,
        roleUsuario,
      });

    } catch (error) {
        console.log(error);
    }
  }, [nomeUsuario, senhaUsuario, usernameUsuario, roleUsuario]);

  const renderForm = () => {
    switch (selectedOption) {
      case 'opcao1':
        return (
          <div className="py-4">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Máquinas ou Processos</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome da Máquina" />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    UUID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite o uuid da IOT de controle" />
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao2':
        return (
          <div className="py-4">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Linhas de Produção</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome da Linha de Produção" />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    UUID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite o uuid da IOT de controle" />
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao3':
        return (
          <div className="py-4">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Unidades</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome da Unidade" />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    UUID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite o uuid da IOT de controle" />
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao4':
        const isAllowed = teste.role === 'Administrador';
        if (!isAllowed) {
          return (
          <div className="py-4">
            <div className="p-4 bg-red-300 rounded shadow-lg">
              <p>Você não tem permissão para acessar esta opção.</p>
            </div>
          </div>
          );
        } else{
        return (
          <div className="py-4">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Usuários</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome do Usuário:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome do Usuário" onChange={(ev: any) => setnomeUsuario(ev.target.value)}/>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Senha do Usuário:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite a senha para o Usuário" onChange={(ev: any) => setsenhaUsuario(ev.target.value)}/>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Username do Usuário:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite o username do Usuário" onChange={(ev: any) => setusernameUsuario(ev.target.value)}/>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Cargo do Usuário:
                  </label>
                  <select className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" onChange={(e) => setroleUsuario(e.target.value)}>
                    <option value="Administrador">Administrador</option>
                    <option value="Gerente">Gerente</option>
                  </select>
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded " onClick={register}>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="font-popp antialiased">
      <div id="view" className="flex h-full w-screen flex-row">
        <Sidebar nome={session?.user?.name ?? "Usuário desconhecido"} role={teste?.role}/>
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl font-extrabold dark:text-gray-700 mb-8">Configurações</h1>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleOptionClick('opcao1')}>Cadastro de Maquinas/Processos</div>
            <div className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleOptionClick('opcao2')}>Cadastro de Linhas de Produção</div>
            <div className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleOptionClick('opcao3')}>Cadastro de Unidades</div>
            <div className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleOptionClick('opcao4')}>Cadastro de Usuarios</div>
          </div>
          {renderForm()}
        </div>
      </div>
    </div>


  );

}

export default Configs;

