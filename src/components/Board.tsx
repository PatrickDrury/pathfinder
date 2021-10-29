import Tile from './Tile'
import {useEffect, useState} from "react";
import './Board.css'

const xTiles = 51
const yTiles = 24

const Board = () => {

    // Holds a 2D array of tile attributes
    const [tiles, setTiles] = useState( []);
    // Mouse state, used for dragging
    const [mouseDown, setMouseDown] = useState(false);

    let drawQueue = []
    let isDrawing = false

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

        setTiles(tempTiles)
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
        if(drawQueue.length > 0) {
            isDrawing = true
        } else {
            isDrawing = false
            return
        }
        let drawInfo = drawQueue.shift()
        updateColor(drawInfo.pos, drawInfo.color)
        setTimeout(slowDraw, 0)
    }

    // Used for dragging walls
    const dragColor = (pos, color) => {
        if(color === 1 && !mouseDown) {
            return
        }
        updateColor(pos, color)
    }

    const mToggle = () => {
        setMouseDown(!mouseDown)
    }

    const setRegion = (TL, BR) => {
        for(let y = TL.y; y < BR.y; y++) {
            for(let x = TL.x; x < BR.x; x++) {
                updateColor( {x:x, y:y}, 3 )
            }
        }
    }

    // Creates a vertical bar at x from y1 to y2
    const drawVerticalBarHole = (x, y1, y2) => {
        for(let i = y1; i <= y2; i++) {
            drawQueue.push({ pos:{x:x, y:i}, color:2 })
        }
        let hole = Math.floor( Math.random() * (y2 - y1 + 1) ) + y1
        drawQueue.push({ pos:{x:x, y:hole}, color:0 })
        if(!isDrawing) {
            slowDraw()
        }
    }

    // Creates a Horizontal bar at y from x1 to x2
    const drawHorizontalBarHole = (y, x1, x2) => {
        for(let i = x1; i <= x2; i++) {
            drawQueue.push({ pos:{x:i, y:y}, color:2 })
        }
        let hole = Math.floor( Math.random() * (x2 - x1 + 1) ) + x1
        drawQueue.push({ pos:{x:hole, y:y}, color:0 })
        if(!isDrawing) {
            slowDraw()
        }
    }

    // Creates a maze by recursive division
    const createMaze = () => {

        let sections = []
        sections.push( { TL:{x:0,y:0}, BR:{x:xTiles - 1, y:yTiles - 1} } )

        const vert = (TL, BR) => {

            let x = Math.floor( Math.random() * (BR.x - TL.x - 2) ) + 1 + TL.x

            drawVerticalBarHole(x, TL.y, BR.y)

            let R1 = {TL:TL, BR:{x:x - 1, y:BR.y}}
            let R2 = {TL:{x:x + 1, y:TL.y}, BR:BR}

            sections.push(R2)
            sections.push(R1)

        }

        const horiz = (TL, BR) => {

            let y = Math.floor( Math.random() * (BR.y - TL.y - 2) ) + 1 + TL.y

            drawHorizontalBarHole(y, TL.x, BR.x)

            let R1 = {TL:TL, BR:{x:BR.x, y: y - 1}}
            let R2 = {TL:{x:TL.x, y:y + 1 }, BR:BR}

            sections.push(R2)
            sections.push(R1)

        }

        while(sections.length > 0) {
            console.log(JSON.stringify(sections))

            let current = sections.pop()

            let TL = current.TL
            let BR = current.BR

            // Decides if we can create a bar in the vertical / horizontal directions
            let canVert = (BR.x - TL.x) > 1
            let canHoriz = (BR.y - TL.y) > 1

            console.log(canVert)
            console.log(canHoriz)

            if (!canVert || !canHoriz) {
                continue
            } else if (!canVert) {
                horiz(TL, BR)
            } else if (!canHoriz) {
                vert(TL, BR)
            } else {
                if(Math.floor(Math.random() * 2) === 0) {
                    vert(TL, BR)
                } else {
                    horiz(TL, BR)
                }
            }
        }

    }

    const genMaze = () => {
        resetBoard()
        createMaze()
    }

    const testString = () => {
        drawHorizontalBarHole(1, 1, 4)
    }

    return (
        <>
            <button onClick={genMaze}>CreateMaze</button>
            <button onClick={resetBoard}> Test string </button>
            <div onMouseDown={mToggle}
                 onMouseUp={mToggle}
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
