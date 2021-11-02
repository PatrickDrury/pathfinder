import Tile from './Tile'
import {useState} from "react";
import './Board.css'
import Selection from "./Selection";

const xTiles = 40
const yTiles = 20
let test = null
let drawQueue = []


const Board = () => {

    // Holds a 2D array of tile attributes
    const [tiles, setTiles] = useState( []);
    // Mouse state, used for dragging
    const [mouseDown, setMouseDown] = useState(false);

    // Used to reset the board to a blank state
    const resetBoard = () => {
        let tempTiles = []

        for(let i = 0; i < yTiles; i++) {
            tempTiles.push([])
            for(let j = 0; j < xTiles; j++) {
                tempTiles[i].push({
                    key: (j.toString() + ' ' + i.toString()),
                    pos: {x:j, y:i},
                    color: 0
                })
            }
        }

        setTiles([...tempTiles])
    }

    // Initial setup of the tiles
    if(tiles.length === 0) {
        resetBoard()
    }

    // Updates a tile and re-renders board, this function gets passed to all tiles
    const updateColor = (pos, color) => {
        let temp = tiles
        temp[pos.y][pos.x] = { key: (pos.x + ' ' + pos.y),
            pos,
            color: color }
        setTiles([...temp])
    }

    const startDraw = async () => {
        console.log('test')
        test = setInterval(slowDraw, 0)
    }

    const slowDraw = async () => {
        if(drawQueue.length === 0) {
            console.log('Slow draw finished')
            clearInterval(test)
            return
        }

        let drawInfo = drawQueue.shift()
        updateColor(drawInfo.pos, drawInfo.color)
    }

    // Used for dragging walls
    const dragColor = (pos, color) => {
        if(color === 1 && !mouseDown) {
            return
        }
        updateColor(pos, color)
    }

    const mDown = () => {
        setMouseDown(true)
    }

    const mUp = () => {
        setMouseDown(false)
    }

    const setRegion = (TL, BR, color) => {
        for(let y = TL.y; y < BR.y; y++) {
            for(let x = TL.x; x < BR.x; x++) {
                updateColor( {x:x, y:y}, color )
            }
        }
    }

    const randomElement = (arr) => {
        return Math.floor( Math.random() * arr.length )
    }

    const tileToAdd = (pos, tileSet) => {

        let possibleChoice = [ [pos[0] + 2, pos[1], pos[0] + 1, pos[1] ],
            [pos[0] - 2, pos[1], pos[0] - 1, pos[1]],
            [pos[0], pos[1] + 2, pos[0], pos[1] + 1],
            [pos[0], pos[1] - 2, pos[0], pos[1] - 1]
        ]

        while(possibleChoice.length > 0) {
            let element = randomElement(possibleChoice)
            let choice = possibleChoice[element]

            possibleChoice.splice(element, 1)
            if (choice[0] >= 0 && choice[0] < xTiles && choice[1] >= 0 && choice[1] < yTiles) {

                if (tileSet[choice[1]][choice[0]].color === 1) {
                    return choice
                }
            }
        }

        return null
    }

    // Creates a maze by using random BFS
    const createMazeBFS = ( start ) => {

        let tileList = []
        let newDrawList = []

        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        tileList.push( start )
        mazeTiles[start[1]][start[0]].color = 0
        newDrawList.push( {pos:{x:start[0], y:start[1]}, color:0} )

        while(tileList.length > 0) {

            let tileElement = randomElement(tileList)
            let currentTile = tileList[tileElement]

            let toAdd = tileToAdd(currentTile, mazeTiles)

            if(toAdd === null) {
                tileList.splice(tileElement,1)
                continue;
            }

            tileList.push(toAdd)

            mazeTiles[toAdd[1]][toAdd[0]].color = 0
            mazeTiles[toAdd[3]][toAdd[2]].color = 0

            newDrawList.push( {pos:{x:toAdd[2], y:toAdd[3]}, color:0} )
            newDrawList.push( {pos:{x:toAdd[0], y:toAdd[1]}, color:0} )
        }

        drawQueue = newDrawList
        startDraw()
    }

    // Creates a maze by using random DFS
    const createMazeDFS = ( start ) => {

        let tileList = []
        let newDrawList = []

        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        tileList.push( start )
        mazeTiles[start[1]][start[0]].color = 0
        newDrawList.push( {pos:{x:start[0], y:start[1]}, color:0} )

        while(tileList.length > 0) {

            //let tileElement = randomElement(tileList)
            let currentTile = tileList[tileList.length - 1]

            let toAdd = tileToAdd(currentTile, mazeTiles)

            if(toAdd === null) {
                tileList.splice(tileList.length-1,1)
                continue;
            }

            tileList.push(toAdd)

            mazeTiles[toAdd[1]][toAdd[0]].color = 0
            mazeTiles[toAdd[3]][toAdd[2]].color = 0

            newDrawList.push( {pos:{x:toAdd[2], y:toAdd[3]}, color:0} )
            newDrawList.push( {pos:{x:toAdd[0], y:toAdd[1]}, color:0} )
        }

        drawQueue = newDrawList
        startDraw()
    }

    const genMaze = async (DFS) => {
        clearInterval(test)
        drawQueue = []
        setRegion( {x:0,y:0} , {x:xTiles, y:yTiles}, 1 )
        if(DFS) {
            createMazeDFS( [10,5] )
        } else {
            createMazeBFS( [10,5] )
        }
    }

    const stopDraw = () => {
        clearInterval(test)
    }


    return (
        <>
            <Selection genMaze={genMaze} />
            <button onClick={stopDraw}>Stop Drawing</button>
            <div onMouseDown={mDown}
                 onMouseUp={mUp}
                 className='Board'
                 style={{width: xTiles * 20, height: yTiles * 20}}
            >
                {tiles.map( function ( list ) {
                    return list.map(function ( { key, pos, color } ) {
                        return <Tile key={key}
                                     color={color}
                                     pos={pos}
                                     dragColor={dragColor}
                                     UpdateColor={updateColor} />
                    })
                } ) }
            </div>
        </>
    );
};


export default Board;
