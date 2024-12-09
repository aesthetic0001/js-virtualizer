const express = require('express');
const axios = require('axios');

// @virtualize
async function onGetProxy(req, res) {
    const url = req.query.url;
    if (!url) {
        res.status(400).send('Missing url parameter');
        return;
    }

    const response = await axios.get(url);
    res.send(response.data);
}

// @virtualize
function main() {
    const app = express();
    const port = 3000;

    app.get('/proxy', onGetProxy);

    app.listen(port, () => {
        console.log("Example app listening at http://localhost:" + port)
    })
}

main()
