import * as React from 'react';
import styles from './ReactDestaques.module.scss';
import { IReactDestaquesProps } from './IReactDestaquesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Label } from 'office-ui-fabric-react/lib/Label';

export default class ReactDestaques extends React.Component<IReactDestaquesProps, {}> {
  public render(): React.ReactElement<IReactDestaquesProps> {
    return (
      <div className={ styles.reactDestaques }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>              
              
              <a href="https://aka.ms/spfx" >
                <Image 
                  src="https://source.unsplash.com/daily"
                  alt="Palavra do Presidente"
                  className={styles.img_direita}
                  imageFit={ImageFit.centerCover}

                />
              </a>
            
          </div>

        </div>

        <div className={ styles.row }>
            <div className={ styles.column }>              
              
              <a href="https://aka.ms/spfx" >
                <Image 
                  src="https://source.unsplash.com/daily"
                  alt="Palavra do Presidente"
                  className={styles.img_direita_2}
                  imageFit={ImageFit.centerCover}
                />
              </a>
            
          </div>
          
        </div>
      </div>
      </div>
    );
  }
}
