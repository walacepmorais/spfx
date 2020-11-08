export interface IItem{
    Title?: string;
    Id?: number;
    Created?: Date;
    Modified?: Date;
}

export interface IUrl{
    Description?: string;
    Url?: string;
}

export interface IMidia extends IItem{    
    FileRef?: string;        
    
    BannerImageUrl?: IUrl;
    FirstPublishedDate?: string;
    Count?: number;
    Midia?: string;
    Galeria?: IUrl;
     
}