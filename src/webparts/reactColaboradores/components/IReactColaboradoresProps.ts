import { DisplayMode } from "@microsoft/sp-core-library";
import {  
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IReactColaboradoresProps {
  description: string;
  title: string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
  themeVariant: IReadonlyTheme | undefined;
  context: WebPartContext;
  pageUrl: string;
}
