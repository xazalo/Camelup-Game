import { describe, it, expect } from "vitest"
import HelpController from "../../cli/controllers/HelpController.js"

const helpController = new HelpController();

describe("HelpController", () => {

    it("should return the instructions whit the commands", () => {
        const result =  helpController.showHelp();
        expect(typeof result).toBe("string")
    })

})