class Reference {
    constructor(value) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
    }

    read() {
        return this.value;
    }

    write(value) {
        this.value = value;
    }

    toString() {
        return this.value.toString();
    }

    valueOf() {
        return this.value;
    }

    static from(value) {
        return new Reference(value);
    }
}

module.exports = Reference;
