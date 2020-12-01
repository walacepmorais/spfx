import MockHttpClient from "../common/MockHttpClient";
import { IComunicado } from "../interfaces/IComunicado";

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

export default class ComunicadoService{

    private url : string;

    constructor(url: string) {
        this.url = url;
        
    }


    public get () : Promise<IComunicado[]>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){

            let promisesMethods:any = [];
            promisesMethods.push(this._getListData('SSO'));
            promisesMethods.push(this._getListData('Time Cibra'));
            //promisesMethods.push(this._getListData('Você Sabia'));

            return  Promise.all(promisesMethods);
        }
    }

    private _getMockListData(): Promise<IComunicado[]> {
        return MockHttpClient.get()
          .then((data: IComunicado[]) => {

            var listData: IComunicado[] = data;
            return listData;

          }) as Promise<IComunicado[]>;
      }


      private _getBanner(tipoComunicado : string):string{
            

            return this.url + "/siteassets/images/" + tipoComunicado + ".png";

      }

      private _getListData(tipoComunicado : string): Promise<IComunicado> {
        return sp.web.lists.getByTitle("Site Pages").items
        .select(
            "Id",
            "Title",
            "FileRef",
            "Categoria",
            "TipoComunicado",
            "BannerImageUrl",
            "Created",
            "Modified",
            "FieldValuesAsText/MetaInfo",
            "FirstPublishedDate")
        .expand("FieldValuesAsText")
        .filter("Categoria eq 'Comunicados' and TipoComunicado eq '"+ tipoComunicado +"'")
        .top(1)
        .orderBy("Modified", false)
        .get().then((data) => {

            return data.map<IComunicado>(item => ({
                
                Title: item.Title,
                BannerImageUrl: { Url: this._getBanner(tipoComunicado)},
                FirstPublishedDate:  item.FirstPublishedDate,
                FileRef: item.FileRef,
                Id: item.Id

            }))[0];

            
        });

      }
          
          


    

}