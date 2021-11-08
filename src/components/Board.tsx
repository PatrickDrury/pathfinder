import Tile from './Tile'
import {useState} from "react"
import './Board.css'
import Selection from "./Selection"

let slowDrawInterval = null
let drawQueue = []
let start = null;
let exit = null;

const Board = () => {

    // Holds a 2D array of tile attributes
    const [tiles, setTiles] = useState([]);
    // Mouse state, used for dragging
    const [mouseDown, setMouseDown] = useState(false);
    const [xTiles, setXTiles] = useState(33);
    const [yTiles, setYTiles] = useState(17);

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
        if(pos === start) {start = null}
        if(pos === exit) {exit = null}

        let temp = tiles
        temp[pos.y][pos.x] = { key: (pos.x + ' ' + pos.y),
            pos,
            color: color }
        setTiles([...temp])
    }

    const startDraw = async () => {
        slowDrawInterval = setInterval(slowDraw, 1)
    }

    const slowDraw = async () => {
        if(drawQueue.length === 0) {
            clearInterval(slowDrawInterval)
            return
        }
        let drawInfo = drawQueue.shift()
        updateColor(drawInfo.pos, drawInfo.color)
    }

    // Used for dragging walls
    const dragColor = (pos, color) => {
        if(!mouseDown) {
            return
        } else {
            updateColor(pos, color)
        }
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

    const mazeBFS = (tileList, mazeTiles, newDrawList) => {
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
    }

    const mazeDFS = (tileList, mazeTiles, newDrawList) => {
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
    }

    const chooseExit = (mazeTiles) => {
        let possibleExits = []
        for(let i = 0; i < mazeTiles.length; i++) {
            for(let j = 0; j < mazeTiles[0].length; j++) {
                if(mazeTiles[i][j].color === 0) {
                    possibleExits.push( mazeTiles[i][j].pos )
                }
            }
        }

        return possibleExits[randomElement(possibleExits)]
    }

    // Creates a maze by
    const createMaze = ( startPoint, DFS ) => {

        // Tile queue
        let tileList = []
        // Used as a draw queue, passed to slow draw after maze is calculated
        let newDrawList = []
        // Copy of tiles that are update with the algorithm
        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        start = {x:startPoint[0], y:startPoint[1]}

        tileList.push( startPoint )
        mazeTiles[startPoint[1]][startPoint[0]].color = 0
        newDrawList.push( {pos:{x:startPoint[0], y:startPoint[1]}, color:2} )

        if(DFS) {
            mazeDFS(tileList,mazeTiles,newDrawList)
        } else {
            mazeBFS(tileList,mazeTiles,newDrawList)
        }

        let newExit = chooseExit(mazeTiles)

        exit = {x:newExit.x,y:newExit.y}
        newDrawList.push({pos:newExit, color:3})
        drawQueue = newDrawList
        startDraw()
    }

    const genMaze = async (DFS) => {
        clearInterval(slowDrawInterval)
        drawQueue = []
        setRegion( {x:0,y:0} , {x:xTiles, y:yTiles}, 1 )
        if(start) {
            createMaze(( [Math.floor(start.x),Math.floor(start.y)] ), DFS)
        } else {
            createMaze(( [Math.floor(xTiles/2),Math.floor(yTiles/2)] ), DFS)
        }
    }

    const stopDraw = () => {
        drawQueue = []
        clearInterval(slowDrawInterval)
    }

    const clearMaze = () => {
        setRegion( {x:0, y:0}, {x:xTiles, y:yTiles}, 0 )
    }

    const doubleClick = (pos) => {
        if(start) {
            updateColor(start, 0)
        }
        start = pos
        updateColor(pos, 2)
    }

    const BFS = () => {
        if (start === null || exit === null) {
            console.log('Must have start and exit in order to search')
            return;
        }

        // Tile queue
        let tileList = []
        // Used as a draw queue, passed to slow draw after maze is calculated
        let newDrawList = []
        // Copy of tiles that are update with the algorithm
        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        tileList.push(start)
        newDrawList.push( {pos:{x:start.x, y:start.y}, color:5} )
        mazeTiles[start.y][start.x].color = 5

        while(tileList.length > 0) {
            let currentTile = tileList.shift()

            if (currentTile.x === exit.x && currentTile.y === exit.y) {
                break;
            }

            newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y}, color:4} )
            mazeTiles[currentTile.y][currentTile.x].color = 4

            if(currentTile.x - 1 >= 0 && (mazeTiles[currentTile.y][currentTile.x - 1].color === 0 ||
                mazeTiles[currentTile.y][currentTile.x - 1].color === 3 )) {
                tileList.push({x:currentTile.x - 1, y:currentTile.y})
                newDrawList.push( {pos:{x:currentTile.x - 1, y:currentTile.y}, color:5} )
                mazeTiles[currentTile.y][currentTile.x - 1].color = 5
            }

            if(currentTile.x + 1 < xTiles && (mazeTiles[currentTile.y][currentTile.x + 1].color === 0 ||
                mazeTiles[currentTile.y][currentTile.x + 1].color === 3)) {
                tileList.push({x:currentTile.x + 1, y:currentTile.y})
                newDrawList.push( {pos:{x:currentTile.x + 1, y:currentTile.y}, color:5} )
                mazeTiles[currentTile.y][currentTile.x + 1].color = 5
            }

            if(currentTile.y + 1 < yTiles && (mazeTiles[currentTile.y + 1][currentTile.x].color === 0 ||
                mazeTiles[currentTile.y + 1][currentTile.x].color === 3)) {
                tileList.push({x:currentTile.x, y:currentTile.y + 1})
                newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y + 1}, color:5} )
                mazeTiles[currentTile.y + 1][currentTile.x].color = 5
            }

            if(currentTile.y - 1 >= 0 && (mazeTiles[currentTile.y - 1][currentTile.x].color === 0 ||
                mazeTiles[currentTile.y - 1][currentTile.x].color === 3)) {
                tileList.push({x:currentTile.x, y:currentTile.y - 1})
                newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y - 1}, color:5} )
                mazeTiles[currentTile.y - 1][currentTile.x].color = 5
            }
        }
        drawQueue = newDrawList
        startDraw()

    }

    const DFS = () => {
        if (start === null || exit === null) {
            console.log('Must have start and exit in order to search')
            return;
        }

        // Tile queue
        let tileList = []
        // Used as a draw queue, passed to slow draw after maze is calculated
        let newDrawList = []
        // Copy of tiles that are update with the algorithm
        let mazeTiles = JSON.parse(JSON.stringify(tiles))

        tileList.push(start)
        newDrawList.push( {pos:{x:start.x, y:start.y}, color:5} )
        mazeTiles[start.y][start.x].color = 5

        while(tileList.length > 0) {
            let currentTile = tileList.pop()

            if (currentTile.x === exit.x && currentTile.y === exit.y) {
                break;
            }

            newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y}, color:4} )
            mazeTiles[currentTile.y][currentTile.x].color = 4

            if(currentTile.x - 1 >= 0 && (mazeTiles[currentTile.y][currentTile.x - 1].color === 0 ||
                mazeTiles[currentTile.y][currentTile.x - 1].color === 3 )) {
                tileList.push({x:currentTile.x - 1, y:currentTile.y})
                newDrawList.push( {pos:{x:currentTile.x - 1, y:currentTile.y}, color:5} )
                mazeTiles[currentTile.y][currentTile.x - 1].color = 5
            }

            if(currentTile.x + 1 < xTiles && (mazeTiles[currentTile.y][currentTile.x + 1].color === 0 ||
                mazeTiles[currentTile.y][currentTile.x + 1].color === 3)) {
                tileList.push({x:currentTile.x + 1, y:currentTile.y})
                newDrawList.push( {pos:{x:currentTile.x + 1, y:currentTile.y}, color:5} )
                mazeTiles[currentTile.y][currentTile.x + 1].color = 5
            }

            if(currentTile.y + 1 < yTiles && (mazeTiles[currentTile.y + 1][currentTile.x].color === 0 ||
                mazeTiles[currentTile.y + 1][currentTile.x].color === 3)) {
                tileList.push({x:currentTile.x, y:currentTile.y + 1})
                newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y + 1}, color:5} )
                mazeTiles[currentTile.y + 1][currentTile.x].color = 5
            }

            if(currentTile.y - 1 >= 0 && (mazeTiles[currentTile.y - 1][currentTile.x].color === 0 ||
                mazeTiles[currentTile.y - 1][currentTile.x].color === 3)) {
                tileList.push({x:currentTile.x, y:currentTile.y - 1})
                newDrawList.push( {pos:{x:currentTile.x, y:currentTile.y - 1}, color:5} )
                mazeTiles[currentTile.y - 1][currentTile.x].color = 5
            }
        }
        drawQueue = newDrawList
        startDraw()

    }

    return (
        <>
            <Selection genMaze={genMaze} BFS={BFS} DFS={DFS} />
            <button onClick={clearMaze}>Clear Walls</button>
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
                                     UpdateColor={updateColor}
                                     doubleClick={doubleClick}
                        />
                    })
                } ) }
            </div>
        </>
    );
};


export default Board;
