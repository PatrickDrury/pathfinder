import './Tile.css'

const Tile = ( { color, pos, dragColor, UpdateColor } ) => {

    const getColor = () => {
        switch (color) {
            case 0:
                return 'white'
            case 1:
                return '#35353b'
            case 2:
                return 'blue'
            default:
                return 'yellow'
        }
    }

    const drag = () => {
        if(color === 1) {
            dragColor(pos, 0)
        } else {
            dragColor(pos, 1)
        }
    }

    const onDown = () => {
        console.log(pos)
        if(color === 1) {
            UpdateColor(pos, 0)
        } else {
            UpdateColor(pos, 1)
        }
    }

    const doubleClick = () => {
        UpdateColor(pos, 2)
    }

    return (
        <div className='Tile' style={{backgroundColor: getColor(), borderColor: (color !== 1) ? ('black') : (getColor()) }}
             onMouseOver={drag}
             onMouseDown={onDown}
             onDoubleClick={doubleClick}
        />
    )
};

export default Tile;
