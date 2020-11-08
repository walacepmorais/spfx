export interface IItem{
    Title?: string;
    Id?: string;
    Created?: string;
    Modified?: string;
}

export interface IUrl{
    Description?: string;
    Url?: string;
}

export interface IMidiaDetail extends IItem{    
    Exists?: boolean;
    Length?: string;
    Name?: string;
    ServerRelativeUrl?: string;
    TimeCreated?: string;
    TimeLastModified?: string;
    UniqueId?: string;
    Thumbnail?: string;
    AlternateThumbnailUrl?: string;
    
}