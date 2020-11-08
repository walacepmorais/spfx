import { IMidiaDetail, IUrl } from './../interfaces/IMidiaDetail';
import MockHttpClient from "../common/MockHttpClient";

import {
    Environment,
    EnvironmentType
  } from '@microsoft/sp-core-library';

import { sp, SPRest } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files/folder";
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { MSGraphClient ,AadHttpClient} from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ThemeGenerator } from 'office-ui-fabric-react';


export default class MidiaService{


    private url : string;
    private context: WebPartContext;
    private pathTest :string = '/sites/cibrafertil.sharepoint.com,2fcca2fc-1c56-46f9-89e2-0a046f5ee799,a5295137-5a4a-4547-9c7c-4dc07cd18f30/lists/c1a69db2-c85e-4523-9978-c09c411b5ee1/items/3/driveItem/thumbnails/0/medium';

    constructor(context: WebPartContext, url: string) {
        this.url = url;
        this.context = context;        
    }

    public get (serverRelativeUrl : string) : Promise<IMidiaDetail[]>{


        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return this._getMidias(serverRelativeUrl);
        }
    }

    public getExampleData(): IMidiaDetail[]{
        return MockHttpClient.getExample();
    }

    private _getMockListData(): Promise<IMidiaDetail[]> {
        return MockHttpClient.get()
          .then((data: IMidiaDetail[]) => {

            var listData: IMidiaDetail[] = data;
            return listData;

          }) as Promise<IMidiaDetail[]>;
      }

      private _getGraphByPath(id : string, path : string){

        return new Promise<any>(async (resolve, reject) => {
            try{
                this.context.msGraphClientFactory
                .getClient()
                .then((client)=>{
                    client.api(path).version("v1.0")                
                        .get((error, response: any, rawResponse?: any) => {
                            console.log("response", response);
                            let url = response.url;
                            resolve({
                                Id: id, 
                                Thumbnail: url
                            });

                            // let result : any = {};
                            // result[`${id}`] = url;
                            // console.log(result);
                            // resolve(result);

                            
                            
                        });
                });
            }catch (error) {  
                reject(error);  
            }  
        });
      }

      
      private async _getPath(){
        let webId = this.context.pageContext.web.id;
        let siteId = this.context.pageContext.site.id;
        let hostname = new URL(this.context.pageContext.site.absoluteUrl).hostname;

        const list = sp.web.lists.getByTitle("Galerias");
        const listId = await list.select("Id")();
        let path = `/sites/${hostname},${siteId},${webId}/lists/${listId.Id}/items/{{id}}/driveItem/thumbnails/0/large`;

        return path;
      }

      private async _getThumbByMidias(midias : IMidiaDetail[], path : string) : Promise<any>{
        return new Promise<any>(async (resolve, reject) => {

            let thumbs:any = [];

            midias.map(async (midia) => {
                let replacedPath = path.replace('{{id}}', midia.Id);
                thumbs.push(this._getGraphByPath(midia.Id, replacedPath));
            });

            const result = await Promise.all(thumbs);

            resolve(result);

        });

      }

      

      private async _getMidias(serverRelativeUrl : string) : Promise<IMidiaDetail[]>{

        let result : IMidiaDetail[] = [];
        let path = await this._getPath();

        return this._getListData(serverRelativeUrl)
            .then(async (midias) => {
                console.log("midias", midias);
                result = midias;

                const thumbs = await this._getThumbByMidias(midias, path);
                return thumbs;
                
            }).then((thumbs) => {
                console.log("thumbs", thumbs);       
                const a3 = result.map(t1 => ({...t1, ...thumbs.find(t2 => t2.Id === t1.Id)}));

                return a3;
            });
 
      }

      private  _getListData(serverRelativeUrl : string): Promise<IMidiaDetail[]> {
        let path = unescape( serverRelativeUrl);
        //console.log("path", path);

        return sp.web.getFileByServerRelativePath(path).getItem("Galeria").then((data) => {

            let galeria : IUrl = data['Galeria'];
            return galeria;

        }).then(async (folderGaleria: IUrl) => { 

            let pathGaleria = decodeURIComponent( folderGaleria.Url.replace(this.url + "/", ""));
            console.log("pathGaleria", pathGaleria);
            console.log("folderGaleria", folderGaleria);

            return sp.web
                .getFolderByServerRelativePath(pathGaleria)
                .files
                .select('*,listItemAllFields')
                .expand('listItemAllFields')          
                .get()
                .then((files) => {
                    
                    console.log("files", files);

                    return files.map<IMidiaDetail>(file => ({
                    
                        Title: file.Title,
                        Created:file.TimeCreated,
                        Exists: file.Exists,
                        UniqueId: file.UniqueId,
                        Length: file.Length,
                        Modified: file.TimeLastModified,
                        Name : file.Name,
                        ServerRelativeUrl: file.ServerRelativeUrl,
                        TimeCreated: file.TimeCreated,
                        TimeLastModified: file.TimeLastModified,
                        Id: file["ListItemAllFields"]["Id"]
                    }));
                }) as Promise<IMidiaDetail[]>;
        }) as Promise<IMidiaDetail[]>;
        

        

      }
}

