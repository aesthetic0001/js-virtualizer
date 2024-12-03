// simulate for of

const thing = ["a", "b", "c"]

const iterator = thing[Symbol.iterator]()
let next = iterator.next()
while (!next.done) {
    console.log(next.value)
    console.log(next)
    next = iterator.next()
}

// simulate for in

const obj = [1,2,3];

for (const i in obj) {
    console.log(i)
}

Object.getOwnPropertyNames(obj).forEach((key) => {
    console.log(key, obj[key]);
});
