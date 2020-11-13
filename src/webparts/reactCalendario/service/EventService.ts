import { ICategoriaEvento, IEvent, IFilter, IItem } from './../interfaces/IEvent';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import MockHttpClient from '../common/MockHttpClient';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as moment from 'moment';

export interface EventServiceProps{
    serverRelativeUrl: string;
}

export default class EventService{
    private props: EventServiceProps;
    private localidades: IItem[];
    private events: IEvent[];
    private categorias: ICategoriaEvento[];
    private currentUser: any;

    constructor(props : EventServiceProps){
        this.props = props;
        this.getCategorias();
        
    }

    public get (filter?: IFilter) : Promise<IEvent[]>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return  this._getListData(filter);
        }
    }

    private _getMockListData(): Promise<IEvent[]> {
        return MockHttpClient.get()
          .then((data: IEvent[]) => {

            var listData: IEvent[] = data;
            return listData;

          }) as Promise<IEvent[]>;
      }

    private _getFilterText(filter?: IFilter) : string{
        let queryText : string  = "EventDate ne null";
        if(filter === undefined) return queryText;

        if(filter.localidade !== null && filter.localidade !== undefined && filter.localidade != ""){
            queryText = `(Localidade/Title eq '${filter.localidade}' or Localidade/Id eq null)`;
        }

        if(filter.eventDate !== null && filter.eventDate !== undefined ){
            queryText += ` and EventDate ge datetime'${filter.eventDate.toISOString()}'`;
        }

        if(filter.endDate !== null && filter.endDate !== undefined ){
            queryText += ` and EventDate le datetime'${filter.endDate.toISOString()}'`;
        }

        return queryText;

    }

    public getEventListId() : Promise<string>{
        return new Promise<any>(async (resolve, reject) => {
            let list = await sp.web.lists.getByTitle('Events').get();
            resolve(list.Id);
        });
    }

    private _getLocalidadeByName(name: string) : IItem{
        return this.localidades.filter((l) => { return l.Title === name; })[0];
    }

    private _getCategoriaByName(name: string) : ICategoriaEvento{
        let categoria = this.categorias.filter((c) => { return c.Title === name; });
        return categoria === undefined || categoria === null || categoria.length == 0 ? { cor: "rgb(3, 120, 124)"} : categoria[0];
    }

    private _getListData(filter?: IFilter): Promise<IEvent[]> {
        return new Promise<any>(async (resolve, reject) => {

            this.events = await sp.web.lists.getByTitle('Events')
                .items
                .select(
                    "Title", 
                    "ID",
                    "Localidade/Id",
                    "Localidade/Title",
                    "BannerUrl",
                    "Category",
                    "EndDate",
                    "Location",
                    "EventDate",
                    )
                .filter(this._getFilterText(filter))
                .expand('Localidade')
                .orderBy("EventDate")
                .get<IEvent[]>();
            
            this.events =this.events.map(event => ({
                ...event,
                Categoria: this._getCategoriaByName(event.Category)
            }));

            resolve(this.events);
        });

    }
    
    public async getLocalidades() : Promise<IItem[]>{
        return new Promise<any>(async (resolve, reject) => {
            this.localidades = await sp.web.lists.getByTitle('Localidade').items.select("Title", "ID").orderBy("Title").get<IItem[]>();
            resolve(this.localidades);
        });
    }

    public async getCategorias() : Promise<ICategoriaEvento[]>{
        return new Promise<any>(async (resolve, reject) => {
            this.categorias = await sp.web.lists.getByTitle('EventosCategorias').items.select("Title", "ID", "Cor").orderBy("Title").get<ICategoriaEvento[]>();
            resolve(this.categorias);
        });
    }
    
}