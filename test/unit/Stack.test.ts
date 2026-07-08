import { describe, it, expect, beforeEach } from "vitest";

import Stack from "../../engine/models/Stack.js";
import Camel from "../../engine/models/Camel.js";

import { Colors } from "../../engine/enums/index.js";

describe("Stack", () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe("constructor", () => {
    it("should create an empty stack", () => {
      expect(stack.camels).toEqual([]);
    });

    it("should create a tile", () => {
      expect(stack.tile).toBeDefined();
    });
  });

  describe("addCamel", () => {
    it("should add a camel to the stack", () => {
      const camel = new Camel(Colors.Green);

      stack.addCamel(camel);

      expect(stack.camels).toEqual([camel]);
    });

    it("should preserve insertion order", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);

      stack.addCamel(green);
      stack.addCamel(blue);

      expect(stack.camels).toEqual([
        green,
        blue,
      ]);
    });
  });

  describe("addCamels", () => {
    it("should add multiple camels preserving order", () => {
      const camels = [
        new Camel(Colors.Green),
        new Camel(Colors.Blue),
        new Camel(Colors.Red),
      ];

      stack.addCamels(camels);

      expect(stack.camels).toEqual(camels);
    });

    it("should append camels to an existing stack", () => {
      const green = new Camel(Colors.Green);

      const newCamels = [
        new Camel(Colors.Blue),
        new Camel(Colors.Red),
      ];

      stack.addCamel(green);
      stack.addCamels(newCamels);

      expect(stack.camels).toEqual([
        green,
        ...newCamels,
      ]);
    });
  });

  describe("removeCamel", () => {
    it("should remove the camel with the given color", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);

      stack.addCamels([
        green,
        blue,
      ]);

      const removed = stack.removeCamel(Colors.Green);

      expect(removed).toBe(green);

      expect(stack.camels).toEqual([
        blue,
      ]);
    });

    it("should return null if camel does not exist", () => {
      const removed = stack.removeCamel(Colors.Red);

      expect(removed).toBeNull();
    });
  });

  describe("removeCamelStack", () => {
    it("should remove the selected camel and all camels above it", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);
      const red = new Camel(Colors.Red);

      stack.addCamels([
        green,
        blue,
        red,
      ]);

      const removed = stack.removeCamelStack(Colors.Blue);

      expect(removed).toEqual([
        blue,
        red,
      ]);

      expect(stack.camels).toEqual([
        green,
      ]);
    });

    it("should remove the entire stack if the bottom camel is selected", () => {
      const green = new Camel(Colors.Green);
      const blue = new Camel(Colors.Blue);

      stack.addCamels([
        green,
        blue,
      ]);

      const removed = stack.removeCamelStack(Colors.Green);

      expect(removed).toEqual([
        green,
        blue,
      ]);

      expect(stack.camels).toEqual([]);
    });

    it("should return an empty array if camel does not exist", () => {
      const removed = stack.removeCamelStack(Colors.Red);

      expect(removed).toEqual([]);
    });
  });
});