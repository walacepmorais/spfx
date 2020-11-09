import * as React from 'react';
import styles from './ReactCarrossel.module.scss';
import { IReactCarrosselProps } from './IReactCarrosselProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Carousel, CarouselButtonsDisplay, CarouselButtonsLocation, CarouselIndicatorShape } from "@pnp/spfx-controls-react/lib/Carousel";
import { ImageFit } from 'office-ui-fabric-react';
import { IDestaque } from '../interfaces/IDestaque';
import { ICarouselImageProps } from '@pnp/spfx-controls-react/lib/controls/carousel/CarouselImage';
import CarrosselService from '../service/CarrosselService';

export interface IReactCarrosselState{ 
  items: ICarouselImageProps[];
}

export default class ReactCarrossel extends React.Component<IReactCarrosselProps, IReactCarrosselState> {
  
  public constructor(props: IReactCarrosselProps, state: IReactCarrosselState){ 
    super(props); 
    
    this.state = { 
      items: [ 
        { 
          imageSrc: "", 
          title: "",
          description: "",
          url: "",
          showDetailsOnHover: true,
          imageFit: ImageFit.cover
        } 
      ] 
    }; 
  } 

  public componentDidMount(){
    

    var reactHandler = this;  
    this.props.service.get()
        .then((data) => {
      
       const elements = data
        .sort(item => item.Ordem)
        .map<ICarouselImageProps>(
          item => ({
            imageSrc: item.FileRef, 
            title: item.Title,
            description: item.Texto,
            url: item.Url ? item.Url.Url : "",
            showDetailsOnHover: true,
            imageFit: ImageFit.cover,
            key: item.Id
          })
        );

      reactHandler.setState({
        items: elements
      });

    });
  }

  public render(): React.ReactElement<IReactCarrosselProps> {

    return (
      <div className={ styles.reactCarrossel }>
        <div className={ styles.container }>

          <Carousel 
            buttonsLocation={CarouselButtonsLocation.center}
            buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
            
            contentContainerStyles={styles.carouselContent}
            containerButtonsStyles={styles.carouselButtonsContainer}

            isInfinite={true}
            
            indicatorShape={CarouselIndicatorShape.circle}
            pauseOnHover={true}

            element= {this.state.items}


            onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
            onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
          />

        </div>
      </div>
    );
  }
}
