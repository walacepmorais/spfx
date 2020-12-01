export interface IItem{
    Title?: string;
    Id?: number;
    Created?: Date;
    Modified?: Date;
}

export interface ICategoria extends IItem{   
}

export interface ITipoComunicado extends IItem{   
}

export interface IUrl{
    Description?: string;
    Url?: string;
}

export interface IComunicado extends IItem{    
    FileRef?: string;        
    Categoria?: string;
    TipoComunicado? : string;
    BannerImageUrl?: IUrl;
    FirstPublishedDate?: string;
     
}

export interface IComunicados {
    value?: IComunicado[];
}