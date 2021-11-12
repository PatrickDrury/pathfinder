import {checkValidPass} from "./Contraint-Checks"

test('Basic password', () => {
    const toCheck = "12345Ab!"
    expect(checkValidPass(toCheck)).toBe(true)
})

test('Password short', () => {
    const toCheck = "12345Ab"
    expect(checkValidPass(toCheck)).toBe(false)
})

test('Password no symbol', () => {
    const toCheck = "123456Ab"
    expect(checkValidPass(toCheck)).toBe(false)
})

test('Password no lowercase', () => {
    const toCheck = "12345AB!"
    expect(checkValidPass(toCheck)).toBe(false)
})

test('Password no uppercase', () => {
    const toCheck = "12345ab!"
    expect(checkValidPass(toCheck)).toBe(false)
})

test('Password no numbers', () => {
    const toCheck = "Aasdfasdfb!"
    expect(checkValidPass(toCheck)).toBe(false)
})