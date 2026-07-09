import { describe, it, expect, beforeEach } from "vitest"
import { Player } from "../../engine/models/index.js"

describe("Player", () => {

    let player:Player

    beforeEach(() => {
        player = new Player("John");
    })

    it("should update money", () => {
        player.updateMoney(10)
        expect(player.money).toBe(13)

        player.updateMoney(-14)
        expect(player.money).toBe(-1)
    })

    it("should update the placed tile state", () => {
        player.placeTile();
        expect(player.placedTile).toBe(true);
    })

    it("should remove the placed tile state", () => {
        player.removePlacedTile()
        expect(player.placedTile).toBe(false)
    })

    it("should return the current status uf the placedTile", () => {
        expect(player.hasPlacedTile()).toBe(false)
    })
})