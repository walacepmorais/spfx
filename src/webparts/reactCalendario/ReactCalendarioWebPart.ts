import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactCalendarioWebPartStrings';
import ReactCalendario from './components/ReactCalendario';
import { IReactCalendarioProps } from './components/IReactCalendarioProps';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import EventService from './service/EventService';

import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { DateRange } from '../../shared/services/CalendarService';

export interface IReactCalendarioWebPartProps {
  description: string;
  title: string;
  maxEvents: number;
  maxTotal: number;
  dateRange: DateRange;
  cacheDuration: number;
}

export default class ReactCalendarioWebPart extends BaseClientSideWebPart<IReactCalendarioWebPartProps> {

  private service : EventService;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public onInit(): Promise<void> {

    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return super.onInit().then(_ => {

      sp.setup({
        spfxContext: this.context
      });


      this.service = new EventService({
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl
      });

    });
  }


  public render(): void {
    const element: React.ReactElement<IReactCalendarioProps> = React.createElement(
      ReactCalendario,
      {
        description: this.properties.description,
        service: this.service,
        context: this.context,
        title: this.properties.title,
        displayMode:this.displayMode,
        updateProperty: (value:string) => {
          this.properties.title=value;
        },
        themeVariant: this._themeVariant
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
