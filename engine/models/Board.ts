import { Stack } from "./index.js"

export default class Board {
    spaces: Stack[];

    constructor(size: number) {
        this.spaces = Array.from({length: size}, () => new Stack())
    }
}