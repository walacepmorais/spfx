import { WebPartContext } from "@microsoft/sp-webpart-base";
import ComunicadoService from "../service/ComunicadoService";
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IReactComunicadosProps {
  description: string;
  service: ComunicadoService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
  
}
