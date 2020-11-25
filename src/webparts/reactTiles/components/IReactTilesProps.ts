import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { DisplayMode } from "@microsoft/sp-core-library";
import { ITileInfo } from "../ITileInfo";

export interface IReactTilesProps {
  title: string;
  tileHeight: number;
  collectionData: ITileInfo[];
  description: string;
  displayMode: DisplayMode;

  fUpdateProperty: (value: string) => void;
  fPropertyPaneOpen: () => void;

  updateProperty: (value:string) =>void;
  themeVariant: IReadonlyTheme | undefined;

  
}
