import { IComunicado } from "../interfaces/IComunicado";
import * as moment from 'moment';

export default class MockHttpClient  {

    private static _destaques : IComunicado[] = [
      {
        FileRef: 'https://en.wikipedia.org/wiki/Colosseum',
        Title: 'Colosseum 1',            
        BannerImageUrl: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Id: 1,
        FirstPublishedDate: moment.now.toString()

      },
      {
        FileRef: 'https://en.wikipedia.org/wiki/Colosseum',
        Title: 'Colosseum 2',            
        BannerImageUrl: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Id: 2,
        FirstPublishedDate: moment.now.toString()
      },
      {
        FileRef: 'https://en.wikipedia.org/wiki/Colosseum',
        Title: 'Colosseum 3',            
        BannerImageUrl: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Id: 3,
        FirstPublishedDate: moment.now.toString()
      }
    ];

    public static get(): Promise<IComunicado[]> {
        return new Promise<IComunicado[]>((resolve) => {
                resolve(MockHttpClient._destaques);
            });
        }

}