const checkStartAndExit = (start, exit, xTiles, yTiles) => {
    if (start === null || exit === null) {
        return false
    }
    if (start.x < 0 || exit.x < 0) {
        return false
    }
    if (start.x >= xTiles || exit.x >= xTiles) {
        return false
    }
    if (start.y < 0 || exit.y < 0) {
        return false
    }
    if (start.y >= yTiles || exit.y >= yTiles) {
        return false
    }
    return true
}

const checkValidPass = (password) => {
    if (password.length < 8) {
        return false
    }
    if (!/[A-Z]/.test(password)) {
        return false
    }
    if (!/[a-z]/.test(password)) {
        return false
    }
    if (!/[0-9]/.test(password)) {
        return false
    }
    if (!/[!@#?]/.test(password)) {
        return false
    }
    return true;
}

const checkValidUser = (user) => {
    return user.length >= 1 && user.length <= 16;
}

export {checkStartAndExit, checkValidUser, checkValidPass}