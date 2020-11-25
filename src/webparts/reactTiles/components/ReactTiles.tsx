import * as React from 'react';
import * as strings from 'ReactTilesWebPartStrings';
import styles from './ReactTiles.module.scss';
import '../../../styles/base.module.scss';
import { IReactTilesProps } from './IReactTilesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { Tile } from './Tile/Tile';

export default class ReactTiles extends React.Component<IReactTilesProps, {}> {
  public render(): React.ReactElement<IReactTilesProps> {
    
    

    return (
      <div className={styles.reactTiles}>
        <WebPartTitle displayMode={this.props.displayMode}
          className="title"
          title={this.props.title}
          updateProperty={this.props.fUpdateProperty} />
        {
          this.props.collectionData && this.props.collectionData.length > 0 ? (
            <div className={styles.tilesList}>
              {
                this.props.collectionData.map((tile, idx) =>
                  <Tile key={idx} item={tile} height={this.props.tileHeight} />)
              }
            </div>
          ) : (
              <Placeholder
                iconName='Edit'
                iconText={strings.noTilesIconText}
                description={strings.noTilesConfigured}
                buttonLabel={strings.noTilesBtn}
                onConfigure={this.props.fPropertyPaneOpen} />
            )
        }
      </div>
    );
  }
}
