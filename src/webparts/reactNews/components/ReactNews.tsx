import * as React from 'react';
import styles from './ReactNews.module.scss';
import { IReactNewsProps } from './IReactNewsProps';
import * as moment from 'moment';
import { INew, INewsResult, IItem } from '../interfaces/INews';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { TestImages } from '@uifabric/example-data';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardDetails,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardLocation,
  DocumentCardType,
  DocumentCardImage,
  IDocumentCardActivityPerson
} from 'office-ui-fabric-react/lib/DocumentCard';

import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ActionButton, DefaultButton, IIconProps, ISize, IStackStyles, PrimaryButton, Stack } from 'office-ui-fabric-react';
import NewsService from '../service/NewsService';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


export interface INewsState{
  news: INew[];
  categorias: IDropdownOption[];
  tiposComunicado: IDropdownOption[];

  currentPage : number;
  totalPages : number;
  pageSize : number;
  totatRows : number;

  hasNext : boolean;
  hasPrevious : boolean;

}

export default class ReactNews extends React.Component<IReactNewsProps, INewsState> {


  private currentPage : number;
  private service: NewsService;

  constructor(props: IReactNewsProps) {
    super(props);
    moment.locale(this.props.context.pageContext.cultureInfo.currentCultureName);

    this.currentPage = 1;
    this.service = this.props.service;

    let result = this._getPageInit(this.currentPage);
    
    this.state ={
      news: result.news,
      currentPage : this.currentPage,
      totalPages : result.totalPages,
      pageSize : result.pageSize,
      totatRows : result.totalRows,
      hasNext : false,
      hasPrevious : true,
      categorias: [],
      tiposComunicado: []
    };

  }

  private _getItems(){
    var reactHandler = this;
    this.service.get()
    .then((result) => {
      reactHandler.setState({
        news: result.news,
        currentPage : result.currentPage,
        totalPages : result.totalPages,
        pageSize : result.pageSize,
        hasNext : result.hasNext,
        hasPrevious : result.hasPrevious
      });
    });
  }

  public componentDidMount(){
    var reactHandler = this;

    this._getItems();

    this.service.getCategorias()
      .then((categorias) => {
        

        let options : IDropdownOption[] = [
          {
            key: 0,
            text :""
          }
        ];
        
        options = options.concat(categorias.map((c) => {
          return {
            key : c.Id,
            text: c.Title
          };
        }));

        reactHandler.setState({
          categorias : options
        });

      });


  }


  private _getTiposComunicado(event, option, index){

    var reactHandler = this;

    this.service.getTiposComunicado(option.key)
      .then((tipos) => {
        
        let options : IDropdownOption[] = [];

        if(tipos.length > 0){
          options.push({
              key: 0,
              text :""
            });
          
          options = options.concat(tipos.map((c) => {
            return {
              key : c.Id,
              text: c.Title
            };
          }));
        }

          reactHandler.setState({
            tiposComunicado : options
          });
        

      });

  }

  private _goToPage(page: number): void {
    var reactHandler = this;

    this._getPage(page)
    .then((result) => {
      reactHandler.setState({
        news: result.news,
        currentPage : page,
        totalPages : result.totalPages,
        pageSize : result.pageSize
      });
    });

    

  }

  private _getPageInit(page: number):INewsResult {

    return this.service.getPageExample(page);
 
  }

  private _getPage(page: number): Promise<INewsResult> {

   return this.service.getPage(page);

  }

  private _getNext(){
    var reactHandler = this;

    this.service.getNext()
    .then((result) => {
      reactHandler.setState({
        news: result.news,
        currentPage : result.currentPage,
        totalPages : result.totalPages,
        pageSize : result.pageSize,
        hasNext : result.hasNext,
        hasPrevious : result.hasPrevious
      });
    });
  }

  private _getPrevious(){
    var reactHandler = this;

    this.service.getPrevious()
    .then((result) => {
      reactHandler.setState({
        news: result.news,
        currentPage : result.currentPage,
        totalPages : result.totalPages,
        pageSize : result.pageSize,
        hasNext : result.hasNext,
        hasPrevious : result.hasPrevious
      });
    });
  }

  private _renderItem = (item: INew, finalSize: ISize, isCompact: boolean): JSX.Element => {
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: item.BannerImageUrl ? item.BannerImageUrl.Url : "" ,
          imageFit: ImageFit.cover,
          width: 154,
          height: 140
        }
      ]
    };

    
    return <div
      data-is-focusable={true}
      role="listitem"
      aria-label={item.Title}
      key={item.DocId}
    >
      <DocumentCard
        type={DocumentCardType.compact}        
        onClickHref={item.Path}
        className={styles.column12}
      >
        {item.BannerImageUrl &&

          <DocumentCardPreview previewImages={[previewProps.previewImages[0]]} />
        }

        <DocumentCardDetails>
          <DocumentCardTitle title={item.Title}  />
          <DocumentCardTitle title={item.Description} shouldTruncate showAsSecondaryTitle/>
          <DocumentCardTitle title={"Publicado em " + moment(item.FirstPublishedDate).format('LL')} showAsSecondaryTitle/>
          {/* <DocumentCardTitle title={`${item.ViewsLifeTime} visualizações`} shouldTruncate showAsSecondaryTitle/> */}
          
        </DocumentCardDetails>

      </DocumentCard>
    </div>;

    
  }

  

  public render(): React.ReactElement<IReactNewsProps> {

    const nextIcon: IIconProps = { iconName: 'ChevronRightSmall' };
    const previousIcon: IIconProps = { iconName: 'ChevronLeftSmall' };
    const filterIcon: IIconProps = { iconName: 'Filter' };
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 300 },
    };
    const stackTokens = { childrenGap: 50 };
    const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };

    return (
      <div className={ styles.reactNews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
          <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              
              />


            <Stack horizontal tokens={stackTokens} styles={stackStyles}>
              <Dropdown

                  placeholder="Selecione uma categoria"
                  label="Categorias"
                  options={this.state.categorias}
                  styles={dropdownStyles}
                  onChange={(event, option, index) => { this._getTiposComunicado(event, option, index); }}
                />
                {this.state.tiposComunicado.length > 0 &&
                  <Dropdown
                      placeholder="Selecione um tipo"
                      label="Tipos"
                      options={this.state.tiposComunicado}
                      styles={dropdownStyles}
                    />
                }
              
            </Stack>
            <br></br>

            <Stack horizontal tokens={stackTokens} styles={stackStyles}>
              <PrimaryButton
                  text="Filtrar"
                  iconProps={filterIcon}
                  onClick={() => { this._getItems(); }}
                />

            </Stack>
                         
            <br></br>

              <Stack 
                tokens={{ childrenGap: 20 }}
                >
                {this.state.news.map((item: INew, _index: number) => {
                  return this._renderItem(item, null,true);
                })}
              </Stack>
              
              <br></br>

              {/* <DefaultButton text="<<" onClick={() => { this._getPrevious(); }}  disabled={!this.state.hasPrevious}/>

              <DefaultButton text=">>" onClick={() => {this._getNext(); }}  disabled={!this.state.hasNext} />

              <br></br> */}

              <div className={styles.center}>

              <ActionButton iconProps={previousIcon} allowDisabledFocus  onClick={() => { this._getPrevious(); }} disabled={!this.state.hasPrevious} >
              Anterior
              </ActionButton>

              <ActionButton iconProps={nextIcon} allowDisabledFocus onClick={() => {this._getNext(); }} disabled={!this.state.hasNext} 
              styles={{flexContainer: {
                flexDirection: 'row-reverse'
              }}}>
                Próximo
              </ActionButton>

              </div>

              
            
          </div>
        </div>
      </div>
    );
  }
}
