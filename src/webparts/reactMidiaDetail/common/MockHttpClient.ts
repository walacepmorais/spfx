import { IMidiaDetail } from './../interfaces/IMidiaDetail';


export default class MockHttpClient  {


    public static getExample(): IMidiaDetail[] {
        let _midias : Array<IMidiaDetail> = [];

        for (let i = 1; i < 10; i++) {
            _midias.push({
                Title: 'Colosseum ' + i,                    
                Id: `${i}`,
                Name: 'Colosseum ' + i,
                ServerRelativeUrl: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80',                                
              });
        }

        return _midias;
    }

    public static get(): Promise<IMidiaDetail[]> {

        return new Promise<IMidiaDetail[]>((resolve) => {
                resolve(this.getExample());
            });
        }

}