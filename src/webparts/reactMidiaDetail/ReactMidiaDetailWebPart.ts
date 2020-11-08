import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactMidiaDetailWebPartStrings';
import ReactMidiaDetail from './components/ReactMidiaDetail';
import { IReactMidiaDetailProps } from './components/IReactMidiaDetailProps';
import MidiaDetailService from './service/MidiaDetailService';
import { sp } from '@pnp/sp';

export interface IReactMidiaDetailWebPartProps {
  description: string;
  title: string;
}

export default class ReactMidiaDetailWebPart extends BaseClientSideWebPart<IReactMidiaDetailWebPartProps> {
  private service : MidiaDetailService;

  
  public render(): void {
    sp.setup({spfxContext: this.context});
    this.service = new MidiaDetailService(this.context, this.context.pageContext.web.absoluteUrl);
    


    const element: React.ReactElement<IReactMidiaDetailProps> = React.createElement(
      ReactMidiaDetail,
      {
        description: this.properties.description,
        service: this.service,
        context: this.context,
        title: this.properties.title,
        displayMode:this.displayMode,
        updateProperty: (value:string) => {
          this.properties.title=value;
        }
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
