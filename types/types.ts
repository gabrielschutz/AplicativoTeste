export interface DashmaqProps {
  nome?: String;
  iotUUID?: String;
  status?: String;
}

export interface DashLinhaMaquinas {
    nomeLinha?: String,
    maquinas?: Array<DashmaqProps>
    status?: String,
}