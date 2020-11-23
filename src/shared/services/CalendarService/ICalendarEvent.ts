import { ICategoriaEvento } from "../../../webparts/reactCalendario/interfaces/IEvent";

export interface ICalendarEvent {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    url: string|undefined;
    allDay: boolean;
    category: string|undefined;
    description: string|undefined;
    location: string|undefined;
    localidade?: IItem;
    bannerImageUrl?: any;
    categoria?: ICategoriaEvento;
}

export interface IItem{
    Title?: string;
    Id?: number;
    Created?: Date;
    Modified?: Date;
}