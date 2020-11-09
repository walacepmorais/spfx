import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactAniversarianteWebPartStrings';
import ReactAniversariante from './components/ReactAniversariante';
import { IReactAniversarianteProps } from './components/IReactAniversarianteProps';

import { sp } from "@pnp/sp";
import AniversarianteService from './service/AniversarianteService';

import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';

export interface IReactAniversarianteWebPartProps {
  description: string;
  title: string;
}

export default class ReactAniversarianteWebPart extends BaseClientSideWebPart<IReactAniversarianteWebPartProps> {

  private service : AniversarianteService;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    console.log("_handleThemeChangedEvent", this._themeVariant);

    this.render();
  }

  public onInit(): Promise<void> {

    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return super.onInit().then(_ => {

      sp.setup({
        spfxContext: this.context
      });

      this.service = new AniversarianteService(this.context.pageContext.web.absoluteUrl);

    });
  }

  public render(): void {
    const element: React.ReactElement<IReactAniversarianteProps> = React.createElement(
      ReactAniversariante,
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
