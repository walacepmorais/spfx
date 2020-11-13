import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import EventService from "../service/EventService";

export interface IReactCalendarioProps {
  description: string;
  service: EventService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
  themeVariant: IReadonlyTheme | undefined;
}
