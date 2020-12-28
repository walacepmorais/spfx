import { IAniversariante, IItem, People } from './../interfaces/IAniversariante';
import { sp } from "@pnp/sp";
import "@pnp/sp/files";
import "@pnp/sp/search";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/site-users/web";

import { ClientsideWebpart, CreateClientsidePage, IClientsidePageComponent, PromotedState } from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";

import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import MockHttpClient from '../common/MockHttpClient';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';



export default class AniversarianteService{
    
    private url : string;
    private currentUser: ISiteUserInfo;
    private partDefs: IClientsidePageComponent[];
    private partDef: IClientsidePageComponent[];

    constructor(url: string) {        
        this.url = url;
        
    }

    private _getDestinationPageFilePath(name: string) : string {
        return `${this.url}/SitePages/Aniversariantes/${this._getFileName(name)}`;
    }

    private _getOriginPageFilePath(name: string) : string {
        return `${this.url}/SitePages/${this._getFileName(name)}`;
    }

    private _getFileName(name : string ) : string{
        return `${name.replace(/\s/g, "")}.aspx`;
    }


    public async like(userName:string, name:string) : Promise<any>{
        return new Promise<any>(async (resolve, reject) => {
            try{
                const page = await sp.web.loadClientsidePage(this._getDestinationPageFilePath(name));

                let info = await page.getLikedByInformation();

                if(info.isLikedByUser){
                    await page.unlike();
                }else{
                    await page.like();
                }

                info = await page.getLikedByInformation();

                resolve({ isLikedByUser: info.isLikedByUser, likeCount : info.likeCount });
            }catch (e){
                reject(e);
            }
        });

    }


    private async _loadPage(aniversariante : IAniversariante){
        return new Promise<any>(async (resolve, reject) => {
            try{
                const page = await sp.web.loadClientsidePage(this._getDestinationPageFilePath(aniversariante.WorkEmail));

                const info = await page.getLikedByInformation();

                const comments = await page.getComments();

                let isCommented = comments.filter((v) => { return v.author.id === this.currentUser.Id; }).length > 0; 
                
                let result : IAniversariante = aniversariante;
                result.Likes = info.likeCount;
                result.Comments = comments.length;
                result.InfoLoaded = true;
                result.PageUrl = this._getDestinationPageFilePath(aniversariante.WorkEmail);
                result.IsLiked = info.isLikedByUser;
                result.IsCommented = isCommented;


                resolve(result);
            }catch (e){
                reject(e);
            }
        });

    }

    private async _createPage(aniversariante : IAniversariante ) : Promise<any>{
        return new Promise<any>(async (resolve, reject) => {
            try{
                const page = await CreateClientsidePage(sp.web, aniversariante.WorkEmail, aniversariante.Title, "Article", PromotedState.PromoteOnPublish);
                page.bannerImageUrl = `${this.url}/SiteAssets/images/aniversariantes/HeaderAniversarianteHTML.png`;
                page.thumbnailUrl = `${this.url}/_vti_bin/DelveApi.ashx/people/profileimage?size=M&userId=${aniversariante.WorkEmail}`;
                page.topicHeader = `Feliz Aniversário, ${aniversariante.Title}!`;
                page.title =`Feliz Aniversário, ${aniversariante.Title}!`;
                page.description = `Feliz Aniversário, ${aniversariante.Title}!`;
                page.headerTextAlignment = "Left";

                if (this.partDef.length > 0) {
                    let part = ClientsideWebpart.fromComponentDef(this.partDef[0]);                    
                
                    part.setProperties<People>({
                        layout: 1,
                        persons : [{
                            "id": aniversariante.AccountName,
                            "upn": aniversariante.UserName,
                            "department": aniversariante.Department,                            
                            "phone": aniversariante.WorkPhone,
                            "role": aniversariante.JobTitle,                            
                            }]
                        });
                    page.addSection().addColumn(12).addControl(part);
                    //page.sections[0].columns[0].addControl(part);
                }

                let saved = await page.save(true);

                await sp.web.getFileByServerRelativePath(this._getOriginPageFilePath(aniversariante.WorkEmail))
                    .moveTo(this._getDestinationPageFilePath(aniversariante.WorkEmail));

                resolve(this._loadPage(aniversariante));
            }catch(e){
                reject(e);
            }
        });
    }

    public get () : Promise<IAniversariante[]>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return  this._getListData();
        }
    }

    public async getLocalidades() : Promise<IItem[]>{
        return new Promise<any>(async (resolve, reject) => {
            let localidades = await sp.web.lists.getByTitle('Localidade').items.select("Title", "ID").orderBy("Title").get<IItem>();
            resolve(localidades);
        });
    }

    private _getMockListData(): Promise<IAniversariante[]> {
        return MockHttpClient.get()
          .then((data: IAniversariante[]) => {

            var listData: IAniversariante[] = data;
            return listData;

          }) as Promise<IAniversariante[]>;
      }

      private async _getActions(aniversariante : IAniversariante){
        return new Promise<any>(async (resolve, reject) => {
            let path = this._getDestinationPageFilePath(aniversariante.UserName);
            let file = sp.web.getFileByServerRelativeUrl(path);

            let fileExists = await file.exists();

            if(fileExists){
                resolve(this._loadPage(aniversariante));
            }
            
        });
      }

      

      public async getAniversariantesInfo(aniversariantes : IAniversariante[]){
        return new Promise<any>(async (resolve, reject) => {

                this.currentUser = await sp.web.currentUser.get();

                this.partDefs = await sp.web.getClientsideWebParts();
                
                this.partDef = this.partDefs.filter(c => c.Id === "7f718435-ee4d-431c-bdbf-9c4ff326f46e");
           
                let promisesMethods:any = [];

                aniversariantes.map((aniversariante) => {
                    promisesMethods.push(this._getActions(aniversariante));
                });

                await Promise.all(promisesMethods)
                    .then((value : IAniversariante[]) =>{

                        let result = _(aniversariantes).concat(value).groupBy('UserName').map(_.spread(_.assign)).value();

                        resolve(result);

                    });

                

        });
      }

      


      private async _getListData(): Promise<IAniversariante[]> {

        return new Promise<any>(async (resolve, reject) => {

            let aniversariantes : IAniversariante[] = [];

            let query: string, inicio1: string, fim1: string, inicio2: string, fim2: string, sunday: string, saturday : string;
            let format : string = "2000-MM-DD";

            if( moment().day(0).year() < moment().day(6).year()){
                inicio1 = moment().day(0).format(format);
                fim1 = moment().endOf('year').format(format);
                
                query += inicio1 + ".." + fim1 + " AND ";
            
                inicio2 = moment().startOf('year').format(format);
                fim2 = moment().day(6).format(format);
                
                query += inicio2 + ".." + fim2;

            }else{
                sunday = moment().day(0).format(format);
                saturday = moment().day(6).format(format);
                
                query = sunday + ".." + saturday;
            }

            const results2: SearchResults = await sp.search(<ISearchQuery>{
                Querytext: `RefinableDate00=${query} AND AccountName:*cibra*`,
                RowLimit: 100,
                SourceId: 'b09a7990-05ea-4af9-81ef-edfab16c4e31',
                SelectProperties : [
                    'Department',
                    'Title',
                    'AccountName',
                    'Path',
                    'WorkEmail',
                    'OfficeNumber',
                    'PreferredName',
                    'RefinableDate00',
                    'LastModifiedTime',
                    'UserName',
                    'UserProfile_GUID',
                    'SipAddress',
                    'SPS-UserType',
                    'businessPhones', 
                    'displayName', 'givenName', 
                    'id', 
                    'JobTitle', 
                    'mail', 
                    'mobilePhone', 
                    'officeLocation', 
                    'preferredLanguage', 
                    'surname', 
                    'userPrincipalName',
                    'WorkPhone'
                ],
                ClientType: 'CSOM'
            });


            aniversariantes = results2.PrimarySearchResults.map<IAniversariante>((result) =>{

                return {
                    AccountName : result["AccountName"],
                    Department : result["Department"],
                    OfficeNumber : result["OfficeNumber"],
                    Path: result["Path"],
                    Birthday: result["RefinableDate00"],
                    Title: result["Title"],
                    UserName : result["UserName"],
                    WorkEmail: result["WorkEmail"],
                    PictureURL: `${this.url}/_vti_bin/DelveApi.ashx/people/profileimage?size=M&userId=${result["WorkEmail"]}`,
                    PreferredName: result["PreferredName"],
                    WorkPhone: result["WorkPhone"],
                    JobTitle: result["JobTitle"],
                };

            }).sort((a,b) => (moment(a.Birthday) > moment(b.Birthday)) ? 1 : ((moment(b.Birthday) > moment(a.Birthday)) ? -1 : 0));


            resolve(aniversariantes);

        });

      }

}