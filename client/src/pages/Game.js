
import React, { Component } from 'react';
import socket from 'socket.io-client'
import Board from '../components/Board'

export default class Game extends Component {
  
    constructor(props){
        super(props)

        this.state = {            
            playersOnline: 0,
            showBoard: false,
            tiles: [],
            playerSquare: 1,
            adversarySquare: 1,
            diceValue: 'ROLL',
            totalTiles: 50
        }
    }

    componentDidMount(){
        this.renderTiles()
        this.subscribeToEvents()
    }

    subscribeToEvents = () => {
        this.io = socket('http://localhost:3000')

        this.io.on('start game', () => {
            this.setState({showBoard:true})
        })

        this.io.on('adversary left', () => {
            //alert('Seu adversário desconectou!')
            //this.setState({showBoard: false})
        })
        
        this.io.on('players online', data => {
            this.setState({playersOnline: data.playersOnline})
        })
        
        this.io.on('move', data => {
            if(window.location.origin !== data.player){
                this.moveAdversary()
                this.setState({adversarySquare:data.square, diceValue:'ROLL'}, () => this.renderTiles())
            }
        })

        this.io.on('win', data => {
            if(window.location.origin === data.player){
                alert('Você venceu!')
            }else{
                alert('Você perdeu!')
            }
            this.setState({showBoard: false})
        })
    }

    handleRoll = () => {
        if(this.state.diceValue !== 'ROLL'){
            alert('Aguarde o outro jogador jogar')
        }else{
            let diceValue = Math.floor(Math.random() * 6) + 1
            let playerSquare = this.state.playerSquare + diceValue        
            this.setState({diceValue, playerSquare}, () => this.renderTiles())
            this.io.emit('move', {square:playerSquare})
            
            if(playerSquare >= this.state.totalTiles){
                this.io.emit('win', {})
            }
        }
    }

    renderTiles = () => {
        let totalTiles = this.state.totalTiles
        let tiles = []
        let classname = ''
        
        for(let i = 1; i <= totalTiles; i++){
            classname = 'default-tile'
            
            if( i === totalTiles) {
                if(this.state.playerSquare >= i) classname = 'player-tile'
                if(this.state.adversarySquare >= i) classname = 'adversary-tile'
            }else{
                if(this.state.playerSquare === i) classname = 'player-tile'
                if(this.state.adversarySquare === i) classname = 'adversary-tile'
            }

            tiles.push(<div key={i} className={`tile ${classname}`}><div className='number'>{i}</div></div>)
        }

        tiles.reverse()
        this.setState({tiles})
    }

    renderBoard = () => {
        if(this.state.showBoard){
            return <Board 
                tiles={this.state.tiles}
                playerSquare={this.state.playerSquare}
                adversarySquare={this.state.adversarySquare}
                diceValue={this.state.diceValue}
                handleRoll={this.handleRoll}
                handleMove={this.handleMove} />
        } else {
            return (
                <div className='container'>
                    <div className='waitingList'>
                        <p><b>Jogadores online</b></p>
                        <h1>{this.state.playersOnline}</h1>
                        <small>O jogo começará quando houver 2 jogadores online</small>
                    </div>
                </div>
            )
        }
    }

    render() {
        return this.renderBoard()
    }

}
