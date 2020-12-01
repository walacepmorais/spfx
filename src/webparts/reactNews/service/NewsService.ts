import { INew, INewsResult, IItem, IFilter } from './../interfaces/INews';
import MockHttpClient from "../common/MockHttpClient";
import { SearchQueryBuilder, SearchResults } from '@pnp/sp/search';
import { sp } from '@pnp/sp';
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { Environment, EnvironmentType, Guid } from '@microsoft/sp-core-library';
import { IItems, Items, PagedItemCollection } from '@pnp/sp/items';
import { IList } from '@pnp/sp/lists';


export interface INewsServiceProps{
     pageSize : number;
     siteId: Guid;
     webId: Guid;
}



export default class NewsService{

    public page = 1;
    public pageSize : number;
    private queryText : string ;
    private news : INew[] = [];
    
    
    public hasNext : boolean;

    private list : IList;
    private items : IItems;

    private pagedItems : PagedItemCollection<INew[]>;

    private nextUrl : string;
    private prevUrl : string;

    constructor (props : INewsServiceProps){
        this.pageSize = props.pageSize;        

    }

    public get (filter? : IFilter) : Promise<INewsResult>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return this.getItems(filter);
        }
    }

    private _getMockListData(): Promise<INewsResult> {
        return MockHttpClient.get();
    }
    
    public getPageExample (page: number) :INewsResult{
        return MockHttpClient.getPageExample(page);
    }

    public getPage (page: number) : Promise<INewsResult>{
        if (Environment.type === EnvironmentType.Local) {
            return MockHttpClient.getPage(page);
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return MockHttpClient.getPage(page);
        }
    }

    public getExample() : INew[]{
        this.news = MockHttpClient.getExample();
        return this.news;
    }

    public async getCategorias() : Promise<IItem[]>{
        return new Promise<any>(async (resolve, reject) => {
            let categorias = await sp.web.lists.getByTitle('Categorias de Publicação').items.select("Title", "ID").orderBy("Title").get<IItem>();
            resolve(categorias);
        });
    }

    public async getTiposComunicado(categoria: string) : Promise<IItem[]>{
        return new Promise<any>(async (resolve, reject) => {
            let categorias = await sp.web.lists.getByTitle('Tipo Comunicado')
                .items
                .filter(`Categoria eq ${categoria}`)
                .select("Title", "ID")
                .orderBy("Title")
                .get<IItem>();
            resolve(categorias);
        });
    } 

    private _getFilterText(filter?: IFilter){
        let queryText : string  = "Categoria ne null";

        if(filter === undefined) return queryText;

        if(filter.categoria !== null && filter.categoria !== undefined && filter.categoria != ""){
            queryText = `Categoria eq '${filter.categoria}'`;
        }

        if(filter.tipoComunicado !== null && filter.tipoComunicado !== undefined && filter.tipoComunicado != ""){
            queryText += ` and TipoComunicado eq '${filter.tipoComunicado}'` ;
        }

        if(filter.hasImagem == true && (filter.hasVideo == false || filter.hasVideo == null)){
            queryText += " and Midia eq 'Imagens'" ;
        }else if( (filter.hasImagem == false || filter.hasImagem == null) && filter.hasVideo == true){
            queryText += " and Midia eq 'Vídeos'";
        }else if(filter.hasImagem == true && filter.hasVideo == true){
            queryText += " and (Midia eq 'Vídeos' or Midia eq 'Imagens')";
        }

        return queryText;

    }

    public async getItems(filter?: IFilter) : Promise<INewsResult>{
        return new Promise<any>(async (resolve, reject) => {
            try{
                this.list = sp.web.lists.getByTitle('Site Pages');
                this.items = this.list.items
                    .orderBy('FirstPublishedDate', false)
                    .select(
                        'Id',
                        'Title',
                        'Description',
                        'FileRef',
                        'Categoria',
                        'TipoComunicado',
                        'BannerImageUrl',
                        'Created',
                        'Modified',
                        'FirstPublishedDate')
                    .filter(this._getFilterText(filter))
                    .top(this.pageSize);

                this.pagedItems = await this.items.getPaged<INew[]>();
                this.hasNext = this.pagedItems.hasNext;
                this.page = 1;

                this.news = this.pagedItems.results;

                let result : INewsResult = {
                    news : this.news,
                    pageSize : this.pageSize,
                    currentPage: this.page,
                    hasNext : this.hasNext,
                    hasPrevious : this.page > 1
                 };

                 resolve(result);

            }catch (error) {  
                reject(error);  
            }  

        });

        
    }

    public async getNext() : Promise<INewsResult>{
        return new Promise<any>(async (resolve, reject) => {
            try{

                let pageNews = [];
 
                let page = this.page + 1;

                let shouldPaginate = (page * this.pageSize) <= this.news.length;
                let shouldGetNext = this.hasNext && (page * this.pageSize > this.news.length);

                if(shouldGetNext){
                    this.pagedItems = await this.pagedItems.getNext();
                    pageNews=this.pagedItems.results;
                    this.news = this.news.concat(pageNews);
                    this.hasNext = this.pagedItems.hasNext;
                }else{
                    pageNews = this.paginate(this.news, this.pageSize, page);                           
                }

                
                 let result : INewsResult = {
                    news : pageNews,
                    pageSize : this.pageSize,
                    currentPage: page,
                    hasNext : this.hasNext || shouldPaginate,
                    hasPrevious : page > 1
                 };

                 this.nextUrl = (this.pagedItems as any).nextUrl;

                 this.page = page;

                 resolve(result);
            }catch (error) {  
                
                reject(error);  
            }  
        });
    }

    private paginate(array : Array<any>, page_size : number, page_number: number) : Array<any> {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    public async getPrevious() : Promise<INewsResult>{
        return new Promise<any>(async (resolve, reject) => {
            try{

                 this.page--;
                 let pageNews = this.paginate(this.news, this.pageSize, this.page);  
                 let total_pages = Math.ceil(this.news.length / this.pageSize);    
                 let r = (this.page * this.pageSize) <= this.news.length;       

                 let result : INewsResult = {
                    news : pageNews,
                    pageSize : this.pageSize,
                    currentPage: this.page,
                    hasNext : this.hasNext || r,
                    hasPrevious : this.page > 1
                 };

                 resolve(result);
            }catch (error) {  
                reject(error);  
            }  
        });
    }

    private getPrev<T>(items: IItems, paged: PagedItemCollection<T>): Promise<PagedItemCollection<T>> {
        let nextUrl = (paged as any).nextUrl;

        if(nextUrl !== undefined){
            this.nextUrl = nextUrl; // Private
        }
        
        this.prevUrl = this.nextUrl
            .split('skiptoken=')[1].split('&')[0].split('%26')
            .map(p => p.split('%3d'))
            .filter(p => p[0].indexOf('p_') === 0)
            .reduce((r, p) => {
                const value = p[0].replace('p_', '').split('_x005f_').reduce((res, prop) => {
                    return res[prop];
                }, paged.results[0]);
                return r.replace(p.join('%3d'), `${p[0]}%3d${value}`);
            }, this.nextUrl)
            .replace(new RegExp('Paged%3dTRUE', 'i'), 'Paged%3dTRUE%26PagedPrev%3dTRUE');
        
        
        
        const pagedCollection = new PagedItemCollection<T>(items, this.prevUrl, null);
        return pagedCollection.getNext();
    }




}

