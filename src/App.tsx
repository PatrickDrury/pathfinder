import React from 'react';
import Board from './components/Board'
import Selection from './components/Selection'
import './App.css'

function App() {
    return (
        <div className='App'>
            <h1 style={{color: 'white'}}>Path finding</h1>
            <Selection />
            <Board />
        </div>
    );
}

export default App;
