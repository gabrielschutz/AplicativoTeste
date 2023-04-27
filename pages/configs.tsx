import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import { useCallback, useState } from "react";
import axios from 'axios';
import { Console } from "console";

interface DashboardmaquinasProps {
  user: any,
  usuarioLogado: any
  dashsBoardMaquinas: any
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

  const usuarioLogado = await prismadb.user.findUnique({
    where: {
      usuarioid: session.user?.email ?? undefined
    }
  });

  const { user } = session;
  return {
    props: { user, usuarioLogado }
  }
}

const Configs = ({ user, usuarioLogado, dashsBoardMaquinas }: DashboardmaquinasProps) => {
  const { data: session, status } = useSession()
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const [usuario, setUsuario] = useState({
    nome: '',
    senha: '',
    username: '',
    role: 'Administrador'
  });

  const [maquina, setMaquina] = useState({
    uuid: '',
    nomeMaq: '',
    idMaq: '',
    opeMaq: '',
  });

  const register = useCallback(async () => {
    try {
      const { nome, senha, username, role } = usuario;

      await axios.post('/api/register', {
        nomeUsuario: nome,
        senhaUsuario: senha,
        usernameUsuario: username,
        roleUsuario: role,

      });
    } catch (error) {
      console.log(error);
    }
  }, [usuario]);

  const [registerMaqStatus, setRegisterMaqStatus] = useState('');

  const registerMaquina = useCallback(async () => {
    try {
      const { uuid, nomeMaq, idMaq, opeMaq } = maquina;

      const response = await axios.post('/api/registerMaq', {
        nomeMaquina: nomeMaq,
        uuidMaquina: uuid,
        operadorMaquina: opeMaq,
        gerenteMaquina: session?.user?.name,
        idMaquina: idMaq
      });

      if (response.data.statusSaida === 'Updated') {
        setRegisterMaqStatus('updated');
      } else if (response.data.statusSaida === 'Created') {
        setRegisterMaqStatus('created');
      } else if (response.data.statusSaida === 'Includes') {
        setRegisterMaqStatus('inclused');
        console.log("Sua Mae e minha");
      }   

    } catch (error) {
      console.log(error);
    }
  }, [maquina]);



  const renderForm = () => {
    switch (selectedOption) {
      case 'opcao1':
        return (
          <div className="py-4">
            <div className="p-4 bg-zinc-100 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Máquinas ou Processos</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="nome" type="text" placeholder="Nome da Máquina" onChange={(ev) => setMaquina({ ...maquina, nomeMaq: ev.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    UUID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="uuid" type="text" placeholder="Digite o uuid da IOT de controle" onChange={(ev) => setMaquina({ ...maquina, uuid: ev.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    ID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="id" type="text" placeholder="Digite o ID da maquina!" onChange={(ev) => setMaquina({ ...maquina, idMaq: ev.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Operador:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="operador" type="text" placeholder="Digite o nome do Operador da maquina!" onChange={(ev) => setMaquina({ ...maquina, opeMaq: ev.target.value })} />
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); registerMaquina(); }}>
                    Enviar
                  </button>
                </div>
              </form>
              {registerMaqStatus === 'created' && (
                <div className="p-4 bg-teal-500 rounded shadow-lg m-3">
                  <p>A máquina com o ID fornecido foi criada.</p>
                </div>
              )}
              {registerMaqStatus === 'updated' && (
                <div className="p-4 bg-teal-500 rounded shadow-lg m-3">
                  <p>A máquina com o ID fornecido já foi criada. Você foi adicionado como operador!.</p>
                </div>
              )}
              {registerMaqStatus === 'inclused' && (
                <div className="p-4 bg-red-300 rounded shadow-lg m-3">
                  <p>A máquina com o ID fornecido já inclui você.</p>
                </div>
              )}
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
        const isAllowed = usuarioLogado.role === 'Administrador';
        if (!isAllowed) {
          return (
            <div className="py-4">
              <div className="p-4 bg-red-300 rounded shadow-lg">
                <p>Você não tem permissão para acessar esta opção.</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="py-4">
              <div className="p-4 bg-white rounded shadow-lg">
                <h2 className="text-lg font-bold mb-2">Cadastro de Usuários</h2>
                <form>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Nome do Usuário:
                    </label>
                    <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome do Usuário" onChange={(ev) => setUsuario({ ...usuario, nome: ev.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Senha do Usuário:
                    </label>
                    <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite a senha para o Usuário" onChange={(ev) => setUsuario({ ...usuario, senha: ev.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Username do Usuário:
                    </label>
                    <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="Digite o username do Usuário" onChange={(ev) => setUsuario({ ...usuario, username: ev.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Cargo do Usuário:
                    </label>
                    <select className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" onChange={(e) => setUsuario({ ...usuario, role: e.target.value })}>
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
        <Sidebar nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
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

