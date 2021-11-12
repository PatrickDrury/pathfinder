import {checkStartAndExit} from "./Contraint-Checks"

test('Valid start and exit', () => {
    const start = {x:1, y:1}
    const exit = {x:2, y:2}
    const xTiles = 10;
    const yTiles = 10;
    expect(checkStartAndExit(start,exit,xTiles,yTiles)).toBe(true)
})

test('Invalid exit, negative y', () => {
    const start = {x:1, y:1}
    const exit = {x:2, y:-1}
    const xTiles = 10;
    const yTiles = 10;
    expect(checkStartAndExit(start,exit,xTiles,yTiles)).toBe(false)
})

test('Invalid exit, out of bounds', () => {
    const start = {x:1, y:1}
    const exit = {x:2, y:15}
    const xTiles = 10;
    const yTiles = 10;
    expect(checkStartAndExit(start,exit,xTiles,yTiles)).toBe(false)
})

test('Invalid start, out of bounds', () => {
    const start = {x:12, y:1}
    const exit = {x:2, y:1}
    const xTiles = 10;
    const yTiles = 10;
    expect(checkStartAndExit(start,exit,xTiles,yTiles)).toBe(false)
})

test('Invalid start, negative x', () => {
    const start = {x:-5, y:1}
    const exit = {x:2, y:1}
    const xTiles = 10;
    const yTiles = 10;
    expect(checkStartAndExit(start,exit,xTiles,yTiles)).toBe(false)
})