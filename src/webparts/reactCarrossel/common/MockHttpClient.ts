import { IDestaque } from "../interfaces/IDestaque";


export default class MockHttpClient  {

    private static _destaques : IDestaque[] = [
        {
            FileRef: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80',
            Title: 'Colosseum 1',
            Texto: 'This is Colosseum 1',
            Url: { Url: 'https://en.wikipedia.org/wiki/Colosseum'},
            Ordem: 1,
            Id: 1
          },
          {
            FileRef: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80',
            Title: 'Colosseum 2',
            Texto: 'This is Colosseum 2',
            Url: { Url: 'https://en.wikipedia.org/wiki/Colosseum'},
            Ordem: 2,
            Id: 2
          },
          {
            FileRef: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80',
            Title: 'Colosseum 3',
            Texto: 'This is Colosseum 3',
            Url: { Url: 'https://en.wikipedia.org/wiki/Colosseum'},
            Ordem: 3,
            Id: 3
          }
    ];

    public static get(): Promise<IDestaque[]> {
        return new Promise<IDestaque[]>((resolve) => {
                resolve(MockHttpClient._destaques);
            });
        }

}