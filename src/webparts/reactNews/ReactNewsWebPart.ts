import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactNewsWebPartStrings';
import ReactNews from './components/ReactNews';
import { IReactNewsProps } from './components/IReactNewsProps';
import { sp } from '@pnp/sp';
import NewsService from './service/NewsService';

export interface IReactNewsWebPartProps {
  description: string;
  title: string;
  pageSize : string;
}

export default class ReactNewsWebPart extends BaseClientSideWebPart<IReactNewsWebPartProps> {

  private service : NewsService;

  public render(): void {
    const element: React.ReactElement<IReactNewsProps> = React.createElement(
      ReactNews,
      {
        description: this.properties.description,
        service: this.service,
        context: this.context,
        title: this.properties.title,
        displayMode:this.displayMode,
        updateProperty: (value:string) => {
          this.properties.title=value;
        },
        pageSize: this._getPageSizeProperty()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getPageSizeProperty() : number{
    return this.properties.pageSize === ""  || this.properties.pageSize === undefined ? 5 : parseInt(escape(this.properties.pageSize));
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  public onInit(): Promise<void> {

    let params = (new URL(document.location.href)).searchParams;
    this.properties.title=params.get('categoria') != null ? params.get('categoria') : "Publicações";

    return super.onInit().then(_ => {

      sp.setup({
        spfxContext: this.context
      });

      this.service = new NewsService({
        pageSize : this._getPageSizeProperty(),
        siteId: this.context.pageContext.site.id,
        webId: this.context.pageContext.web.id,
      });

    });
  }

  private validaPageSize(value: number): string {
    if (value === 0 || isNaN(value))  {
      return 'Provide a page size';
    }

    return '';
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
                PropertyPaneTextField('pageSize', {
                  label: strings.PageSizeFieldLabel,
                  onGetErrorMessage: this.validaPageSize.bind(this),
                  

                })
              ]
            }
          ]
        }
      ]
    };
  }
}
