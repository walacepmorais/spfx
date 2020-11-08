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

export interface IAniversariante extends IItem{    
    Name?: string;
    Birthday?: string;
    Department?: string;
    AccountName?: string;
    Path?: string;
    WorkEmail?: string;
    PictureURL?: string;
    OfficeNumber?: string;
    PreferredName?: string;
    
}

export interface IAniversariantes {
    value?: IAniversariante[];
}