import { IAniversariante } from "../interfaces/IAniversariante";
import * as moment from 'moment';
import { TestImages } from '@uifabric/example-data';

export default class MockHttpClient  {

    private static _destaques : IAniversariante[] = [
      {
        Title: 'Kat Larrson',            
        Name: 'Kat Larrson',            
        Id: 1,
        PictureURL: TestImages.personaFemale,

      },
      {
        Title: 'Annie Lindqvist',            
        Name: 'Annie Lindqvist',            
        Id: 2,
        PictureURL: TestImages.personaFemale,
      },
      {
        Title: 'Ted Randall',            
        Name: 'Ted Randall',            
        Id: 3,
        PictureURL: TestImages.personaMale,
      }
    ];

    public static get(): Promise<IAniversariante[]> {
        return new Promise<IAniversariante[]>((resolve) => {
                resolve(MockHttpClient._destaques);
            });
        }

}