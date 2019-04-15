import React, { Component } from 'react';
import socket from 'socket.io-client'
import Board from '../components/Board'

export default class Game extends Component {

    constructor(props){
        super(props)

        this.host  = 'http://localhost:3000'

        this.state = {            
            playersOnline: 0,
            showBoard: false,
            tiles: [],
            playerSquare: 1,
            adversarySquare: 1,
            diceValue: 'ROLL',
            totalTiles: 50,
            bonusTile1:0,
            bonusTile2:0,
            onusTile1:0,
            onusTile2:0,
            nickname:null,
            adversaryName:null
        }
    }

    componentDidMount(){
        let bonusTile1 = Math.floor(Math.random() * this.state.totalTiles-1) + 2
        let bonusTile2 = Math.floor(Math.random() * this.state.totalTiles-1) + 2
        let onusTile1 = Math.floor(Math.random() * this.state.totalTiles-1) + 2
        let onusTile2 = Math.floor(Math.random() * this.state.totalTiles-1) + 2
        this.setState({bonusTile1, bonusTile2, onusTile1, onusTile2}, () => {
            this.renderTiles()
            this.subscribeToEvents()    
        })
    }

    start = () => {
        if(this.state.nickname !== null && this.state.nickname !== '' && this.state.playersOnline === 2) {
            this.io.emit('store name', {name:this.state.nickname})
            this.setState({showBoard:true})
        }            
    }

    subscribeToEvents = () => {

        if(window.location.origin.indexOf('localhost') !== -1){
            alert('Localhost não é permitido, use seu IP local')
            return
        }

        this.io = socket(this.host)
        
        this.io.on('players online', data => {
            this.setState({playersOnline: data.playersOnline})
        })
        
        this.io.on('move', data => {
            if(window.location.origin !== data.player)
                this.setState({adversarySquare:data.square, diceValue:'ROLL'}, () => this.renderTiles())
        })
        
        this.io.on('player list', data => {
            let playerObj = data.ips.find( obj => obj.ip === window.location.origin)
            let adversaryObj = data.ips.find( obj => obj.ip !== window.location.origin)
            this.setState({nickname: playerObj.player, adversaryName: adversaryObj.player})            
        })

        this.io.on('win', data => {
            if(window.location.origin === data.player){
                alert('Você venceu!')
            }else{
                alert('Você perdeu!')
            }
            this.setState({showBoard: false, nickname:''})
        })
    }

    handleRoll = () => {
        if(this.state.diceValue !== 'ROLL'){
            alert('Aguarde o outro jogador jogar')
        }else{
            let diceValue = Math.floor(Math.random() * 6) + 1
            let playerSquare = this.state.playerSquare + diceValue                    
            this.move(diceValue, playerSquare)
        }
    }

    checkBonusTile = (diceValue, playerSquare) => {
        if([this.state.bonusTile1, this.state.bonusTile2].includes(playerSquare)){
            let value = Math.floor(Math.random() * 6) + 1
            alert(`Avance ${value} casas`)
            let newPlayerSquare = playerSquare+value
            this.move(diceValue, newPlayerSquare)
        }

        if([this.state.onusTile1, this.state.onusTile2].includes(playerSquare)){
            let value = Math.floor(Math.random() * 6) + 1
            alert(`Recue ${value} casas`)
            let newPlayerSquare = playerSquare-value
            newPlayerSquare = newPlayerSquare < 1 ? 1 : newPlayerSquare
            this.move(diceValue, newPlayerSquare)
        }
    }

    move = (diceValue, playerSquare) => {
        this.setState({diceValue, playerSquare}, () => {
            this.renderTiles()            
            this.io.emit('move', {square:playerSquare})        
            if(playerSquare >= this.state.totalTiles) this.io.emit('win', {})            
            this.checkBonusTile(diceValue, playerSquare)
        })
    }

    renderTiles = () => {
        let totalTiles = this.state.totalTiles
        let tiles = []
        let classname = ''
        
        for(let i = 1; i <= totalTiles; i++){
            classname = 'default-tile'
            
            if([this.state.bonusTile1, this.state.bonusTile2].includes(i)) classname = 'bonus-tile'
            if([this.state.onusTile1, this.state.onusTile2].includes(i)) classname = 'onus-tile'

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
            return (
                <div className='container'>
                    <div className='names'>
                        <div className='name'>
                            <span className='color player-tile'></span> {this.state.nickname}
                        </div>
                        <div className='name'>
                            <span className='color adversary-tile'></span> {this.state.adversaryName}
                        </div>
                        <div className='name'>
                            <span className='color bonus-tile'></span> Bônus
                        </div>
                        <div className='name'>
                            <span className='color onus-tile'></span> Ônus
                        </div>
                    </div>
                    <Board 
                        tiles={this.state.tiles}
                        playerSquare={this.state.playerSquare}
                        adversarySquare={this.state.adversarySquare}
                        diceValue={this.state.diceValue}
                        handleRoll={this.handleRoll}
                        handleMove={this.handleMove} />
                </div>
                )                
        } else {
            return (
                <div className='container'>
                    <div className='waitingList'>
                        <p>
                            <input 
                                className='name-input'
                                type='text' 
                                placeholder='Digite seu nome' 
                                onChange={(e) => this.setState({nickname:e.target.value})} />
                        </p>
                        <p><b>Jogadores online</b></p>
                        <h1>{this.state.playersOnline}</h1>
                        <small>O jogo começará quando houver 2 jogadores online <br/> E você tiver escolhido um nome</small>
                        <div>
                            <button className='start-button' onClick={() => this.start()}> START </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return this.renderBoard()
    }

}
