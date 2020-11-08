import MockHttpClient from "../common/MockHttpClient";
import { IDestaque, IDestaques } from "../interfaces/IDestaque";
import {
    SPHttpClient,
    SPHttpClientResponse
  } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import {
    Environment,
    EnvironmentType
  } from '@microsoft/sp-core-library';

export default class CarrosselService{
   
    private context: WebPartContext;

    constructor(context: WebPartContext) {
        this.context = context;
    }
    
    public get () : Promise<IDestaque[]>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return this._getListData();
        }
    }

    private _getMockListData(): Promise<IDestaque[]> {
        return MockHttpClient.get()
          .then((data: IDestaque[]) => {

            var listData: IDestaque[] = data;
            return listData;

          }) as Promise<IDestaque[]>;
      }


      private _getListData(): Promise<IDestaque[]> {
        return this.context.spHttpClient.get(
            this.context.pageContext.web.absoluteUrl + "/_api/web/lists/getbytitle('Destaques')/items?$select=Id,Title,Texto,Url,Ordem,LinkFilename,FileRef", 
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            }
            )

          .then((response: SPHttpClientResponse) => {

                return response.json().then((r) => { return r.value; });

            //return response.json();
            
          });
      }

}