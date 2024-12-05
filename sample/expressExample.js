const express = require('express');
const JSVM = require('../src/vm');

// @virtualize
function main() {
    const app = express();
    const port = 3000;

    function onGet(req, res) {
        res.send('Hello World!')
    }

    function onListen() {
        console.log("Example app listening at http://localhost:" + port)
    }

    function onGetLoop(req, res) {
        const params = req.query
        let times = params.times
        if (!times) {
            times = 10
        }
        let word = "bottles";
        const result = []
        while (times > 0) {
            result.push(times + " " + word + " of beer on the wall")
            result.push(times + " " + word + " of beer")
            result.push("Take one down, pass it around")
            if (times === 1) {
                word = "bottle";
            }

            times = times - 1;
            if (times > 0) {
                result.push(times + " " + word + " of beer on the wall")
            } else {
                result.push("No more " + word + " of beer on the wall")
            }
        }
        res.send(result.join(', '))
    }

    app.get('/', onGet)
    app.get('/bottlesOfBeer', onGetLoop)

    app.listen(port, onListen)
}

main()
