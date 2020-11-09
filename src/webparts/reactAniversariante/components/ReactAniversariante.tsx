import * as React from 'react';
import styles from './ReactAniversariante.module.scss';
import { IReactAniversarianteProps } from './IReactAniversarianteProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAniversariante } from '../interfaces/IAniversariante';
import * as moment from 'moment';

import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { TestImages } from '@uifabric/example-data';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { DefaultEffects, Link } from '@fluentui/react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react';

export interface IReactAniversarianteState{ 
  page: IPersonaSharedProps[];
  unidades: string[];
   currentPage : number;
   totalPages : number;
   limiter : number;
   localidades: IDropdownOption[];
}

export default class ReactAniversariante extends React.Component<IReactAniversarianteProps, IReactAniversarianteState> {


  private currentPage : number;
  private totalPages : number;
  private limiter : number;
  private aniversariantes : IPersonaSharedProps[];
  private filteredAniversariantes : IPersonaSharedProps[];

  constructor(props: IReactAniversarianteProps) {
    super(props);
    moment.locale(this.props.context.pageContext.cultureInfo.currentUICultureName);
    this.currentPage = 1;
    this.totalPages = 1;
    this.limiter = 5;
    this.aniversariantes = [];
    this.filteredAniversariantes = [];

    this.state = { 
      page : [
        {
          imageUrl: TestImages.personaFemale,
          imageInitials: 'AL',
          text: 'Annie Lindqvist',
          secondaryText: 'Software Engineer',
          tertiaryText: 'In a meeting',
          optionalText: 'Available at 4:00pm',
        },
        {
          imageUrl: TestImages.personaFemale,
          imageInitials: 'AL',
          text: 'Annie Lindqvist',
          secondaryText: 'Software Engineer',
          tertiaryText: 'In a meeting',
          optionalText: 'Available at 4:00pm',
        }
      ],
      unidades : [],
      currentPage : this.currentPage,
      totalPages : this.totalPages,
      limiter : this.limiter,
      localidades: []
    };

    

  }

  public componentDidMount(){

    var reactHandler = this;

    this.props.service.getLocalidades()
      .then((localidades) => {

        let options : IDropdownOption[] = [
          {
            key: 0,
            text : "Todas as Unidades"
          }
        ];
        
        options = options.concat(localidades.map((c) => {
          return {
            key : c.Id,
            text: c.Title
          };
        }));

       
        reactHandler.setState({
          localidades : options
        });

      });

    this.props.service.get()
        .then((data) => {
          
        console.log(data);
        this.aniversariantes = data            
          .map<IPersonaSharedProps>((aniversariante) => {
          return {
            imageUrl: aniversariante.PictureURL,
            text: aniversariante.Title,
            secondaryText: aniversariante.OfficeNumber,
            tertiaryText: moment(aniversariante.Birthday).format("DD/MM"),
            optionalText: aniversariante.Department,
          };
        });

        this.filteredAniversariantes = this.aniversariantes;

        this.totalPages = Math.ceil(this.filteredAniversariantes.length / this.limiter);
        this.currentPage = 1;

        reactHandler.setState({
          page: this.filteredAniversariantes.slice(0, this.currentPage * this.limiter ) ,
          currentPage : this.currentPage,
          totalPages : this.totalPages,
          limiter : this.limiter
        });

      });
  }

  private _getPage(page: number): void {

    var reactHandler = this;

    this.currentPage = page;
    console.log(page);

    let start = (this.currentPage -1) * this.limiter;
    let end = start + this.limiter;
    console.log(start, end);

    let slice = this.filteredAniversariantes.slice(start, end);    
    this.totalPages = Math.ceil(this.filteredAniversariantes.length / this.limiter);

    reactHandler.setState({
      page: slice,
      currentPage : this.currentPage,
      totalPages : this.totalPages,
      limiter : this.limiter
    });

  }


  private _onLocalidadeChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {

    if(option.key == 0){
      this.filteredAniversariantes = this.aniversariantes;
    }else{
      this.filteredAniversariantes = this.aniversariantes.filter((value ) => {
          return value.secondaryText == option.text;
        });
    }

    this._getPage(1);
  }

  public render(): React.ReactElement<IReactAniversarianteProps> {
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 300 },
    };

    return (
      <div className={ styles.reactAniversariante }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <WebPartTitle displayMode={this.props.displayMode}
              className={styles.font}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              moreLink={
                <Link className={styles.font} href={this.props.context.pageContext.web.absoluteUrl + "/_layouts/15/news.aspx?title=Aniversariantes&amp;newsSource=1"}>Ver todos</Link>
              }
              />

              
            <Stack tokens={{ childrenGap: 10 }}>

            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <Label className={styles.font}>{moment().format('DD/MM/YYYY')}</Label>
              <Dropdown
                  placeholder="Selecione uma Unidade"                  
                  options={this.state.localidades}
                  onChange={(event, option, index) => { this._onLocalidadeChanged(event, option, index); }}
                  className={styles.font}
                />

            </Stack>

            

              {this.state.page.map((item: IPersonaSharedProps, _index: number) => {
                return <div className={styles.personaBox}>
                  <Persona
                    {...item}
                    size={PersonaSize.size72}
                    hidePersonaDetails={false}
                    imageAlt={item.text}
                    className={styles.font}
                  />
                  </div>;
              })}

            </Stack>

            <Pagination
              currentPage={this.state.currentPage}
              totalPages={this.state.totalPages} 
              onChange={(page) => this._getPage(page)}
              limiter={this.state.limiter} // Optional - default value 3
              hideFirstPageJump // Optional
              hideLastPageJump // Optional
              limiterIcon={"Emoji12"} // Optional
            />



            </div>
          </div>
        </div>
      </div>
    );
  }
  

  
}
