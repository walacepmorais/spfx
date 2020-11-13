import { IEvent } from "../interfaces/IEvent";
import * as moment from 'moment';
import { TestImages } from '@uifabric/example-data';

export default class MockHttpClient  {

    private static _events : IEvent[] = [
    ];

    public static get(): Promise<IEvent[]> {
        return new Promise<IEvent[]>((resolve) => {
                resolve(MockHttpClient._events);
            });
        }

}