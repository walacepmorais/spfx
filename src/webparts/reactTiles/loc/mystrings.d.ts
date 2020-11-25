declare interface IReactTilesWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  TilesListDescription: string;
  TileHeight: string;
  iconInformation: string;

  // Properties
  tilesDataLabel: string;
  tilesPanelHeader: string;
  tilesManageBtn: string;

  // Tile fields
  titleField: string;
  descriptionField: string;
  urlField: string;
  iconField: string;
  targetField: string;

  targetCurrent: string;
  targetNew: string;

  // Component
  noTilesIconText: string;
  noTilesConfigured: string;
  noTilesBtn: string;
}

declare module 'ReactTilesWebPartStrings' {
  const strings: IReactTilesWebPartStrings;
  export = strings;
}
