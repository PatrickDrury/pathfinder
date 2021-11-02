import './Selection.css'

const Selection = ( {genMaze} ) => {

    const createMazeBFS = () => {
        genMaze(false)
    }

    const createMazeDFS = () => {
        genMaze(true)
    }

    return (
        <div className='Selection'>
            <button className='Selection-Button'>DFS</button>
            <button className='Selection-Button'>BFS</button>
            <button className='Selection-Button'>A*</button>
            <button className='Selection-Button' onClick={createMazeBFS}>BFS Maze</button>
            <button className='Selection-Button' onClick={createMazeDFS}>DFS Maze</button>
        </div>
    );
};

export default Selection;
