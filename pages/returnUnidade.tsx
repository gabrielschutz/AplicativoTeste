import Input from "@/components/Input";
import { useCallback, useState } from "react";
import axios from 'axios';

const Add = () => {

  const [username, setusername] = useState("admin");
  const [nome, setnome] = useState("Administrador Geral");
  const [senha, setsenha] = useState("admin");
  const [unidadeId, setunidadeId] = useState(1);
  const [role, setRole] = useState("ADMIN");


  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.post("/api/pesquisar", {
        username,
        nome,
        senha,
        unidadeId
      });

      // Exibir uma mensagem de sucesso ou redirecionar para outra página
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      // Exibir uma mensagem de erro
    }
  }, [username,
    nome,
    senha,
    unidadeId]);

  return (
    <div className="relative h-full w-full bg-[url('/images/factory-bg.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <button type="button" onClick={handleSubmit}>Pesquisar</button>
    </div>
  );
};

export default Add;
