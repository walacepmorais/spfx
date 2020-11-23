import * as React from 'react';
import styles from './ReactMidia.module.scss';
import rootStyles from '../../../styles/base.module.scss';
import { IReactMidiaProps } from './IReactMidiaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { GridLayout } from '@pnp/spfx-controls-react/lib/GridLayout';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { 
  DocumentCard, 
  DocumentCardDetails, 
  DocumentCardPreview, 
  DocumentCardTitle, 
  DocumentCardType, 
  IDocumentCardPreviewProps, 
  ImageFit, 
  ISize,
  DocumentCardImage, 
  IDocumentCardStyles, Link, DocumentCardActions, DocumentCardActivity, DocumentCardLocation } from 'office-ui-fabric-react';
import { IMidia } from '../interfaces/IMidia';
import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { TestImages } from '@uifabric/example-data';
import { FilmstripLayout } from '../../filmstripLayout/FilmstripLayout';
import { DefaultEffects } from '@fluentui/react';


export interface IReactMidiaState{ 
  items: IMidia[];
}

export default class ReactMidia extends React.Component<IReactMidiaProps, IReactMidiaState> {


  constructor(props: IReactMidiaProps) {
    super(props);
    moment.locale('pt-br');


    this.state = { 
      items : [
        {
          BannerImageUrl : { Description : "", Url : ""},
          FileRef : "",
          Id : 0,
          Title: "",
          FirstPublishedDate: moment.now.toString(),
          Count: 0,
          Midia: ""
        },
        {
          BannerImageUrl : { Description : "", Url : ""},
          FileRef : "",
          Id : 0,
          Title: "",
          FirstPublishedDate: moment.now.toString(),
          Count: 0,
          Midia: ""
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

  private _onRenderGridItem = (item: IMidia, finalSize: ISize, isCompact: boolean): JSX.Element => {
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: item.BannerImageUrl ? item.BannerImageUrl.Url : "",
          imageFit: ImageFit.cover,
          height: 130
        }
      ]
    };

    return <div
      data-is-focusable={true}
      role="listitem"
      aria-label={item.Title}
    >
      <DocumentCard
        type={DocumentCardType.normal}        
        onClickHref={item.FileRef}
        style={{ boxShadow: DefaultEffects.elevation4 }}
        className={rootStyles.content}
        >
        <DocumentCardImage height={150} imageFit={ImageFit.cover} imageSrc={item.BannerImageUrl.Url} />

          <DocumentCardTitle
            title={item.Title}
            shouldTruncate={true}
          />   

          <DocumentCardTitle
            title={"Publicado em " + moment(item.FirstPublishedDate).format('LL')}  
            showAsSecondaryTitle={true}
            shouldTruncate={true}
          />  

          <DocumentCardTitle
            title={item.Count + " " + item.Midia.toLowerCase()}  
            showAsSecondaryTitle={true}
            shouldTruncate={true}
          />         
          
        </DocumentCard>
    </div>;



  }

  

  public render(): React.ReactElement<IReactMidiaProps> {
    
    
    return (
      <div className={ styles.reactMidia }>
        <div className={ styles.container }>

         
        <div className={ styles.row }>
          <div className={ styles.column12 }>
            <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              className={rootStyles.title}
              moreLink={
                <Link className={rootStyles.content} href={this.props.context.pageContext.web.serverRelativeUrl + "/SitePages/Publicações.aspx?categoria=Galeria"}>Ver todos</Link>
              }
              />
          </div>
        </div>

        <div className={ styles.row }>

              {this.state.items.map((item: IMidia, _index: number) => {
                const previewProps: IDocumentCardPreviewProps = {
                  previewImages: [
                    {
                      previewImageSrc: item.BannerImageUrl.Url,
                      imageFit: ImageFit.cover,
                      height: 154
                    }
                  ]
                };

                return <div className={ styles.column6 }><div
                    className={styles.documentTile}
                    data-is-focusable={true}
                    role="listitem"
                    aria-label={item.Title}
                  >
                    <DocumentCard
                      className={rootStyles.content}
                      type={DocumentCardType.normal}
                      onClickHref={item.FileRef}>

                      <DocumentCardPreview {...previewProps} />                      
                      <DocumentCardDetails>
                        <DocumentCardTitle
                        className={rootStyles.content}
                          title={item.Title}
                          shouldTruncate={true}
                        />
                        <DocumentCardTitle
                        
                          title={"Publicado em " + moment(item.FirstPublishedDate).format('LL') }  
                          showAsSecondaryTitle={true}
                          shouldTruncate={false}
                          className={styles.titleDataPublicacao}
                        />  
                        <DocumentCardTitle
                          title={item.Count + " " + item.Midia.toLowerCase()}  
                          showAsSecondaryTitle={false}
                          shouldTruncate={true}   
                          className={rootStyles.content}                        
                        />   
                        
                      </DocumentCardDetails>
                    </DocumentCard>
                  </div>
                  </div>;

              })}


        </div>

        </div>
      </div>
    );
  }
}
