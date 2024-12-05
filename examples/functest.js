function a() {
    console.log("ORIGINAL")
}

let b = a

a = () => {
    console.log("MODIFIED")
}

console.log("Calling b")
b()
console.log("Calling a")
a()
