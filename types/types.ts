export interface DashmaqProps {
  nome?: String;
  codigo?: number;
  nomeOperador?: String;
  idIot?: String;
  status?: String;
}

export interface DashLinhaMaquinas {
    nomeLinha?: String,
    maquinas?: Array<DashmaqProps>
    handle?: String,
}