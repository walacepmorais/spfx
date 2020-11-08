
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactCarrosselWebPartStrings';
import ReactCarrossel from './components/ReactCarrossel';
import { IReactCarrosselProps } from './components/IReactCarrosselProps';

import CarrosselService from './service/CarrosselService';
import { IDestaque } from './interfaces/IDestaque';

export interface IReactCarrosselWebPartProps {
  description: string;
}

export default class ReactCarrosselWebPart extends BaseClientSideWebPart<IReactCarrosselWebPartProps> {

  private service : CarrosselService;

  public render(): void {
    this.service = new CarrosselService(this.context);
      const element: React.ReactElement<IReactCarrosselProps> = React.createElement(
        ReactCarrossel,
        {
          description: this.properties.description,
          service: this.service
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
