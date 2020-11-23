import { WebPartContext } from "@microsoft/sp-webpart-base";
import { CalendarEventRange, ICalendarEvent } from ".";
import { IFilter } from "./IFilter";

export interface ICalendarService {
    Context: WebPartContext;
    FeedUrl: string;
    EventRange: CalendarEventRange;
    UseCORS: boolean;
    CacheDuration: number;
    MaxTotal: number;
    ConvertFromUTC: boolean;
    Name: string;
    getEvents: (filter: IFilter) => Promise<ICalendarEvent[]>;
}
