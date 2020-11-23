import { SharePointCalendarService } from './../../shared/services/CalendarService/SharePointCalendarService/SharePointCalendarService';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Guid, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactEventosWebPartStrings';
import ReactEventos from './components/ReactEventos';
import { IReactEventosProps } from './components/IReactEventosProps';
import EventService from '../reactCalendario/service/EventService';

import { sp } from "@pnp/sp";

import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { CalendarEventRange, DateRange } from '../../shared/services/CalendarService';

import { PropertyFieldSliderWithCallout } from "@pnp/spfx-property-controls/lib/PropertyFieldSliderWithCallout";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";
import { CalloutTriggers } from "@pnp/spfx-property-controls/lib/PropertyFieldHeader";
import { ICategoriaEvento } from '../reactCalendario/interfaces/IEvent';


export interface IReactEventosWebPartProps {
  description: string;
  title: string;
  maxEvents: number;
  maxTotal: number;
  dateRange: DateRange;
  cacheDuration: number;
}

export default class ReactEventosWebPart extends BaseClientSideWebPart<IReactEventosWebPartProps> {

  private service : SharePointCalendarService;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  private eventService: EventService;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public onInit(): Promise<void> {

    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    let {
      cacheDuration,
      dateRange,
      maxTotal,
    } = this.properties;

    if (dateRange === undefined) {
      dateRange = DateRange.Month;
    }

    if (cacheDuration === undefined) {
      cacheDuration = 15;
    }

    if (maxTotal === undefined) {
      maxTotal = 0;
    }

    return super.onInit().then(async _ => {

      sp.setup({
        spfxContext: this.context
      });

      this.eventService = new EventService({
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
      });

      let listId : string = await this.eventService.getEventListId();
      let categorias : ICategoriaEvento[] = await this.eventService.getCategorias();

      this.service = new SharePointCalendarService({
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
        listName: "Events",
        listId: listId,
        categorias: categorias        
      });

    });
  }


  protected onAfterResize(newWidth: number): void {
    // redraw the web part
    this.render();
  }


  public render(): void {
    const { clientWidth } = this.domElement;

    const element: React.ReactElement<IReactEventosProps> = React.createElement(
      ReactEventos,
      {
        description: this.properties.description,
        service: this.service,
        eventService : this.eventService,
        context: this.context,
        title: this.properties.title,
        displayMode:this.displayMode,
        updateProperty: (value:string) => {
          this.properties.title=value;
        },
        themeVariant: this._themeVariant,
        clientWidth: clientWidth,
        maxEvents: this.properties.maxEvents,
        eventRange : new CalendarEventRange(this.properties.dateRange)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const {
      maxEvents,
      cacheDuration,
      maxTotal,
    } = this.properties;

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown("dateRange", {
                  label: strings.DateRangeFieldLabel,
                  options: [
                    { key: DateRange.OneWeek, text: strings.DateRangeOptionWeek },
                    { key: DateRange.TwoWeeks, text: strings.DateRangeOptionTwoWeeks },
                    { key: DateRange.Month, text: strings.DateRangeOptionMonth },
                    { key: DateRange.Quarter, text: strings.DateRangeOptionQuarter },
                    { key: DateRange.Year, text: strings.DateRangeOptionUpcoming },
                  ]
                }),
                PropertyFieldSliderWithCallout("cacheDuration", {
                  calloutContent: React.createElement("div", {}, strings.CacheDurationFieldCallout),
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 200,
                  key: "cacheDurationFieldId",
                  label: strings.CacheDurationFieldLabel,
                  max: 1440,
                  min: 0,
                  step: 15,
                  showValue: true,
                  value: cacheDuration
                }),
                PropertyFieldNumber("maxEvents", {
                  key: "maxEventsFieldId",
                  label: strings.MaxEventsFieldLabel,
                  description: strings.MaxEventsFieldDescription,
                  value: maxEvents,
                  minValue: 0,
                  disabled: false
                }),
                PropertyFieldNumber("maxTotal", {
                  key: "maxTotalFieldId",
                  label: strings.MaxTotalFieldLabel,
                  description: strings.MaxTotalFieldDescription,
                  value: maxTotal,
                  minValue: 0,
                  disabled: false
                })
              ]
            }
           
          ]
        }
      ]
    };
  }
}
