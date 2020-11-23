import * as React from 'react';
import styles from './ReactCalendario.module.scss';
import { IReactCalendarioProps } from './IReactCalendarioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { ActivityItem, DefaultButton, Dropdown, IDropdownOption, Label, Link, Stack } from 'office-ui-fabric-react';
import * as moment from 'moment';
import { IEvent, IFilter } from '../interfaces/IEvent';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles,
  IDocumentCardActivityPerson,
} from 'office-ui-fabric-react/lib/DocumentCard';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";

import { Calendar, DateLocalizer, momentLocalizer, NavigateAction, stringOrDate, View } from 'react-big-calendar';

import { Navigation } from 'spfx-navigation';
import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react/lib/Tooltip';
import { useId } from '@uifabric/react-hooks';

export interface IEventCalendar{
    id: number;
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;  
    cor?: string;
    categoria?: any;
    description?: string;
    category?: string;
    localidade?: any;
    bannerUrl?: any;
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
          cor: event.Categoria.Cor,
          categoria: event.Categoria,
          description: event.Description,
          category: event.Category,
          localidade: event.Localidade,
          bannerUrl: event.BannerUrl
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

  private _getEventUrl(id){
    return `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/Event.aspx?ListGuid=${this.listId}&ItemId=${id}`;
  }

  private _onSelectEvent(event: Object, e: React.SyntheticEvent){
    Navigation.navigate(this._getEventUrl((event as any).id)) ;
  }


  private _eventStyleGetter(event, start, end, isSelected) {
      var backgroundColor = event.cor;

      console.log(event);

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

  private DocumentCardImageExample(event : IEventCalendar){
    const cardStyles: IDocumentCardStyles = {
      //root: { display: 'inline-block', margin: 'auto',  marginLeft: 20, marginRight: 20, marginBottom: 20, width: 320, border: '0 none transparent' },
      root: { display: 'inline-block', margin: 'auto', width: 320, border: '0 none transparent' },
    };

    let start = moment(event.start).format('LLLL');
    let end = moment(event.end).format('LLLL');
  
    return (
      <div>

        <DocumentCard
          aria-label={
            event.title + ', ' + start + ', ' + end
          }
          styles={cardStyles}
          onClickHref={this._getEventUrl(event.id)}
        >
          <DocumentCardImage height={150} imageFit={ImageFit.cover} imageSrc={event.bannerUrl.Url} />
          <DocumentCardDetails>
            <DocumentCardTitle title={event.title} shouldTruncate />
            
            <Stack tokens={{ childrenGap: 10 }}>
              {event.description && <ActivityItem activityDescription={event.description}></ActivityItem>}
              <ActivityItem activityDescription={'De: ' + start}></ActivityItem>
              <ActivityItem activityDescription={'Até: ' + end}></ActivityItem>
              {/* {event.description && <Label>{event.description}</Label>}
              <Label>De: {start}</Label>
              <Label>Até: {end}</Label> */}
            </Stack>
            
          </DocumentCardDetails>
        </DocumentCard>        
      </div>
    );
  }

  private Event = ({ event }) => {
    const tooltipId = useId('tooltip');
    const stylesTooltip: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
    const calloutProps = { gapSpace: 0 };

    return (
        <TooltipHost
          content={ this.DocumentCardImageExample(event) }
          closeDelay={500}
          id={tooltipId}
          calloutProps={calloutProps}
          styles={stylesTooltip}
          
        >

        <span aria-describedby={tooltipId}>
          <strong>
          {event.title}
          </strong>
          { event.description && (':  ' + event.description)}
        </span>
        </TooltipHost>
    );
  }
  
  private EventAgenda = ({ event }) => {
    return <span>
      <em>{event.title}</em>
      <p>{ event.description }</p>
    </span>;
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
                    components={{
                      event: this.Event,
                      agenda: {
                        event: this.EventAgenda
                      }
                    }}
                  />

            </Stack>

            
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
