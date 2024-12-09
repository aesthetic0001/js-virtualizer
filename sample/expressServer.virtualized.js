const express = require('express');
const axios = require('axios');
const JSVM = require('../src/vm_dev');
async function onGetProxy(req, res) {
    const VM = new JSVM();
    VM.loadFromString('eJxtj7EKwjAQhq8aRahEECzp1i7S8SaHvoCTmy8QaBBBRZN0cJBuzt52PkDeU9KCU7f/v/+O7z9BADB7tMY+Fb9IRDtt7UUhU1bjjuot0TpO3302d1771inuaBF9MkEAgEnotQRIPjmhrBBDytSRYAAQztwahcQL7tdCfyKjFiUAbA5n5863U9HaS3HXVl+NNzbnUFYhyBSZOPsmQ7eT8YqPI/CcsI7YJdORstXwykAeLSsiXzTaa1WuZE5Y/kvvf/uWQIs=', 'base64');
    VM.loadDependencies({
        84: axios,
        125: req,
        127: res
    });
    await VM.runAsync();
    return VM.registers[153];
}
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJxtjjEKwkAURMd1kUA+YiWuIKQJiTbp06UQm71EkCURVrPoinoAySksvUEKz+JJ0kU2gpXNDAPvz3yPAIBFvUoAA/9JjKYZMQL817Qh7pBhoewsyshzgfUk2NvxnAMYJeZYXW+CJI+lfAuSF+d+RNn3fqR3J6sO/ysEycbhEwAlV25OV8Xs3CrPhQELe3bZz90BrNbXfG+0CnJjgm/z7lAEuQ1Ka02aJLra5rqsTjaN5/dGqHAeh+HSP6tWLfhm3HXdo+ZgbSNI1r9PPy4RONY=', 'base64');
    VM.loadDependencies({
        119: onGetProxy,
        165: express,
        248: console
    });
    VM.run();
    return VM.registers[120];
}
main();
