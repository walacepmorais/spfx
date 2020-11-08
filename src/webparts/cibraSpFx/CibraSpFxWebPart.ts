import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CibraSpFxWebPartStrings';
import CibraSpFx from './components/CibraSpFx';
import { ICibraSpFxProps } from './components/ICibraSpFxProps';

export interface ICibraSpFxWebPartProps {
  description: string;
}

export default class CibraSpFxWebPart extends BaseClientSideWebPart<ICibraSpFxWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICibraSpFxProps> = React.createElement(
      CibraSpFx,
      {
        description: this.properties.description
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
