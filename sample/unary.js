

// @virtualize
function evaluate() {
    const value = Math.random()
    console.log("Not true", !true)
    console.log("Not false", !false)
    console.log("Not 0", !0)
    console.log("Not 1", !1)
    return 1;
}

console.log(evaluate());
