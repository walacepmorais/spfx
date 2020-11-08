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
import { Link } from 'office-ui-fabric-react';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { Items } from '@pnp/sp/items';
import { DefaultEffects } from '@fluentui/react';

export interface IReactAniversarianteState{ 
  page: IPersonaSharedProps[];
  unidades: string[];
   currentPage : number;
   totalPages : number;
   limiter : number;
}

export default class ReactAniversariante extends React.Component<IReactAniversarianteProps, IReactAniversarianteState> {


  private currentPage : number;
  private totalPages : number;
  private limiter : number;
  private aniversariantes : IPersonaSharedProps[];

  constructor(props: IReactAniversarianteProps) {
    super(props);
    moment.locale(this.props.context.pageContext.cultureInfo.currentUICultureName);
    this.currentPage = 1;
    this.totalPages = 1;
    this.limiter = 5;
    this.aniversariantes = [];

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
      limiter : this.limiter
    };

    

  }

  public componentDidMount(){

    var reactHandler = this;

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

        this.totalPages = Math.ceil(this.aniversariantes.length / this.limiter);
        this.currentPage = 1;

        reactHandler.setState({
          page: this.aniversariantes.slice(0, this.currentPage * this.limiter ) ,
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
    let slice = this.aniversariantes.slice(start, end);

    reactHandler.setState({
      page: slice,
      currentPage : this.currentPage,
      totalPages : this.totalPages,
      limiter : this.limiter
    });

  }

  public render(): React.ReactElement<IReactAniversarianteProps> {
    return (
      <div className={ styles.reactAniversariante }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              moreLink={
                <Link href={this.props.context.pageContext.web.absoluteUrl + "/_layouts/15/news.aspx?title=Aniversariantes&amp;newsSource=1"}>Ver todos</Link>
              }
              />
              
            <Stack tokens={{ childrenGap: 10 }}>

              {this.state.page.map((item: IPersonaSharedProps, _index: number) => {
                return <Persona
                  {...item}
                  size={PersonaSize.size72}
                  hidePersonaDetails={false}
                  imageAlt={item.text}
                  style={{ boxShadow: DefaultEffects.elevation4 }}
                />;
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
