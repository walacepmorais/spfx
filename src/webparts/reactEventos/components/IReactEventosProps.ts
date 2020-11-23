import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { CalendarEventRange } from '../../../shared/services/CalendarService';
import { SharePointCalendarService } from '../../../shared/services/CalendarService/SharePointCalendarService';
import EventService from '../../reactCalendario/service/EventService';

export interface IReactEventosProps {
  description: string;
  service: SharePointCalendarService;
  eventService: EventService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
  themeVariant: IReadonlyTheme | undefined;
  clientWidth: number;
  maxEvents: number;
  eventRange : CalendarEventRange;
}
