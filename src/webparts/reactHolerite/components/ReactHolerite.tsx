import * as React from 'react';
import styles from './ReactHolerite.module.scss';
import '../../../styles/base.module.scss';
import { IReactHoleriteProps } from './IReactHoleriteProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { ActionButton, Dropdown, IDropdownOption, IDropdownStyles, IIconProps, Stack } from 'office-ui-fabric-react';
import * as moment from 'moment';
import { Holerite } from './Holerite/Holerite';
import { IHoleriteInfo, IRubrica, IRubricaInfo } from '../IHolerite';
import { MSGraphClient } from '@microsoft/sp-http';

import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

import {  UrlQueryParameterCollection } from '@microsoft/sp-core-library';


export interface IReactHoleriteState{
  tipos: IDropdownOption[];
  tipoId?: string | number;
  anos: IDropdownOption[];
  ano?: string | number;
  meses: IDropdownOption[];
  mes?: string | number;
  holerite?: IHoleriteInfo;
  error?: string;
  logoUrl?: string;
}

export default class ReactHolerite extends React.Component<IReactHoleriteProps, IReactHoleriteState> {
  private matricula: any;
  private queryParameters: UrlQueryParameterCollection;

  constructor(props: IReactHoleriteProps) {
    super(props);
    moment.locale('pt-br');

    const m = moment(moment().year());  
    let month = m.month(moment().month());

    this.queryParameters = new UrlQueryParameterCollection(window.location.href);

    this.state = {
      anos: this.getAnos(),
      meses: this.getMeses(),
      tipos: this.getTipos(),
      ano: moment().year(),
      mes: month.format('MM'),
      tipoId: '',
      logoUrl: this.props.context.pageContext.web.serverRelativeUrl + this.props.logoUrl
    };
  }

  public componentDidUpdate(prevProps: IReactHoleriteProps, prevState: IReactHoleriteState): void {
      this._getMatricula().then((m) => {
        this.matricula = m;
      });
  }
  
  private _getMatricula(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.props.graphClient
        // get the mailbox settings
        .api(`me/?$select=extension_b01801ce55184c21980a825cc3d61c69_sAMAccountName`)
        .version("v1.0")
        .get((err: any, res: any): void => {
          resolve(res['extension_b01801ce55184c21980a825cc3d61c69_sAMAccountName']);
        });
    });
  }


  public render(): React.ReactElement<IReactHoleriteProps> {
    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;
    const addFriendIcon: IIconProps = { iconName: 'Filter' };
    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 150 }, };


    return (
      <div className={ styles.reactHolerite } style={{backgroundColor: semanticColors.bodyBackground, color: semanticColors.bodyText}}>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>

            <WebPartTitle displayMode={this.props.displayMode}
              className="title"
              title={this.props.title}
              updateProperty={this.props.updateProperty} 
              />
              
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack horizontal tokens={{ childrenGap: 20 }}>

                <Dropdown
                    styles={dropdownStyles}
                    placeholder="Selecione um tipo"                  
                    options={this.state.tipos}
                    onChange={(event, option, index) => { this._tipoChanged(event, option, index); }}
                    className="content"
                    selectedKey={this.state.tipoId}
                  />

                  <Dropdown
                    styles={dropdownStyles}
                    placeholder="Selecione um ano"                  
                    options={this.state.anos}
                    onChange={(event, option, index) => { this._anoChanged(event, option, index); }}
                    className="content"
                    selectedKey={this.state.ano}
                  />

                  <Dropdown
                    styles={dropdownStyles}
                    placeholder="Selecione um mes"                  
                    options={this.state.meses}
                    onChange={(event, option, index) => { this._mesChanged(event, option, index); }}
                    className="content"
                    selectedKey={this.state.mes}
                  />

                <ActionButton 
                  className="content"
                  iconProps={addFriendIcon} 
                  onClick={(event) => { this._getHolerite(); }}                  
                  >
                  Filtrar
                </ActionButton>

                </Stack>

                <Holerite 
                logoUrl = {this.state.logoUrl}
                holerite = {this.state.holerite}
                error = {this.state.error}
                />                  

                

              </Stack>


            </div>
          </div>
        </div>
      </div>
    );
  }


  private _getHolerite() {
    
    let consulta = {
			"holerite": {
				"pernr": this.matricula,
				"perio": `${this.state.ano}-${this.state.mes}`,
				"ocrsn": this.state.tipoId
				}
      };
    
    const debug = this.queryParameters.getValue('debug') == "true";
            
    // console.log(consulta);

    if(debug){
      consulta = {
        "holerite": {
          "pernr": "50000207",
          "perio": "2018-06",
          "ocrsn": ""
          }
        };
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      dataType: "json",
      body: JSON.stringify(consulta),
      crossDomain:true,
    };


    fetch('https://pop.cibra.com:50001/RESTAdapter/cibra/sap_ecc_hcm/holerite', requestOptions)        
        .then(async response => {
          
          const data = await response.json();


          let result : IHoleriteInfo;
          let error : string;

          const success = data.retorno.tipo;
          
          switch (success){
            case "E":
              error = data.retorno.msg;
              break;
            case "S":
              result  = this._getHoleriteInfo(data);
              break;
            default:
              error = "Erro ao identificar o tipo do seu Holerite.";
              break; 
          }

          this.setState({
            holerite : result,
            error: error
          });
        })
        .catch(error => {
            this.setState({ error: "Erro no serviço de identificação do seu Holerite." });
            console.error('There was an error!', error);
        });
    
  }

  private _getHoleriteInfo(data: any) : IHoleriteInfo{
    return {
      empresa: data.cabecalho.butxt.toUpperCase(),
      cnpj: data.cabecalho.cnpj,
      nome: data.cabecalho.cname,
      matricula: data.cabecalho.pernr,
      unidadeOrganizacional: data.cabecalho.orgtx,
      cargo: data.cabecalho.stltx,
      salarioBase: this._getCurrency(data.cabecalho.salbase),
      mesAno: this._getMesAno(data.cabecalho.perio),
      banco: data.cabecalho.banka.toUpperCase(),
      agencia: data.cabecalho.bankag,
      conta: data.cabecalho.bankn,
      dtCredito: this._getDiaMesAno(data.cabecalho.paydt),
      admissao: this._getDiaMesAno(data.cabecalho.admissao),
      cpf: data.cabecalho.cpf,
      pis: data.cabecalho.pis,
      ctps: data.cabecalho.ctps,
      serie: data.cabecalho.ctps_serie,
      rubricaInfo: {
        rubricas: this._getRubricas(data.detalhe.rubricas),
        salarioContribuicao: this._getCurrency(data.totais.contribuicao),
        totalProventos: this._getCurrency(data.totais.proventos),
        totalDescontos: this._getCurrency(data.totais.descontos),
        dr: data.totais.dr,
        dsf: data.totais.dsf,
        fgtsMes: this._getCurrency(data.totais.fgts),
        liquido: this._getCurrency((data.totais.proventos - data.totais.descontos).toFixed(2))
      }            
    };
  }

  private _getRubrica(rubrica : any) : IRubrica{
    return {
      lgart: rubrica.lgart,
      lgtxt: rubrica.lgtxt,
      anzhl : this._getCurrency(rubrica.anzhl),
      proventos : rubrica.proventos == "0.00 "? "":  this._getCurrency(rubrica.proventos),
      descontos : rubrica.descontos == "0.00 " ? "" : this._getCurrency(rubrica.descontos)
    };
  }

  private _getRubricas(rubricas : any) : IRubrica[]{
    const length = rubricas.length;
    let result : IRubrica[] = [];

    if (length == null && rubricas != null) {      
      result.push(this._getRubrica(rubricas));
    }else{
      result = rubricas.map((rubrica) => {
        return this._getRubrica(rubrica);
      });
    }


    return result;
  }

 private _getCurrency(value)
  {
    //console.log(value);

    var retorno = value;
    if(retorno !== undefined && retorno !== "")
    {
      var regexSomenteNumeros = "/[\D]+/g";
      var regexformatdecimal = "/([0-9]{2})$/g";
      retorno = value.replace(regexSomenteNumeros ,"");
      retorno = retorno .replace(regexformatdecimal ,".$1");
      retorno = parseFloat(retorno).toLocaleString('pt-br', {minimumFractionDigits: 2});
    }
    return retorno;
  }

  private _getMesAno(datepart: string){
    const dateParts = datepart.split("-");
    return  dateParts[1] + "/" + dateParts[0];
  }

  private _getDiaMesAno(datepart: string){
    const dateParts = datepart.split("-");
    return  dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
  }

  private _mesChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {
    this.setState({mes: option.key});
  }

  private _anoChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {
    this.setState({ano: option.key});
  }
  private _tipoChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {
    this.setState({tipoId: option.key});
  }

  private getTipos() : IDropdownOption[]{
    return [
      {
        key: "",
        text: "Mensal"
      },
      {
        key: "1313",
        text: "13º Salário"
      },
      {
        key: "ADIA",
        text: "Adiantamento"
      },
      {
        key: "FERI",
        text: "Férias"
      },
      {
        key: "PPRA",
        text: "Adiantamento PPR"
      },
      {
        key: "PPRP",
        text: "PPR Pagamento Final"
      },
    ];
  }

  private getAnos() : IDropdownOption[]{

    let result : IDropdownOption[] = [];


    const currentYear = new Date(moment.now()).getFullYear();
    for (let i = currentYear; i >= 1986; i--) {  
      result.push({
        key: i,
        text: `${i}`
      });
    }

    return result;
  }

  private getMeses() : IDropdownOption[]{

    let result : IDropdownOption[] = [];
    
    const m = moment(moment().year());  

    for (var i = 0; i < 12; i++) {
      let month = m.month(i);
      let mes = month.format('MMMM');
      let mesNum = month.format('MM');

      result.push({
        key: mesNum,
        text: mes
      });

     }

    return result;

  }

}
