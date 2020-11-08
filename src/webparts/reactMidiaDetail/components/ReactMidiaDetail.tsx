import * as React from 'react';
import styles from './ReactMidiaDetail.module.scss';


import { IReactMidiaDetailProps } from './IReactMidiaDetailProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { GridLayout } from '@pnp/spfx-controls-react/lib/GridLayout';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { IMidiaDetail } from '../interfaces/IMidiaDetail';
import { ISize, Link } from 'office-ui-fabric-react';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';

import ImageGallery from 'react-image-gallery';



export interface IReactMidiaDetailState{ 
  items: any[];
  showIndex: boolean;
  showBullets: boolean;
  infinite: boolean;
  showThumbnails: boolean;
  showFullscreenButton: boolean;
  showGalleryFullscreenButton: boolean;
  showPlayButton: boolean;
  showGalleryPlayButton: boolean;
  showNav: boolean;
  isRTL: boolean;
  slideDuration: number;
  slideInterval: number;
  slideOnThumbnailOver: boolean;
  thumbnailPosition: string;
  showVideo: any;
}

export default class ReactMidiaDetail extends React.Component<IReactMidiaDetailProps, IReactMidiaDetailState> {

  private _imageGallery : ImageGallery;
  private _imageExtensions : string[] = ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 
  'png', 'gif', 'webp', 'tiff', 'tif', 'psd', 'raw', 'arw', 'cr2', 'nrw', 'k25', 'bmp', 'dib', 'heif', 'heic', 'ind', 'indd', 'indt',
  'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'ai', 'eps', 'pdf'];

  constructor(props: IReactMidiaDetailProps) {
    super(props);
    

      this.state = { 
        items : props.service.getExampleData().map((midia) => {
          return {
            original: midia.ServerRelativeUrl,
            thumbnail: midia.ServerRelativeUrl
          };
        }),
        showIndex: false,
        showBullets: true,
        infinite: true,
        showThumbnails: true,
        showFullscreenButton: true,
        showGalleryFullscreenButton: true,
        showPlayButton: true,
        showGalleryPlayButton: true,
        showNav: true,
        isRTL: false,
        slideDuration: 450,
        slideInterval: 2000,
        slideOnThumbnailOver: true,
        thumbnailPosition: 'bottom',
        showVideo: {},
      };

  }


  private isImage(path) : boolean{

    let extension = path.split('.').pop();
    return this._imageExtensions.indexOf(extension) != -1;

  }

  private getItem(midia : IMidiaDetail){
    if(this.isImage(midia.ServerRelativeUrl)){
      return {
        original: midia.ServerRelativeUrl,
        thumbnail: midia.Thumbnail,
      };
    }else{
      return {
        original: midia.Thumbnail,
        thumbnail: midia.Thumbnail,
        embedUrl: midia.ServerRelativeUrl,
        renderItem: this._renderVideo.bind(this)
      };
    }

  }

  public componentDidMount(){
    

    var reactHandler = this;  

    //let path = '/sites/Intranet-HML/SitePages/Mídias.aspx'; 
    let path = this.props.context.pageContext.site.serverRequestPath;
    

    this.props.service.get(path)
        .then((data) => {
    
        reactHandler.setState({
          items: data.map((midia) => {
            return this.getItem(midia);
          })
        });

      });
    
  }

  public componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval ||
        this.state.slideDuration !== prevState.slideDuration) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }

  private _onSlide(index) {
    this._resetVideo();
  }

  private _resetVideo() {
    this.setState({showVideo: {}});

    if (this.state.showPlayButton) {
      this.setState({showGalleryPlayButton: true});
    }

    if (this.state.showFullscreenButton) {
      this.setState({showGalleryFullscreenButton: true});
    }
  }


  private _renderVideo(item) {
    return (
      <div>
        {
          this.state.showVideo[item.embedUrl] ?

            <div className={styles["video-wrapper"]}>
                <a
                  className={styles['close-video']}
                  onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
                >
                </a>
                <iframe
                  width='560'
                  height='315'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </div>

          :
            
            <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
              <div className={styles['play-button']}></div>
              <img className={styles['image-gallery-image']} src={item.original} />
              {
                item.description &&
                  <span
                    className={styles['image-gallery-description']}
                    style={{right: '0', left: 'initial'}}
                  >
                    {item.description}
                  </span>
              }
            </a>

        }
      </div>
    );
  }

  private _renderVideo2(item) {
    return (
      <div>
            <div className="video-wrapper">

                  {/* <video width="560" height="315" controls muted >
                    <source src={item.embedUrl} type="video/mp4" /> 
                    Your browser does not support the video tag.
                  </video> */}

                <iframe
                  width='560'
                  height='315'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </div>
      </div>
    );
  }

  private _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({showGalleryPlayButton: false});
      }

      if (this.state.showFullscreenButton) {
        this.setState({showGalleryFullscreenButton: false});
      }
    }
  }

  public render() {
    return <div className={ styles.reactMidiaDetail }>
    <div className={ styles.container }>
      <ImageGallery
              ref={i => this._imageGallery = i}
              items={this.state.items}
              lazyLoad={false}
              // onClick={this._onImageClick.bind(this)}
              // onImageLoad={this._onImageLoad}
              onSlide={this._onSlide.bind(this)}
              // onPause={this._onPause.bind(this)}
              // onScreenChange={this._onScreenChange.bind(this)}
              // onPlay={this._onPlay.bind(this)}
              infinite={this.state.infinite}
              showBullets={this.state.showBullets}
              showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
              showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
              showThumbnails={this.state.showThumbnails}
              showIndex={this.state.showIndex}
              showNav={this.state.showNav}
              isRTL={this.state.isRTL}
              thumbnailPosition={this.state.thumbnailPosition}
              slideDuration={this.state.slideDuration}
              slideInterval={this.state.slideInterval}
              slideOnThumbnailOver={this.state.slideOnThumbnailOver}
              additionalClass="app-image-gallery"
            />
            </div>
      </div>;
  }
}
