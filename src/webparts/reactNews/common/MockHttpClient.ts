import { INew, INewsResult } from './../interfaces/INews';


export default class MockHttpClient  {


    public static page = 1;
    public static totalRows: number;
    public static pageSize : number = 5;
    public static totalPages : number;
    public static news : INew[] = [];

    public static getExample(): INew[] {

        for (let i = 1; i < 100; i++) {
            this.news.push({
                Title: 'News ' + i,                    
                Id: i,
                PictureThumbnailURL: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3078&q=80'
              });
        }

        return this.news;
    }

    public static get(): Promise<INewsResult> {
        this.getExample();
        return this.getPage(1);
    }


    public static getPageExample(page: number): INewsResult {
        if(this.news.length == 0) this.getExample();
        this.page = page;
            console.log(page);
        
            let start = (this.page -1) * this.pageSize;
            let end = start + this.pageSize;
            console.log(start, end);

            let slice = this.news.slice(start, end);

            let listData: INewsResult = {
                news : slice,
                totalRows : this.news.length,
                pageSize : this.pageSize,
                currentPage : page,
                totalPages : Math.ceil(this.news.length / this.pageSize),
                hasNext : true,
                hasPrevious : this.page > 1
            };
        return listData;

    }

    public static getPage(page: number): Promise<INewsResult> {
        return new Promise<INewsResult>(async (resolve, reject) => {
            let listData: INewsResult = this.getPageExample(page);
            resolve(listData);
        });
    }

}