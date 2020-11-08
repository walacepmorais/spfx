import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import AniversarianteService from "../service/AniversarianteService";

export interface IReactAniversarianteProps {
  description: string;
  service: AniversarianteService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
}
