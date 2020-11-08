import { IAniversariante } from './../interfaces/IAniversariante';
import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import MockHttpClient from '../common/MockHttpClient';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as moment from 'moment';



export default class AniversarianteService{

    
    private url : string;

    constructor(url: string) {        
        this.url = url;
        
    }

    public get () : Promise<IAniversariante[]>{
        if (Environment.type === EnvironmentType.Local) {
            return this._getMockListData();
        } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint){
            return  this._getListData( );
        }
    }


    private _getMockListData(): Promise<IAniversariante[]> {
        return MockHttpClient.get()
          .then((data: IAniversariante[]) => {

            var listData: IAniversariante[] = data;
            return listData;

          }) as Promise<IAniversariante[]>;
      }


      private async _getListData(): Promise<IAniversariante[]> {

        let aniversariantes : IAniversariante[] = [];

        let date = moment().day(0).date();

        let query, inicio1, fim1, inicio2, fim2, sunday,saturday : string;
        let format : string = "2000-MM-DD";

        if( moment().day(0).year() < moment().day(6).year()){
            inicio1 = moment().day(0).format(format);
            fim1 = moment().endOf('year').format(format);
            
            query += inicio1 + ".." + fim1 + " AND ";
		
            inicio2 = moment().startOf('year').format(format);
            fim2 = moment().day(6).format(format);
            
            query += inicio2 + ".." + fim2;

            console.log(query);

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
                'SPS-UserType'
            ],
            ClientType: 'CSOM'
        });

        console.log(results2.PrimarySearchResults);

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
                PreferredName: result["PreferredName"]
            };

        });


        return Promise.resolve(aniversariantes);

      }

}