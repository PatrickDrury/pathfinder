import './Tile.css'

const Tile = ( { color, pos, dragColor, UpdateColor, doubleClick } ) => {

    const getColor = () => {
        switch (color) {
            case 0:
                return 'white'
            case 1:
                return '#35353b'
            case 2:
                return 'green'
            case 3:
                return 'red'
            case 4:
                return '#9ba2c2'
            case 5:
                return '#253378'
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

    const dClick = () => {
        doubleClick(pos)
    }

    return (
        <div className='Tile' style={{backgroundColor: getColor(), borderColor: (color !== 1) ? ('black') : (getColor()) }}
             onMouseOver={drag}
             onMouseDown={onDown}
             onDoubleClick={dClick}
        />
    )
};

export default Tile;
