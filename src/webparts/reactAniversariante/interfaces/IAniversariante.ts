import { IPersonaSharedProps } from "office-ui-fabric-react";

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

export interface IAniversarianteActions {
    Views?: number;
    Likes?: number;
    Comments?: number;
    InfoLoaded?: boolean;
    PageUrl?: string;

    IsLiked?: boolean;
    IsCommented?: boolean;
}

export interface IAniversariantePersona{
    imageUrl?: string;
    text?: string;
    secondaryText?: string;
    tertiaryText?: string;
    optionalText?: string;
}

export interface IAniversariante extends IItem, IPersonaSharedProps, IAniversarianteActions{    
    Name?: string;
    Birthday?: string;
    Department?: string;
    AccountName?: string;
    Path?: string;
    WorkEmail?: string;
    PictureURL?: string;
    OfficeNumber?: string;
    PreferredName?: string;
    UserName?: string;
    JobTitle?: string;
    WorkPhone?: string;
    
}

export interface IAniversariantes {
    value?: IAniversariante[];
}

/**
     * Properties for People (component id: 7f718435-ee4d-431c-bdbf-9c4ff326f46e)
     */
export interface People {
    layout: 1 | 2;
    persons?: any[];
}