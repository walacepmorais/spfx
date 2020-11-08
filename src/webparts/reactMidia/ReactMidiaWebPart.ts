import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactMidiaWebPartStrings';
import ReactMidia from './components/ReactMidia';
import { IReactMidiaProps } from './components/IReactMidiaProps';
import MidiaService from './service/MidiaService';
import { sp } from '@pnp/sp';

export interface IReactMidiaWebPartProps {
  description: string;
  title: string;
}

export default class ReactMidiaWebPart extends BaseClientSideWebPart<IReactMidiaWebPartProps> {

  private service : MidiaService;

  public render(): void {

    const element: React.ReactElement<IReactMidiaProps> = React.createElement(
      ReactMidia,
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

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {

      sp.setup({
        spfxContext: this.context
      });

      this.service = new MidiaService(this.context.pageContext.web.absoluteUrl);

    });
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
