import { IMidia } from './../interfaces/IMidia';
import * as moment from 'moment';

export default class MockHttpClient  {

    private static _midias : IMidia[] = [
      {
        FileRef: 'https://en.wikipedia.org/wiki/Colosseum',
        Title: 'Colosseum 1',            
        BannerImageUrl: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Galeria: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Id: 1,
        FirstPublishedDate: moment.now.toString(),
        Count: 10,
        Midia: "Imagens"

      },
      {
        FileRef: 'https://en.wikipedia.org/wiki/Colosseum',
        Title: 'Colosseum 2',            
        BannerImageUrl: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Galeria: { Url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'},
        Id: 2,
        FirstPublishedDate: moment.now.toString(),
        Count: 1,
        Midia: "Vídeos"
      }
    ];

    public static get(): Promise<IMidia[]> {
        return new Promise<IMidia[]>((resolve) => {
                resolve(MockHttpClient._midias);
            });
        }

}