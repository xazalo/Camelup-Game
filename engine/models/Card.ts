import { Camel } from "./index.js";
import { BetType } from "../enums/index.js"

type PayoutTable = {
  [position: number]: number;
};

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
