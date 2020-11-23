import { CalendarEventRange } from ".";

export interface IFilter{
    localidade?: string;
    eventRange: CalendarEventRange;
}