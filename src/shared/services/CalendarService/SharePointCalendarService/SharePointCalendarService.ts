/**
 * ExtensionService
 */
import { HttpClientResponse } from "@microsoft/sp-http";
import { CalendarEventRange, ICalendarService } from "..";
import { BaseCalendarService, BaseCalendarServiceProps } from "../BaseCalendarService";
import { ICalendarEvent } from "../ICalendarEvent";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { combine } from "@pnp/common";
import { IFilter } from "../IFilter";
import { ICategoriaEvento } from "../../../../webparts/reactCalendario/interfaces/IEvent";



export class SharePointCalendarService extends BaseCalendarService
  implements ICalendarService {

  private categorias : ICategoriaEvento[];

  constructor(props : BaseCalendarServiceProps) {
    super(props);
    this.Name = "SharePoint";
    this.categorias = props.categorias;
      
  }

  private _getCategoriaByName(name: string) : ICategoriaEvento{
    let categoria = this.categorias.filter((c) => { return c.Title === name; });
    return categoria === undefined || categoria === null || categoria.length == 0 ? { Cor: "rgb(3, 120, 124)"} : categoria[0];
  }

  private _getFilterText(filter?: IFilter) : string{
    let queryText : string  = "EventDate ne null";
    
    if(filter === undefined) return queryText;

    if(filter.localidade !== null && filter.localidade !== undefined && filter.localidade != ""){
        queryText = `(Localidade/Title eq '${filter.localidade}' or Localidade/Id eq null)`;
    }

    queryText += " and EventDate ge datetime'" + filter.eventRange.Start.toISOString() + 
      "' and EndDate lt datetime'" + filter.eventRange.End.toISOString() + "'";

    return queryText;

  }

  public getEvents = async (filter: IFilter): Promise<ICalendarEvent[]> => {

    try {
      const items = await sp.web.lists.getByTitle(this.listName)
        .items.select(
          "Title", 
          "ID",
          "Localidade/Id",
          "Localidade/Title",
          "BannerUrl",
          "Category",
          "EndDate",
          "Location",
          "EventDate",
          "Description")        
        .filter(this._getFilterText(filter))
        .expand('Localidade')
        .orderBy('EventDate', true)
        .get();

      // Once we get the list, convert to calendar events
      let events: ICalendarEvent[] = items.map((item: any) => {
        let eventUrl: string = `${this.serverRelativeUrl}/_layouts/15/Event.aspx?ListGuid=${this.listId}&ItemId=${item.Id}`;

        const eventItem: ICalendarEvent = {
          title: item.Title,
          start: item.EventDate,
          end: item.EndDate,
          url: eventUrl,
          allDay: item.fAllDayEvent,
          category: item.Category,
          description: item.Description,
          location: item.Location,
          localidade: item.Localidade,
          id: item.Id,
          bannerImageUrl: item.BannerImageUrl,
          categoria: this._getCategoriaByName(item.Cateogy)

        };
        return eventItem;
      });
      // Return the calendar items
      return events;
    }
    catch (error) {
      console.log("Exception caught by catch in SharePoint provider", error);
      throw error;
    }
  }
}
