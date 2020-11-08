export interface IItem{
    Title?: string;
    Id?: number;
}

export interface IUrl{
    Description?: string;
    Url?: string;
}

export interface IDestaque extends IItem{    
    FileRef?: string;
    Texto?: string;
    Url?: IUrl;
    Ordem?: number;    
}

export interface IDestaques {
    value?: IDestaque[];
}