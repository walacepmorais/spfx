import * as React from 'react';
import styles from './ReactComunicados.module.scss';
import { IReactComunicadosProps } from './IReactComunicadosProps';

import { GridLayout } from "@pnp/spfx-controls-react/lib/GridLayout";
import { IComunicado } from '../interfaces/IComunicado';

import * as moment from 'moment';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardDetails,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardLocation,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';

import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ISize } from 'office-ui-fabric-react/lib/Utilities';
import { DefaultEffects, isRelativeUrl, Link } from '@fluentui/react';

import {WebPartTitle} from "@pnp/spfx-controls-react/lib/WebPartTitle";

export interface IReactComunicadosState{ 
  items: IComunicado[];
}


export default class ReactComunicados extends React.Component<IReactComunicadosProps, IReactComunicadosState> {


  constructor(props: IReactComunicadosProps) {
    super(props);
    moment.locale(this.props.context.pageContext.cultureInfo.currentUICultureName);


    this.state = { 
      items : [
        {
          BannerImageUrl : { Description : "", Url : ""},
          FileRef : "",
          Id : 0,
          Title: "",
          FirstPublishedDate: moment.now.toString()
        }
      ]
    };
  }

  public componentDidMount(){
    

    var reactHandler = this;  
    this.props.service.get()
        .then((data) => {
    
        reactHandler.setState({
          items: data
        });

      });
  }


  private _onRenderGridItem = (item: IComunicado, finalSize: ISize, isCompact: boolean): JSX.Element => {
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: item.BannerImageUrl ? item.BannerImageUrl.Url : "",
          imageFit: ImageFit.cover,
          height: 154
        }
      ]
    };

    return <div
      data-is-focusable={true}
      role="listitem"
      aria-label={item.Title}
    >
      <DocumentCard
        type={isCompact ? DocumentCardType.compact : DocumentCardType.normal}        
        onClickHref={item.FileRef}
        style={{ boxShadow: DefaultEffects.elevation4 }}
        className={styles.font}
      >
        <DocumentCardPreview {...previewProps} />

        <DocumentCardDetails>
          <DocumentCardTitle
            title={item.Title}
            shouldTruncate={true}
            className={styles.font}
          />   
          <DocumentCardTitle
          className={styles.font}
            title={"Publicado em " + moment(item.FirstPublishedDate).format('LL')}  
            showAsSecondaryTitle={true}
            shouldTruncate={true}
          />         
          
        </DocumentCardDetails>

        
      </DocumentCard>
    </div>;
  }

  public render(): JSX.Element {
    

    
    return (
      <div className={ styles.reactComunicados }>
        <div className={ styles.container }>

        <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              className={styles.font}
              moreLink={
                <Link className={styles.font} href={this.props.context.pageContext.web.absoluteUrl + "/SitePages/Publicações.aspx?categoria=Comunicados"}>Ver todos</Link>
              }/>
              

        <GridLayout
            ariaLabel="Comunicados"
            items={this.state.items}
            onRenderGridItem={(item: any, finalSize: ISize, isCompact: boolean) => this._onRenderGridItem(item, finalSize, isCompact)}
          />

        </div>
      </div>
    );
  }
}
