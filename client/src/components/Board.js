
import React, { Component } from 'react';

export default class Board extends Component {

    render() {
        return (
            <div>
                <div className='board'>
                    {this.props.tiles.map( tile => tile )}                    
                </div>                
                <div className='help'>
                    <small>Clique em rolar dado para avançar.</small><br/>
                    <small>O primeiro jogador que chegar na última casas vence.</small>
                </div>
                <div className='dice'>
                    <button onClick={() => this.props.handleRoll()}>{this.props.diceValue}</button>
                </div>
                <div className='help'>
                    {this.props.diceValue !== 'ROLL' && <small>Aguardando o outro jogador.</small>}                    
                </div>
            </div>
        )
    }

}
