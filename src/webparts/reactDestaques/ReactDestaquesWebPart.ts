import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactDestaquesWebPartStrings';
import ReactDestaques from './components/ReactDestaques';
import { IReactDestaquesProps } from './components/IReactDestaquesProps';

export interface IReactDestaquesWebPartProps {
  description: string;
}

export default class ReactDestaquesWebPart extends BaseClientSideWebPart<IReactDestaquesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactDestaquesProps> = React.createElement(
      ReactDestaques,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
