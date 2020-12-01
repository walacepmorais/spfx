export interface IItem{
    Title?: string;
    Id?: number;
    Created?: string;
    Modified?: string;
}


export interface ICategoria extends IItem{   }

export interface ITipoComunicado extends IItem{   }

export interface IUrl{
    Description?: string;
    Url?: string;
}

export interface INew extends IItem{
    FileRef?: string;    
    Categoria?: string;
    TipoComunicado? : string;
    FirstPublishedDate?: string;
    DocId?: number;
    Author?: string;
    Size?: number;
    Path?: string;
    Description?: string;
    PictureThumbnailURL?: string;
    ViewsLifeTime?: number;
    ViewsRecent?: number;
    OriginalPath?: string;
    LastModifiedTime?: Date;
    
    BannerImageUrl?: IUrl;
    Galeria?: IUrl;
    Midia?: string;
     
}

export interface INew {
    value?: INew[];
}

export interface INewsResult{
    totalPages? : number;
    news : INew[];
    totalRows? : number;
    pageSize: number;
    currentPage : number;

    hasNext : boolean;
    hasPrevious : boolean;
}

export interface IFilter{
    hasImagem?: boolean;
    hasVideo?: boolean;
    categoria?: string;
    tipoComunicado?: string;
}
