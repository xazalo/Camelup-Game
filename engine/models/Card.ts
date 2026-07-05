import {Camel} from "./index.js"

type PayoutTable = {
    [position: number]: number;
};

enum BetType {
    TurnWinner,
    GameWinner,
    GameLoser
}

export default class Card {
    type: BetType;
    camel: Camel;

    payouts: PayoutTable;

    constructor(type: BetType, camel: Camel, payouts: PayoutTable) {
        this.type = type;
        this.camel = camel;
        this.payouts = payouts;
    }
}