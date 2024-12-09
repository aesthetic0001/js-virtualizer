

// @virtualize
function evaluate(a) {
    switch (a) {
        case 1:
            console.log("a is 1")
            for (let i = 0; i < 10; i++) {
                switch (i) {
                    case 1:
                        console.log(`${i} is 1`)
                        continue
                    case 2:
                        console.log(`${i} is 2`)
                        break
                    default:
                        console.log(`${i} is neither 1 nor 2`)
                        break
                }
            }
            break
        case 2:
            console.log("a is 2")
            break
        case "passthrough":
            console.log("passthrough 1")
        case "passthrough2":
            console.log("passthrough 2")
        case "stop":
            console.log("stop")
            break
        default:
            console.log("a is neither 1 nor 2")
            break
    }
}

evaluate(1)
evaluate(2)
evaluate("passthrough")
evaluate("passthrough2")
evaluate("stop")
