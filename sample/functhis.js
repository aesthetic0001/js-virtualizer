

// @virtualize
function random() {
    return Math.random().toString().slice(2, 5).split('').map(Number)
}

console.log(random())
