import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import MidiaDetailService from "../service/MidiaDetailService";

export interface IReactMidiaDetailProps {
  description: string;
  service: MidiaDetailService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
}
