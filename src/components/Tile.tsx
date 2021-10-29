import './Tile.css'

const Tile = ( { color, pos, dragColor, UpdateColor } ) => {

    const getColor = () => {
        switch (color) {
            case 0:
                return 'white'
            case 1:
                return 'black'
            case 2:
                return 'blue'
            default:
                return 'yellow'
        }
    }

    const drag = () => {
        dragColor(pos, 1)
    }

    const onDown = () => {
        console.log(pos)
        UpdateColor(pos, 1)
    }

    const doubleClick = () => {
        UpdateColor(pos, 2)
    }

    return (
        <div className='Tile' style={{backgroundColor: getColor()}}
             onMouseOver={drag}
             onMouseDown={onDown}
             onDoubleClick={doubleClick}
        />
    )
};

export default Tile;
