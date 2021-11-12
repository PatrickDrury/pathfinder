import {checkValidUser} from "./Contraint-Checks"

test('Basic user', () => {
    const toCheck = "12345678"
    expect(checkValidUser(toCheck)).toBe(true)
})

test('User short', () => {
    const toCheck = ""
    expect(checkValidUser(toCheck)).toBe(false)
})

test('User long', () => {
    const toCheck = "01234567890123456"
    expect(checkValidUser(toCheck)).toBe(false)
})