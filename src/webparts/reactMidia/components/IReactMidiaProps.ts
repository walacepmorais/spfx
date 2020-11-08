import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import MidiaService from "../service/MidiaService";

export interface IReactMidiaProps {
  description: string;
  service: MidiaService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
}
