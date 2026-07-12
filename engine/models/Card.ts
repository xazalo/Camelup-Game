import { Camel } from "./index.js";
import { BetType } from "../enums/index.js";
import { type PayoutTable } from "../types/PayoutTables.js";

/**
 * This class represents the cards within the game, they can be purchased for
 * the players, there are three kinds of bets defined in BetType enum
 *
 * @param {type} string, Define the bet type of the card.
 *
 * @param {camel} Camel, Define the camel which is the subject of the bet
 *
 *  @param {payout} PayoutTable, This param define the reward related to the
 *                              position of the card.
 *
 */

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
