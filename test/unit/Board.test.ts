import { describe, it, expect, beforeEach } from "vitest";

import Board from "../../engine/models/Board.js";
import Camel from "../../engine/models/Camel.js";

import { Colors, Directions } from "../../engine/enums/index.js";

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(16);
  });

  describe("constructor", () => {
    it("should create a board with the given size", () => {
      expect(board.spaces).toHaveLength(16);
    });

    it("should initialize every space with an empty stack", () => {
      board.spaces.forEach((space) => {
        expect(space.camels).toHaveLength(0);
      });
    });
  });

  describe("moveCamel", () => {
    it("should move a camel forward", () => {
      const camel = new Camel(Colors.Green);

      board.spaces[0]?.addCamel(camel);

      board.moveCamel(Colors.Green, 3);

      expect(board.spaces[0]?.camels).toHaveLength(0);
      expect(board.spaces[3]?.camels).toContain(camel);
    });

    it("should move a camel backwards", () => {
      const camel = new Camel(Colors.Black);

      camel.direction = Directions.Left;

      board.spaces[5]?.addCamel(camel);

      board.moveCamel(Colors.Black, 2);

      expect(board.spaces[3]?.camels).toContain(camel);
    });

    it("should wrap around the board moving forward", () => {
      const camel = new Camel(Colors.Green);

      board.spaces[15]?.addCamel(camel);

      board.moveCamel(Colors.Green, 2);

      expect(board.spaces[1]?.camels).toContain(camel);
    });

    it("should place a moved camel on top of an existing stack", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);
      const red = new Camel(Colors.Red);

      // Existing stack
      board.spaces[2]?.addCamel(green);
      board.spaces[2]?.addCamel(blue);

      // Moving camel
      board.spaces[0]?.addCamel(red);

      board.moveCamel(Colors.Red, 2);

      expect(board.spaces[2]?.camels.map((c) => c.color)).toEqual([
        Colors.Green,
        Colors.Blue,
        Colors.Red,
      ]);
    });

    it("should wrap around the board moving backwards", () => {
      const camel = new Camel(Colors.Black);

      camel.direction = Directions.Left;

      board.spaces[0]?.addCamel(camel);

      board.moveCamel(Colors.Black, 2);

      expect(board.spaces[14]?.camels).toContain(camel);
    });

    it("should throw if camel does not exist", () => {
      expect(() => board.moveCamel(Colors.Green, 1)).toThrow("Camel");
    });
  });

  describe("moveCamelStack", () => {
    it("should move the selected camel and every camel above it", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);
      const red = new Camel(Colors.Red);

      board.spaces[0]?.addCamel(green);
      board.spaces[0]?.addCamel(blue);
      board.spaces[0]?.addCamel(red);

      board.moveCamelStack(Colors.Blue, 2);

      expect(board.spaces[0]?.camels).toEqual([green]);
      expect(board.spaces[2]?.camels).toEqual([blue, red]);
    });

    it("should move the whole stack if bottom camel moves", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);

      board.spaces[0]?.addCamel(green);
      board.spaces[0]?.addCamel(blue);

      board.moveCamelStack(Colors.Green, 3);

      expect(board.spaces[3]?.camels).toEqual([green, blue]);
    });

    it("should throw if stack camel is not found", () => {
      expect(() => board.moveCamelStack(Colors.Green, 1)).toThrow("Camel");
    });
  });

  describe("findCamelByColor", () => {
    it("should find a camel anywhere on the board", () => {
      const camel = new Camel(Colors.Red);

      board.spaces[8]?.addCamel(camel);

      expect(board.findCamelByColor(Colors.Red)).toBe(camel);
    });

    it("should move only the selected camel", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);

      board.spaces[0]?.addCamel(green);
      board.spaces[0]?.addCamel(blue);

      board.moveCamel(Colors.Green, 2);

      expect(board.spaces[0]?.camels).toEqual([blue]);

      expect(board.spaces[2]?.camels).toEqual([green]);
    });

    it("should preserve stack order after moving", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);
      const red = new Camel(Colors.Red);

      board.spaces[0]?.addCamel(green);
      board.spaces[0]?.addCamel(blue);
      board.spaces[0]?.addCamel(red);

      board.moveCamelStack(Colors.Green, 1);

      expect(board.spaces[1]?.camels.map((c) => c.color)).toEqual([
        Colors.Green,
        Colors.Blue,
        Colors.Red,
      ]);
    });

    it("should throw if camel does not exist", () => {
      expect(() => board.findCamelByColor(Colors.Red)).toThrow("Camel");
    });
  });
});
