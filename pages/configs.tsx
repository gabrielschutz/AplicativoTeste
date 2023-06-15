import { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import Sidebar from "@/components/SideBar/Sidebar2";
import prismadb from '@/lib/prismadb'
import CompDashMaquinas from '../components/Dashboards/dashboardmaq'
import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Console } from "console";
import Modal from "@/components/modal";

interface configsprops {
  user: any,
  usuarioLogado: any
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

  const usuarioLogado = await prismadb.usuario.findUnique({
    where: {
      username: session.user?.email ?? undefined
    }
  });

  const { user } = session;
  return {
    props: { user, usuarioLogado }
  }
}

const Configs = ({ user, usuarioLogado }: configsprops) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { data: session, status } = useSession()
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const [iot, setIot] = useState({
    uuidIOT: '',
    nomeIOT: '',
  });

  const [usuario, setUsuario] = useState({
    nome: '',
    senha: '',
    unidade: '',
    username: '',
    role: ''
  });

  const [maquina, setMaquina] = useState({
    uuidIOT: '',
    nomeMaq: '',
  });

  const [linha, setLinha] = useState({
    nomeDaLinha: '',
    Maquinas: [] as string[],
  });

  const [unidade, setUnidade] = useState({
    nomeUnidade: '',
    enderecoUnidade: '',
  });

  //======================= Usuarios ===========================================

  const [registerUserStatus, setRegisterUserStatus] = useState('');

  const register = useCallback(async () => {
    try {

      const { nome, senha, username, role, unidade } = usuario;

      const response = await axios.post('/api/register', {
        nomeUsuario: nome,
        senhaUsuario: senha,
        usernameUsuario: username,
        roleUsuario: role,
        unidadeUsuario: unidade,
      });

    } catch (error) {
      console.log(error);
    }
  }, [usuario]);

  //============================================================================


  //======================= IOT ===========================================

  const [iotDisponiveis, setIotDisponiveis] = useState<{ id: number; nome: string; uuid: string; ip: string; status: string }[]>([]);

  const consultarIotDisponiveis = useCallback(async () => {
    try {
      const response = await axios.post('/api/consultarIots');
      setIotDisponiveis(response.data);
      console.log(iotDisponiveis)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const registerIOT = useCallback(async () => {
    try {
      const { nomeIOT, uuidIOT } = iot;
      console.log(iot);
      const response = await axios.post('/api/registerIot', {
        nomeIOT: nomeIOT,
        uuidIOT: uuidIOT,
      });
    } catch (error) {
      console.log(error);
    }
  }, [iot]);

  //============================================================================

  //======================= MAQUINA ===========================================

  const [maqDisponiveis, setmaqDisponiveis] = useState<{ id: number; nome: string; uuidIOT: string }[]>([]);

  const consultarMaqDisponiveis = useCallback(async () => {
    try {
      const response = await axios.post('/api/consultarMaquinas');
      setmaqDisponiveis(response.data);
      console.log(maqDisponiveis)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const registerMaquina = useCallback(async () => {

    try {

      const { nomeMaq, uuidIOT } = maquina;

      console.log(maquina)

      const response = await axios.post('/api/registerMaq', {
        nomeMaq: nomeMaq,
        uuidIOT: uuidIOT,
      });

    } catch (error) {
      console.log(error);
    }

  }, [maquina]);

  //============================================================================

  //======================= Linhas ===========================================

  const registerLinha = useCallback(async () => {

    try {

      const { nomeDaLinha, Maquinas } = linha;
      const response = await axios.post('/api/registerLinha', {
        nomeDaLinha: nomeDaLinha,
        Maquinas: Maquinas,
        unidadeId: usuarioLogado?.unidadeId
      });

    } catch (error) {
      console.log(error);
    }

  }, [linha]);

  //============================================================================



  //======================= UNIDADES ===========================================


  //   === UNIDADES Disponiveis ===

  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<{ id: number; nome: string; endereco: string }[]>([]);

  const consultarUnidadesDisponiveis = useCallback(async () => {
    try {
      const response = await axios.post('/api/consultarUnidades');
      setUnidadesDisponiveis(response.data);
      console.log(unidadesDisponiveis)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const registerUnidade = useCallback(async () => {

    try {

      const { nomeUnidade, enderecoUnidade } = unidade;

      const response = await axios.post('/api/registerUnidade', {
        nomeUnidade: nomeUnidade,
        endereco: enderecoUnidade,
      });

    } catch (error) {
      console.log(error);
    }
  }, [unidade]);

  //============================================================================

  const renderForm = () => {
    const isAllowed = usuarioLogado.role === "ADMIN";
    switch (selectedOption) {
      case 'opcao0':
        return (
          <div className="py-4 px-10">
            <div className="p-4 bg-zinc-50 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de IOT</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="nome" type="text" placeholder="Nome da Iot" onChange={(ev) => setIot({ ...iot, nomeIOT: ev.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    UUID:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="uuid" type="text" placeholder="Digite o uuid da IOT de controle" onChange={(ev) => setIot({ ...iot, uuidIOT: ev.target.value })} />
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); registerIOT(); }}>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao1':
        return (
          <div className="py-4 px-10">
            <div className="p-4 bg-zinc-50 rounded shadow-lg">
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
                    IOT da Maquina:
                  </label>
                  <select
                    className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal"
                    id="inputUnidadeUsuario"
                    onChange={(e) => {
                      const selectedIot = iotDisponiveis.find(iot => iot.id === parseInt(e.target.value));
                      if(selectedIot){
                        setMaquina({ ...maquina, uuidIOT: selectedIot.uuid});
                      }
                    }}
                  >
                    <option value="">Selecione a unidade</option>
                    {iotDisponiveis.map((iot) => (
                      <option key={iot.id} value={iot.id}>
                        {iot.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); registerMaquina(); }}>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao2':
        return (
          <div className="py-4 px-10">
            <div className="p-4 bg-zinc-50 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Cadastro de Linhas de Produção</h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Nome:
                  </label>
                  <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="nomeLinha" type="text" placeholder="Nome da Linha" onChange={(ev) => setLinha({ ...linha, nomeDaLinha: ev.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Máquinas:
                  </label>
                  <select
                    className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal"
                    id="inputUnidadeUsuario"
                    onChange={(e) => {
                      const selectedMachines = Array.from(e.target.options)
                        .filter(option => option.selected)
                        .map(option => option.value);
                      setLinha({ ...linha, Maquinas: selectedMachines });
                    }}
                    multiple
                  >
                    <option value="">Selecione as Máquinas</option>
                    {maqDisponiveis.map((maquina) => (
                      <option key={maquina.id} value={maquina.id}>
                        {maquina.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-center">
                  <button className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); registerLinha(); }}>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'opcao3':

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
            <div className="py-4 px-10">
              <div className="p-4 bg-zinc-50 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-2">Cadastro de Unidades</h2>
                <form>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Nome:
                    </label>
                    <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputNameIot" type="text" placeholder="Nome da Unidade" onChange={(ev) => setUnidade({ ...unidade, nomeUnidade: ev.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Endereco:
                    </label>
                    <input className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" id="inputUuidIot" type="text" placeholder="End da Unidade" onChange={(ev) => setUnidade({ ...unidade, enderecoUnidade: ev.target.value })} />
                  </div>
                  <div className="text-center">
                    <button className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); registerUnidade(); }}>
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        }
      case 'opcao4':

        if (isAllowed) {
          return (
            <div className="py-4">
              <div className="p-4 bg-red-300 rounded shadow-lg">
                <p>Você não tem permissão para acessar esta opção.</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="py-4 px-10">
              <div className="p-4 bg-zinc-50 rounded shadow-lg">
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
                      Unidade do Usuário:
                    </label>
                    <select
                      className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal"
                      id="inputUnidadeUsuario"
                      onChange={(e) => {

                        setUsuario({ ...usuario, unidade: e.target.value });
                      }}
                    >
                      <option value="">Selecione a unidade</option>
                      {unidadesDisponiveis.map((unidade) => (
                        <option key={unidade.id} value={unidade.id}>
                          {unidade.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">
                      Cargo do Usuário:
                    </label>
                    <select className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm py-2 px-4 block w-full appearance-none leading-normal" onChange={(e) => setUsuario({ ...usuario, role: e.target.value })}>
                      <option value="ADMIN">Administrador</option>
                      <option value="GERENTE">Gerente</option>
                    </select>
                  </div>
                  <div className="text-center">
                    <button className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded" onClick={(e) => { e.preventDefault(); register(); }}>
                      Enviar
                    </button>
                  </div>
                </form>
                {registerUserStatus === 'created' && (
                  <div className="p-4 bg-teal-600 rounded shadow-lg m-3">
                    <p>Usuário criado com sucesso.</p>
                  </div>
                )}
                {registerUserStatus === 'uncreated' && (
                  <div className="p-4 bg-teal-600 rounded shadow-lg m-3">
                    <p>Esse username de usuário não está disponível!</p>
                  </div>
                )}
              </div>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (

    <div className="flex">
      <Sidebar nome={session?.user?.name ?? "Usuário desconhecido"} role={usuarioLogado?.role} />
      <div className="hidden lg:block h-screen px-1 items-center justify-center w-full">
        <h1 className=" flex flex-col items-center space-y-4 text-5xl font-extrabold dark:text-gray-700 mb-8 ">Configurações</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => {
            handleOptionClick('opcao0');
          }}>
            Cadastro de IOTS
          </div>
          <div className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => {
            handleOptionClick('opcao1');
            consultarIotDisponiveis();
          }}>
            Cadastro de Maquinas/Processos
          </div>
          <div className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => {
            handleOptionClick('opcao2');
            consultarMaqDisponiveis();
          }}>
             Cadastro de Linhas de Produção
          </div>
          <div className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleOptionClick('opcao3')}>Cadastro de Unidades</div>
          <div className="bg-zinc-600 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => {
            handleOptionClick('opcao4');
            consultarUnidadesDisponiveis();
          }}>
            Cadastro de Usuários
          </div>

        </div>
        {renderForm()}
      </div>
    </div>
  );

}

export default Configs;

