

module.exports = {
    calculatePoints(actual) {
        if(actual <= 9) {
            return 20 - ((10 - actual) * 2)
        } else if(actual === 10) {
            return 20
        } else {
            return 20 - ((actual - 10) * 2)
        }
    }
}