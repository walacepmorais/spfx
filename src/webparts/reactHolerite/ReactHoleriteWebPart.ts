import { MSGraphClient } from '@microsoft/sp-http';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactHoleriteWebPartStrings';
import ReactHolerite from './components/ReactHolerite';
import { IReactHoleriteProps } from './components/IReactHoleriteProps';

export interface IReactHoleriteWebPartProps {
  description: string;
  title: string;
  logoUrl: string;
}

import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';

export default class ReactHoleriteWebPart extends BaseClientSideWebPart<IReactHoleriteWebPartProps> {
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  private graphClient: MSGraphClient;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public onInit(): Promise<void> {

    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient): void => {
          this.graphClient = client;
          resolve();
        }, err => reject(err));
    });
    
  }

  public render(): void {
    const element: React.ReactElement<IReactHoleriteProps> = React.createElement(
      ReactHolerite,
      {
        description: this.properties.description,
        logoUrl: this.properties.logoUrl,
        title: this.properties.title,
        displayMode:this.displayMode,
        updateProperty: (value:string) => {
          this.properties.title=value;
        },
        themeVariant: this._themeVariant,
        context: this.context,
        graphClient: this.graphClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('logoUrl', {
                  label: strings.LogoUrlFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
