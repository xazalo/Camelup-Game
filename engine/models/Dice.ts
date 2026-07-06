import { Colors } from "../enums/index.js"
import { type DiceValue } from "../types/DiceValue.js";

/**
 * This class defines a dice, in this game there are dices whit different colors,
 * like blue, yellow..., each dice represent one camel.
 * 
 * @param {color} Colors, The color of the dice and the camel.
 * 
 * @param {number} DiceValue, The value of the dice, always between 1 and 3. 
 */

export default class Dice {
    color: Colors;
    number: DiceValue;

    constructor(color: Colors, number: DiceValue) {
        this.color = color;
        this.number = number;
    }
}