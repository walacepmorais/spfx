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

export interface IEvent extends IItem{
    BannerUrl?: IUrl;
    Category?: string;
    EndDate?: Date;
    Localidade?: IItem;
    Location?: string;
    EventDate?: Date;
    Categoria?: ICategoriaEvento;
}

export interface IFilter{
    localidade?: string;
    eventDate?: Date;
    endDate?: Date;
}

export interface ICategoriaEvento extends IItem{
    cor?: string;
}