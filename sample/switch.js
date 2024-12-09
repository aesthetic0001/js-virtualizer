function evaluate() {
    const a = 1
    switch (a) {
        case 1:
            for (let i = 0; i < 10; i++) {
                console.log(i)
                switch (i) {
                    case 1:
                        continue
                    default:
                        console.log("i is not 1")
                }
            }
            break
        case 2:
            console.log("a is 2")
            break
        default:
            console.log("a is neither 1 nor 2")
            break
    }
}

evaluate()
