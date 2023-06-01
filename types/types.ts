export interface DashmaqProps {
  nome?: String;
  codigo?: number;
  nomeOperador?: String;
  idIot?: String;
  status?: String;
}

export interface DashLinhaMaquinas {
    nomeLinha?: String,
    codigo?: Number,
    maquinas?: Array<DashmaqProps>
    handle?: String,
}