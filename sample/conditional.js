// @virtualize
function evaluate() {
    const value1 = false ? 0.5 : 1
    console.log("Selected value:", value1)
    const value2 = false ? value1 : 0.5
    console.log("Selected value:", value2)
    const output = value1 + value2 > 1.5 ? "Greater than 1.5" : "Less than or equal to 1.5"
    console.log(output)
}

evaluate()
