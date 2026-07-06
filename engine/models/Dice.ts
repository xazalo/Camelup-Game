import { Colors } from "../enums/index.js"
import { type DiceValue } from "../types/DiceValue.js";

export default class Dice {
    color: Colors;
    number: DiceValue;

    constructor(color: Colors, number: DiceValue) {
        this.color = color;
        this.number = number;
    }
}