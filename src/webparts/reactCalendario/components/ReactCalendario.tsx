import * as React from 'react';
import styles from './ReactCalendario.module.scss';
import { IReactCalendarioProps } from './IReactCalendarioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { Dropdown, IDropdownOption, Label, Link, Stack } from 'office-ui-fabric-react';
import * as moment from 'moment';
import { IEvent, IFilter } from '../interfaces/IEvent';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";

import { Calendar, DateLocalizer, momentLocalizer, NavigateAction, stringOrDate, View } from 'react-big-calendar';

import { Navigation } from 'spfx-navigation';

export interface IEventCalendar{
    id: number;
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;  
    cor?: string;
}

export interface IReactCalendarioState{
  events: IEventCalendar[];
  redirect: string;
  localidades: IDropdownOption[];

}

export default class ReactCalendario extends React.Component<IReactCalendarioProps, IReactCalendarioState> {
  private localizer: DateLocalizer;
  private allViews: any[];
  private localidade: string;
  private listId : string;
  private eventDate: Date;
  private endDate: Date;

  constructor(props: IReactCalendarioProps) {
    super(props);
    //moment.locale(this.props.context.pageContext.cultureInfo.currentUICultureName);
    moment.locale('pt-br');

    this.localizer = momentLocalizer(moment);

    this.state = { 
      events: [],
      redirect: "",
      localidades: []
    };

    this.props.service.getEventListId().then((id) =>{
      this.listId = id;
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

    sp.profiles.myProperties.get().then((currentUser) => {
      this.localidade = currentUser.UserProfileProperties.find(item => item.Key === "Office").Value;

      this.eventDate =  moment().startOf('month').toDate();
        this.endDate = moment().endOf('month').toDate();

      let filter : IFilter = {
        localidade: this.localidade,
        eventDate: this.eventDate,
        endDate: this.endDate,
      };

      this._filter(filter);

    });
           
  }


  private _filter(filter : IFilter){
    var reactHandler = this;

    this.props.service.get(filter).then((events) => {
      let eventsCalendar : IEventCalendar[] = events.map((event) => {        
        return {
          id: event.Id,
          title: event.Title,
          start: event.EventDate,
          end: event.EndDate,
          cor: event.Categoria.cor
        };
      });

      reactHandler.setState({
        events: eventsCalendar
      });
    });
  }

  private _onRangeChange(range: Date[] | { start: stringOrDate; end: stringOrDate }, view: View | undefined){

    this.eventDate =  moment((range as any).start).toDate();
    this.endDate = moment((range as any).end).toDate();

    let filter : IFilter = {
      localidade: this.localidade,
      eventDate: this.eventDate,
      endDate: this.endDate,
    };

    this._filter(filter);
  }

  
  private _onSelectEvent(event: Object, e: React.SyntheticEvent){
    Navigation.navigate(`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/Event.aspx?ListGuid=${this.listId}&ItemId=${(event as any).id}`);
  }


  private _eventStyleGetter(event, start, end, isSelected) {
      var backgroundColor = event.cor;
      var style = {
          backgroundColor: backgroundColor,
          borderRadius: '0px',
          opacity: 0.8,
          color: 'white',
          'font-weight': 'bold',
          border: '0px',
          display: 'block'
      };
      return {
          style: style
      };
  }

  private _onLocalidadeChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {

    this.localidade = option.key == 0 ? "" : option.text;

    let filter : IFilter = {
      localidade: this.localidade,
      eventDate: this.eventDate,
      endDate: this.endDate,
    };

   this._filter(filter);

  }

  public render(): React.ReactElement<IReactCalendarioProps> {

    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;


    return (
      <div className={ styles.reactCalendario } style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>

            <WebPartTitle displayMode={this.props.displayMode}
              className={styles.font}
              title={this.props.title}
              updateProperty={this.props.updateProperty}                
              />

            <Stack tokens={{ childrenGap: 20 }}>

              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <Label className={styles.font}>{moment().format('DD/MM/YYYY')}</Label>
                <Dropdown
                    placeholder="Selecione uma Unidade"                  
                    options={this.state.localidades}
                    onChange={(event, option, index) => { this._onLocalidadeChanged(event, option, index); }}
                    className={styles.font}
                  />

              </Stack>
            
              <Calendar
                    localizer={this.localizer}
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={["month"]}
                    onRangeChange={(range,view ) => this._onRangeChange(range,view )}
                    onSelectEvent={(event,e ) => this._onSelectEvent(event,e )}
                    eventPropGetter={(this._eventStyleGetter)}
                  />

            </Stack>

            
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
