declare interface ICalendarServicesStrings {
  SharePointProviderName: string;
  MockProviderName: string;
}

declare module 'CalendarServicesStrings' {
  const strings: ICalendarServicesStrings;
  export = strings;
}
