import * as React from 'react';
import styles from './ReactColaboradores.module.scss';
import '../../../styles/base.module.scss';

import { IReactColaboradoresProps } from './IReactColaboradoresProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { ActionButton, IIconProps, ITextFieldStyles, Link, Stack, TextField } from 'office-ui-fabric-react';

import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IReactColaboradoresState{
  searchtext : string;
}

export default class ReactColaboradores extends React.Component<IReactColaboradoresProps, IReactColaboradoresState> {

  constructor(props: IReactColaboradoresProps) {
    super(props);

    this.state = { 
      searchtext : ''
    };

  }
  public render(): React.ReactElement<IReactColaboradoresProps> {

    const addFriendIcon: IIconProps = { iconName: 'ProfileSearch' };

    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;
    
    return (
      <div className={ styles.reactColaboradores } style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              
            <WebPartTitle displayMode={this.props.displayMode}
              className="title"
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              
              
              />
              <Stack tokens={{ childrenGap: 10 }} >
                <TextField
                  className="content"
                  value={this.state.searchtext}
                  onChange={ (e, value) => { this.setState({searchtext: value}); } }
                  placeholder='Digite o texto de pesquisa'
                />

                <ActionButton 
                  className="content"
                  iconProps={addFriendIcon} 
                  href={ `${this.props.context.pageContext.web.serverRelativeUrl}/${this.props.pageUrl}?k=${this.state.searchtext}` }
                  target='_blank'>
                  Pesquisar
                </ActionButton>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
