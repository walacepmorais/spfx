import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import NewsService from "../service/NewsService";

export interface IReactNewsProps {
  description: string;
  service: NewsService;
  context: WebPartContext;
  title:string;
  displayMode:DisplayMode;
  updateProperty: (value:string) =>void;
  pageSize: number;
}
