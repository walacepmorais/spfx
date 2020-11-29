import * as React from 'react';
import styles from './ReactEventos.module.scss';
import '../../../styles/base.module.scss';

import { IReactEventosProps } from './IReactEventosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IEvent } from '../../reactCalendario/interfaces/IEvent';
import * as moment from 'moment';
import { ActivityItem, css, Dropdown, FocusZone, FocusZoneDirection, IDropdownOption,  Label, Link, List, Spinner, Stack } from 'office-ui-fabric-react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';

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
import CompactLayout from '../../compactLayout/CompactLayout';
import { ICalendarEvent } from '../../../shared/services/CalendarService';
import { IFeedCache } from './RectEventos.types';
import { IFilter } from '../../../shared/services/CalendarService/IFilter';
import { DisplayMode } from '@microsoft/sp-core-library';
import * as strings from 'ReactEventosWebPartStrings';
import { EventCard } from '../../../shared/components/EventCard';
import { Pagination } from '../../../shared/components/Pagination';
import { FilmstripLayout } from '../../../shared/components/filmstripLayout';

export interface IReactEventosState{
  events: ICalendarEvent[];
  localidades: IDropdownOption[];
  error: any|undefined;
  isLoading: boolean;
  currentPage: number;
}

const CacheKey: string = "reactEventos";
const MaxMobileWidth: number = 480;

export default class ReactEventos extends React.Component<IReactEventosProps, IReactEventosState> {
  private listId: string;
  private localidade: string;
  
  constructor(props: IReactEventosProps) {
    super(props);
    moment.locale('pt-br');

    this.state = { 
      events: [],
      localidades: [],
      isLoading: false,
      error: undefined,
      currentPage: 1
    };

    this.props.eventService.getEventListId().then((id) =>{
      this.listId = id;
    });

  }

  private _getEventUrl(id){
    return `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/Event.aspx?ListGuid=${this.listId}&ItemId=${id}`;
  }

  public componentDidMount(){

    var reactHandler = this;

    this.props.eventService.getLocalidades()
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
  
  
        let filter : IFilter = {
          localidade: this.localidade,
          eventRange: this.props.eventRange
        };
  
        this._filter(filter);
  
      });

  }

  private _filter(filter : IFilter){
    var reactHandler = this;

    this.props.service.getEvents({
      localidade: filter.localidade,
      eventRange: this.props.eventRange
    }).then((events) => {
      reactHandler.setState({
        events: events
      });
    });
  }

  private _onLocalidadeChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {

    this.localidade = option.key == 0 ? "" : option.text;

    let filter : IFilter = {
      localidade: this.localidade,
      eventRange: this.props.eventRange
    };

   this._filter(filter);

  }

  private _onRenderGridItem = (item: ICalendarEvent, _index: number): JSX.Element => {


    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: item.bannerImageUrl ? item.bannerImageUrl.Url : "",
          imageFit: ImageFit.centerCover,
          height: 48,
          width: 48
        }
      ]
    };

    let start = moment(item.start).format('DD/MM/YYYY HH:mm');
    let end = moment(item.end).format('DD/MM/YYYY HH:mm');
    let day = moment(item.start).format('ddd');

    return <div className={styles.documentTile} data-is-focusable={true} role="listitem" aria-label={item.title}>
        <DocumentCard
        type={DocumentCardType.compact }
        onClickHref={this._getEventUrl(item.id)}
      >

        <DocumentCardPreview {...previewProps} />
        <DocumentCardDetails>
          <DocumentCardTitle title={item.title} shouldTruncate={true} />
          <ActivityItem activityDescription={day + ' ' + start + ' - ' + end}></ActivityItem>
        </DocumentCardDetails>

      </DocumentCard>
    </div>;
  }

 

  public render(): React.ReactElement<IReactEventosProps> {
    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;
    console.log(semanticColors);

    return (
      <div className={css(styles.calendarFeedSummary, styles.webPartChrome)} style={{ backgroundColor: semanticColors.bodyBackground }}>
        <div className={css(styles.webPartHeader, styles.headerSmMargin)}>

            <WebPartTitle 
              displayMode={this.props.displayMode}              
              title={this.props.title}
              updateProperty={this.props.updateProperty}   
              className="title"
              moreLink={
                <Link className="content" href={this.props.context.pageContext.web.absoluteUrl + "/SitePages/Eventos.aspx"}>Ver todos</Link>
              }             
              />
        </div>

        <div className={css(styles.content, "content")}>

            <Stack tokens={{ childrenGap: 20 }}>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <Label className="content">{moment().format('DD/MM/YYYY')}</Label>
                <Dropdown
                    placeholder="Selecione uma Unidade"                  
                    options={this.state.localidades}
                    onChange={(event, option, index) => { this._onLocalidadeChanged(event, option, index); }}
                    className="content"
                  />
              </Stack>

              {/* <Stack tokens={{ childrenGap: 20 }}>
                {this.state.events.map((item: ICalendarEvent, _index: number) => {
                  return this._onRenderGridItem(item, _index);
                })}
              </Stack> */}

              {this._renderContent()}

            </Stack>
              
              
            </div>
          </div>        
    );
  }

 /**
   * Render your web part content
   */
  private _renderContent(): JSX.Element {
    const isNarrow: boolean = this.props.clientWidth < MaxMobileWidth;

    const {
      displayMode
    } = this.props;
    const {
      events,
      isLoading,
      error
    } = this.state;

    const isEditMode: boolean = displayMode === DisplayMode.Edit;
    const hasErrors: boolean = error !== undefined;
    const hasEvents: boolean = events.length > 0;

    if (isLoading) {
      // we're currently loading
      return (<div className={styles.spinner}><Spinner label={strings.Loading} /></div>);
    }

    if (hasErrors) {
      // we're done loading but got some errors
      if (!isEditMode) {
        // otherwise, just show a friendly message
        return (<div className={styles.errorMessage}>{strings.ErrorMessage}</div>);
      } else {
        // render a more advanced diagnostic of what went wrong
        return this._renderError();
      }
    }

    if (!hasEvents) {
      // we're done loading, no errors, but have no events
      return (<div className={styles.emptyMessage}>{strings.NoEventsMessage}</div>);
    }

    // we're loaded, no errors, and got some events
    if (isNarrow) {
      return this._renderNarrowList();
    } else {
      return this._renderNormalList();
    }
  }

  /**
   * Tries to make sense of the returned error messages and provides
   * (hopefully) helpful guidance on how to fix the issue.
   * It isn't the best piece of coding I've seen. I'm open to suggested improvements
   */
  private _renderError(): JSX.Element {
    const { error } = this.state;

    let errorMsg: string = strings.ErrorMessage;

    return (<div className={styles.errorMessage} >
      <div className={styles.moreDetails}>
        {errorMsg}
      </div>
    </div>);
  }

  /**
   * Renders a narrow view of the calendar feed when the webpart is less than 480 pixels
   */
  private _renderNarrowList(): JSX.Element {
    const {
      events,
      currentPage
    } = this.state;

    const { maxEvents } = this.props;

    // if we're in edit mode, let's not make the events clickable
    const isEditMode: boolean = this.props.displayMode === DisplayMode.Edit;

    let pagedEvents: ICalendarEvent[] = events;
    let usePaging: boolean = false;

    if (maxEvents > 0 && events.length > maxEvents) {
      // calculate the page size
      const pageStartAt: number = maxEvents * (currentPage - 1);
      const pageEndAt: number = (maxEvents * currentPage);

      pagedEvents = events.slice(pageStartAt, pageEndAt);
      usePaging = true;
    }

    return (<FocusZone
      direction={FocusZoneDirection.vertical}
      isCircularNavigation={false}
      data-automation-id={"narrow-list"}
      aria-label={isEditMode ? strings.FocusZoneAriaLabelEditMode : strings.FocusZoneAriaLabelReadMode}
    >
      <List
        items={pagedEvents}
        onRenderCell={(item, _index) => (
          <EventCard
            isEditMode={isEditMode}
            event={item}
            isNarrow={true}
            themeVariant={this.props.themeVariant}
          />
        )} />
      {usePaging &&
        <Pagination
          showPageNum={false}
          currentPage={currentPage}
          itemsCountPerPage={maxEvents}
          totalItems={events.length}
          onPageUpdate={this._onPageUpdate} />
      }
    </FocusZone>
    );
  }

  private _onPageUpdate = (pageNumber: number): void => {
    this.setState({
      currentPage: pageNumber
    });
  }
  /**
   * Render a normal view for devices that are wider than 480
   */
  private _renderNormalList(): JSX.Element {
    const {
      events } = this.state;
    const isEditMode: boolean = this.props.displayMode === DisplayMode.Edit;

    return (<div>
      <div>
        <div role="application">
          <FilmstripLayout
            ariaLabel={strings.FilmStripAriaLabel}
            clientWidth={this.props.clientWidth}
            themeVariant={this.props.themeVariant}
          >
            {events.map((event: ICalendarEvent, index: number) => {
              return (<EventCard
                key={`eventCard${index}`}
                isEditMode={isEditMode}
                event={event}
                isNarrow={false}
                themeVariant={this.props.themeVariant} />
              );
            })}
          </FilmstripLayout>
        </div>
      </div>
    </div>);
  }
}
