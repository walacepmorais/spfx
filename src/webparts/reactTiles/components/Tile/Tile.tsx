import * as React from 'react';
import styles from './Tile.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { ITileProps } from './ITileProps';
import { css } from 'office-ui-fabric-react';

export class Tile extends React.Component<ITileProps, {}> {
  public render(): React.ReactElement<ITileProps> {
    const tileStyle: React.CSSProperties = {};
    if (this.props.height) {
      tileStyle.height = `${this.props.height}px`;
    }

    return (
      <div className={css(styles.tile, "title")} style={tileStyle}>
        <a href={this.props.item.url}
          target={this.props.item.target}
          title={this.props.item.title}>
          <div className={styles.tileIcon}>
            <Icon iconName={this.props.item.icon} />
          </div>
          <div className={styles.tileTitle}>
            {this.props.item.title}
          </div>

          <div className={styles.overflow}>
            {this.props.item.description}
          </div>
        </a>
      </div>
    );
  }
}
