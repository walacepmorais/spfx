import * as React from 'react';
import styles from './ReactNews.module.scss';
import '../../../styles/base.module.scss';
import { IReactNewsProps } from './IReactNewsProps';
import * as moment from 'moment';
import { INew, INewsResult, IItem, IFilter } from '../interfaces/INews';
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
import { ActionButton, Checkbox, DefaultButton, IIconProps, ISize, IStackStyles, Label, PrimaryButton, Stack } from 'office-ui-fabric-react';
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

  showMidiaFilter: boolean;

  filters? :IFilter;

  specificSearch?: boolean;
}

export default class ReactNews extends React.Component<IReactNewsProps, INewsState> {


  private currentPage : number;
  private service: NewsService;

  constructor(props: IReactNewsProps) {
    super(props);
    moment.locale('pt-br');

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
      tiposComunicado: [],
      showMidiaFilter: false,
      filters: {}
    };

  }

  private _getItems(filter?: IFilter){
    var reactHandler = this;
    this.service.get(filter)
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

    let params = (new URL(document.location.href)).searchParams;

    let filters : IFilter = {
      categoria : params.get('categoria'),
      tipoComunicado : params.get('tipocomunicado'),
      hasImagem : params.get('imagem') != null && params.get('imagem') == 'true' ? true : null,
      hasVideo : params.get('video') != null && params.get('video') == 'true' ? true : null
    };

    let specificSearch : boolean = filters.categoria != null || filters.tipoComunicado != null || filters.hasImagem != null || filters.hasVideo != null;

    reactHandler.setState({
      specificSearch : specificSearch
    });

    console.log(filters);

    this._getItems(filters);

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

  private _filter(){
    console.log(this.state.filters);
    this._getItems(this.state.filters);
  }

  private _changeVideoMidia(event: React.ChangeEvent<HTMLInputElement>) {
    let filters = this.state.filters;
    filters.hasVideo = event.target.checked;
    this.setState({
      filters : filters
    });
  }
  private _changeImagemMidia(event: React.ChangeEvent<HTMLInputElement>) {
    let filters = this.state.filters;
    filters.hasImagem = event.target.checked;
    this.setState({
      filters : filters
    });
  }

  private _onTipoComunicadoChanged(event, option, index){
    var reactHandler = this;

    let filters = this.state.filters;
    filters.tipoComunicado = option.text;

    reactHandler.setState({
      filters: filters
    });

  }

  private _onCategoriaChanged(event, option, index){

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
          tiposComunicado : options,
          showMidiaFilter : option.text == "Galeria",
          filters: {
            categoria : option.text
          }            
        });
        

      });

  }

  private _getPageInit(page: number):INewsResult {

    return this.service.getPageExample(page);
 
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
        onClickHref={item.FileRef}
        className={styles.column12}
      >
        {item.BannerImageUrl &&

          <DocumentCardPreview previewImages={[previewProps.previewImages[0]]} />
        }

        <DocumentCardDetails>
          <DocumentCardTitle title={item.Title}  className="content"/>
          <DocumentCardTitle title={item.Description} shouldTruncate showAsSecondaryTitle className="content"/>
          <DocumentCardTitle title={"Publicado em " + moment(item.FirstPublishedDate).format('LL')} showAsSecondaryTitle className="content"/>
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
    const stackTokensVertical = { childrenGap: 10 };
    const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
    const stackTokensCheckbox = { childrenGap: 10 };

    return (
      <div className={ styles.reactNews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
          <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              className="title"
              
              />

            {!this.state.specificSearch &&
              <Stack tokens={stackTokensVertical} >
                <Stack horizontal tokens={stackTokens} className="content">
                  <Dropdown
                      placeholder="Selecione uma categoria"
                      label="Categorias"
                      options={this.state.categorias}
                      styles={dropdownStyles}
                      className="content"
                      onChange={(event, option, index) => { this._onCategoriaChanged(event, option, index); }}
                    />
                    
                    {this.state.tiposComunicado.length > 0 &&
                      <Dropdown
                          placeholder="Selecione um tipo"
                          label="Tipos"
                          options={this.state.tiposComunicado}
                          styles={dropdownStyles}
                          className="content"
                          onChange={(event, option, index) => { this._onTipoComunicadoChanged(event, option, index); }}
                        />
                    }

                    {this.state.showMidiaFilter &&
                      <Stack tokens={stackTokensCheckbox}>
                        <Label className="content">Mídias</Label>
                        <Checkbox label="Imagem" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this._changeImagemMidia(event);}} className="content"/>
                        <Checkbox label="Vídeo" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this._changeVideoMidia(event);}}  className="content"/>
                      </Stack>

                    }
                  
                </Stack>

                <Stack horizontal tokens={stackTokensVertical} className="content">
                  <PrimaryButton
                  className="content"
                      text="Filtrar"
                      iconProps={filterIcon}
                      onClick={() => { this._filter(); }}
                    />
    
                </Stack>
              </Stack>

            }

            
                         
            <br></br>

              <Stack className="content"
                tokens={{ childrenGap: 20 }}
                >
                {this.state.news.map((item: INew, _index: number) => {
                  return this._renderItem(item, null,true);
                })}
              </Stack>
              
              <br></br>


              <div className={styles.center}>

              <ActionButton className="content" iconProps={previousIcon} allowDisabledFocus  onClick={() => { this._getPrevious(); }} disabled={!this.state.hasPrevious} >
              Anterior
              </ActionButton>

              <ActionButton className="content" iconProps={nextIcon} allowDisabledFocus onClick={() => {this._getNext(); }} disabled={!this.state.hasNext} 
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
