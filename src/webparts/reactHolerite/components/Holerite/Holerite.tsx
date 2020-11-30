import * as React from 'react';
import styles from './Holerite.module.scss';
import '../../../../styles/base.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { IHoleriteProps } from './IHoleriteProps';
import { css } from 'office-ui-fabric-react';

export class Holerite extends React.Component<IHoleriteProps, {}> {
    public render(): React.ReactElement<IHoleriteProps> {

        if(this.props.holerite == undefined || this.props.holerite == null){
            return (
                <div className="row noprint" style={{ backgroundColor: "white", padding: "80px 20px 0px 20px", textAlign: "center" }}>
                    <span >{this.props.error}</span>
                </div>
                );
        }

        return (
            <div className={ styles.holerite } >
                <div className={styles.content}>
                    <div className={styles.table}>
                        <div className={css(styles.row, "print")} >                            
                            <table className={styles.table}>
                                <tr className={css(styles.noborder, "fundo-cinza")} >
                                    <td colSpan={3} className={css("fundo-cinza", styles.logo)} >
                                        <span className={styles.title}><img src={this.props.logoUrl} width="100px" /></span>
                                    </td>
                                    <td colSpan={2} className={css("fundo-cinza", styles.demonstrativo)}><span>Demonstrativo de pagamento</span></td>
                                </tr>
                                <tr className={styles.noborder}>
                                    <td colSpan={3}><span className={styles.title}>EMPRESA</span> </td>
                                    <td colSpan={2}><span className={styles.title}>CNPJ</span> </td>
                                </tr>                    
                                <tr className={styles.dados}>
                                    <td colSpan={3}><span className="empresa">{this.props.holerite.empresa}</span></td>
                                    <td colSpan={2}><span className="cnpj">{this.props.holerite.cnpj}</span></td>
                                </tr>
                                <tr className={styles.noborder}>
                                    <td colSpan={3}><span className={styles.title}>NOME</span> </td>
                                    <td><span className={styles.title}>MATRÍCULA</span> </td>
                                    <td><span className={styles.title}>UN ORGANIZACIONAL</span> </td>
                                </tr>
                                <tr className={styles.dados}>
                                    <td colSpan={3}><span className="nome">{this.props.holerite.nome}</span></td>
                                    <td><span className="matricula">{this.props.holerite.matricula}</span></td>
                                    <td><span className="unidade-organizacional">{this.props.holerite.unidadeOrganizacional}</span></td>
                                </tr>
                                <tr className={styles.noborder}>
                                    <td colSpan={3}><span className={styles.title}>cargo</span> </td>
                                    <td><span className={styles.title}>salário base</span> </td>
                                    <td><span className={styles.title}>mês/ano</span> </td>
                                </tr>
                                <tr className={styles.dados}>
                                    <td colSpan={3}><span className="cargo">{this.props.holerite.cargo}</span></td>
                                    <td><span className="salario-base">{this.props.holerite.salarioBase}</span></td>
                                    <td><span className="mes-ano">{this.props.holerite.mesAno}</span></td>
                                </tr>
                                <tr className={styles.noborder}>
                                    <td colSpan={2}><span className={styles.title}>banco</span> </td>
                                    <td><span className={styles.title}>agência</span> </td>
                                    <td><span className={styles.title}>conta - dig</span> </td>
                                    <td><span className={styles.title}>dt.crédito</span> </td>
                                </tr>
                                <tr className={styles.dados}>
                                    <td colSpan={2}><span className="banco">{this.props.holerite.banco}</span></td>
                                    <td><span className="agencia">{this.props.holerite.agencia}</span></td>
                                    <td><span className="conta">{this.props.holerite.conta}</span></td>
                                    <td><span className="dt-credito">{this.props.holerite.dtCredito}</span></td>
                                </tr>
                                <tr className={styles.noborder}>
                                    <td><span className={styles.title}>admissão</span> </td>
                                    <td><span className={styles.title}>cpf</span> </td>
                                    <td><span className={styles.title}>pis</span> </td>
                                    <td><span className={styles.title}>ctps</span> </td>
                                    <td><span className={styles.title}>serie</span> </td>
                                </tr>
                                <tr className={styles.dados}>
                                    <td><span className="admissao">{this.props.holerite.admissao}</span></td>
                                    <td><span className="cpf">{this.props.holerite.cpf}</span></td>
                                    <td><span className="pis">{this.props.holerite.pis}</span></td>
                                    <td><span className="ctps">{this.props.holerite.ctps}</span></td>
                                    <td><span className="serie">{this.props.holerite.serie}</span></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={styles.rubrica}>
                        <div className={styles.row}>
                            <table className={styles.table} >
                                <thead>
                                    <tr className={styles.title}>
                                        <th colSpan={2} style={{ width: "40%" }}>rubrica</th>
                                        <th style={{ width: "20%" }}>quantidade</th>
                                        <th style={{ width: "20%" }}>proventos</th>
                                        <th style={{ width: "20%" }}>descontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.holerite.rubricaInfo.rubricas &&
                                    
                                    this.props.holerite.rubricaInfo.rubricas.map((r) =>{
                                        return (
                                            <tr>
                                                <td colSpan={2}>
                                                    <div style={{ width: "15%", textAlign: "left", float: "left" }}>{r.lgart}</div>
                                                    <div style={{ width: "auto", textAlign: "left", fontSize: "15px" }}>{r.lgtxt}</div>
                                                </td>
                                                <td>{r.anzhl}</td>
                                                <td>{r.proventos}</td>
                                                <td>{r.descontos}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className={styles.title}>
                                        <td colSpan={2} className="fundo-cinza"/>
                                        <td className="fundo-cinza">R$</td>
                                        <td>total proventos</td>
                                        <td>total descontos</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} style={{borderTop: 0 }} className="fundo-cinza">
                                            <span className={styles.title}>liquido</span>
                                        </td>
                                        <td style={{ borderTop: 0 }} className="fundo-cinza">
                                            <span >{this.props.holerite.rubricaInfo.liquido}</span>
                                        </td>
                                        <td style={{ borderTop: 0}}>
                                            <span >{this.props.holerite.rubricaInfo.totalProventos}
                                            </span>
                                        </td>
                                        <td style={{ borderTop: 0 }}>
                                            <span >{this.props.holerite.rubricaInfo.totalProventos}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className={styles.title}>
                                        <td>d/r</td>
                                        <td>d/sf</td>
                                        <td>fgts mês</td>
                                        <td colSpan={2}>salário contribuição</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span >{this.props.holerite.rubricaInfo.dr}</span>
                                        </td>
                                        <td>
                                            <span >{this.props.holerite.rubricaInfo.dsf}</span>
                                        </td>
                                        <td>
                                            <span >{this.props.holerite.rubricaInfo.fgtsMes}</span>
                                        </td>
                                        <td colSpan={2}>
                                            <span >{this.props.holerite.rubricaInfo.salarioContribuicao}</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}