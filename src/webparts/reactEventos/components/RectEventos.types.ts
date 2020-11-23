import { Moment } from "moment";
import { ICalendarEvent } from "../../../shared/services/CalendarService";

export interface IReactEventosState {
    events: ICalendarEvent[];
    error: any|undefined;
    isLoading: boolean;
    currentPage: number;
  }


  export interface IFeedCache {
    events: ICalendarEvent[];
    expiry: Moment;
    feedType: string;
    listName: string;
  }