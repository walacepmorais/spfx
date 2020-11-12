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
import { ActionButton, BaseButton, Button, DocumentCardActions, IIconProps, TextField } from 'office-ui-fabric-react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import Loader from 'react-loader-spinner';


export interface IReactAniversarianteState{ 
   page: IAniversariante[];
   unidades: string[];
   currentPage : number;
   totalPages : number;
   limiter : number;
   localidades: IDropdownOption[];
   isLinking?: boolean;
   userName?: string;
}



export default class ReactAniversariante extends React.Component<IReactAniversarianteProps, IReactAniversarianteState> {


  private currentPage : number;
  private totalPages : number;
  private limiter : number;
  private aniversariantes : IAniversariante[];
  private filteredAniversariantes : IAniversariante[];

  private likeIcon: IIconProps = { iconName: 'Like' }; 
  private commentIcon: IIconProps = { iconName: 'Comment' }; 
  private likedIcon: IIconProps = { iconName: 'LikeSolid' }; 
  private commentedIcon: IIconProps = { iconName: 'CommentSolid' }; 

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

 private _getAniversariantesInfo(){
  var reactHandler = this;
  this.props.service
  .getAniversariantesInfo(this.aniversariantes)
  .then((aniversariantes) => {
    console.log(aniversariantes);
    this.filteredAniversariantes = aniversariantes;

    reactHandler.setState({
      page: this.filteredAniversariantes.slice(0, this.currentPage * this.limiter ) ,
      currentPage : this.currentPage,
      totalPages : this.totalPages,
      limiter : this.limiter
    });


  });
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
          .map<IAniversariante>((aniversariante) => {
            aniversariante.imageUrl = aniversariante.PictureURL;
            aniversariante.text= aniversariante.Title;
            aniversariante.secondaryText= aniversariante.OfficeNumber;
            aniversariante.tertiaryText= moment(aniversariante.Birthday).format("DD/MM");
            aniversariante.optionalText= aniversariante.Department;            
            return aniversariante;
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

        this._getAniversariantesInfo();

        

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


  private _like(userName : string) {
    var reactHandler = this;

    reactHandler.setState({
      isLinking: true,
      userName: userName
    });

    this.props.service.like(userName, userName)
    .then((result) => {

      let aniversariantes = this.state.page;
      let aniversariante = aniversariantes.filter((v) => { return v.UserName === userName; })[0];
      aniversariante.IsLiked = result.isLikedByUser;
      aniversariante.Likes = result.likeCount;

      reactHandler.setState({
        page: aniversariantes,
        isLinking: false,
        userName: ""
      });


    });

  }

  public render(): React.ReactElement<IReactAniversarianteProps> {
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 300 },
    };

    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;
    
    return (
      <div className={ styles.reactAniversariante } style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <WebPartTitle displayMode={this.props.displayMode}
              className={styles.font}
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              // moreLink={
              //   <Link className={styles.font} href={this.props.context.pageContext.web.absoluteUrl + "/_layouts/15/news.aspx?title=Aniversariantes&amp;newsSource=1"}>Ver todos</Link>
              // }
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

              {this.state.page.map((item: IAniversariante, _index: number) => {
                return <div className={styles.personaBox}>
                  <Persona
                    {...item}
                    size={PersonaSize.size48}
                    hidePersonaDetails={false}
                    imageAlt={item.text}
                    className={styles.font}
                  />
                  {item.InfoLoaded &&
                    <Stack horizontal>

                      {this.state.isLinking && this.state.userName === item.UserName
                      ?
                      <Loader type="Hearts" color={semanticColors.primaryButtonBackground} height={30} width={30} />
                      :
                      <ActionButton iconProps={item.IsLiked ? this.likedIcon : this.likeIcon} allowDisabledFocus title="Curtir" onClick={(event) => { this._like(item.UserName); }}>
                        Curtir ({item.Likes})
                      </ActionButton>
                      }

                      <ActionButton iconProps={item.IsCommented ? this.commentedIcon : this.commentIcon} allowDisabledFocus href={item.PageUrl} target="_blank" title="Comentar"> 
                        Comentar ({item.Comments})
                      </ActionButton>

                    </Stack>
                  }
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
