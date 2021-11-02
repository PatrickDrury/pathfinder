import React from 'react';
import Board from './components/Board'
import './App.css'

function App() {
    return (
        <div className='App'>
            <h1 style={{color: 'white'}}>Path finding</h1>
            <Board />
        </div>
    );
}

export default App;
