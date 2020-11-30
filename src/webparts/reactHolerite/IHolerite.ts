export interface IHoleriteInfo{
    empresa: string;
    cnpj: string;
    nome: string;
    matricula: string;
    unidadeOrganizacional: string;
    cargo: string;
    salarioBase: string;
    mesAno: string;
    banco: string;
    agencia: string;
    conta: string;
    dtCredito: string;
    admissao: string;
    cpf: string;
    pis: string;
    ctps: string;
    serie: string;
    rubricaInfo: IRubricaInfo;
}

export interface IRubricaInfo{
    rubricas: IRubrica[];
    salarioContribuicao: number;
    totalProventos: number;
    totalDescontos: number;
    dr: number;
    dsf: number;
    fgtsMes: number;
    liquido: number;
}

export interface IRubrica{
    descontos: string;
    proventos: string;
    anzhl: string;    
    lgart: string;
    lgtxt: string;
}

export interface IData{
    holerite: {
        pernr: string;
        perio: string;
        ocrsn: string;
    };
}