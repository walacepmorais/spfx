import { IMidia } from './../interfaces/IMidia';
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

export default class MidiaService{

    private url : string;

    constructor(url: string) {
        this.url = url;
        
    }


    public get () : Promise<IMidia[]>{


        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){

            return Promise.all([this._getListData('Imagens'), this._getListData('Vídeos')]);

        }
        
    }


    private _getMockListData(): Promise<IMidia[]> {
        return MockHttpClient.get()
          .then((data: IMidia[]) => {

            var listData: IMidia[] = data;
            return listData;

          }) as Promise<IMidia[]>;
      }


      private  _getListData(tipoMidia : string): Promise<IMidia> {

        return sp.web.lists.getByTitle("Site Pages").items
            .select(
                "Id",
                "Title",
                "FileRef",
                "Categoria/Id",
                "Categoria/Title",                
                "BannerImageUrl",
                "Created",
                "Modified",                
                "Midia",
                "FirstPublishedDate",
                "Galeria")
            .expand("Categoria")
            .filter("Categoria/Title eq 'Galeria' and Midia eq '"+ tipoMidia +"'")
            .top(1)
            .orderBy("FirstPublishedDate", false)
            .get().then((data) => {

                return data.map<IMidia>(item => ({
                    
                    Title: item.Title,
                    BannerImageUrl: item.BannerImageUrl,
                    FirstPublishedDate:  item.FirstPublishedDate,
                    FileRef: item.FileRef,
                    Id: item.Id,
                    Midia: tipoMidia,
                    Galeria: item.Galeria

                }))[0];


            }).then(async (midia: IMidia) => {                    

                    let path = midia.Galeria != null ? unescape( midia.Galeria.Url.replace(this.url + "/", "")) : "";
                    console.log(midia.Galeria.Url, path);

                    return sp.web
                        .getFolderByServerRelativePath(path)
                        .files()                        
                        .then((files) => {
                            console.log(files);
                            
                            midia.Count = files.length;
                            console.log(midia);

                            return midia;

                            }) as Promise<IMidia>;


                }) as Promise<IMidia>;

   }

}