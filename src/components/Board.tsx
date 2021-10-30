import Tile from './Tile'
import {useState} from "react";
import './Board.css'

const xTiles = 72
const yTiles = 36


const Board = () => {

    // Holds a 2D array of tile attributes
    const [tiles, setTiles] = useState( []);
    // Mouse state, used for dragging
    const [mouseDown, setMouseDown] = useState(false);

    let drawQueue = []

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

    const slowDraw = async () => {
        if(drawQueue.length === 0) {
            return
        }
        let drawInfo = drawQueue.shift()
        updateColor(drawInfo.pos, drawInfo.color)
        setTimeout(slowDraw, 5)
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

    // Creates a maze by using random dfs
    const createMaze = ( start ) => {

        let tileList = []

        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        tileList.push( start )

        drawQueue.push( {pos:{x:start[0], y:start[1]}, color:0} )

        while(tileList.length > 0) {

            console.log('test')

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

            drawQueue.push( {pos:{x:toAdd[2], y:toAdd[3]}, color:0} )
            drawQueue.push( {pos:{x:toAdd[0], y:toAdd[1]}, color:0} )

        }

        slowDraw()
        console.log(mazeTiles)
    }

    const genMaze = () => {
        setRegion( {x:0,y:0} , {x:xTiles, y:yTiles}, 1 )
        createMaze( [4,5] )
    }


    return (
        <>
            <button onClick={genMaze}>CreateMaze</button>
            <button onClick={resetBoard}> Test string </button>
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
