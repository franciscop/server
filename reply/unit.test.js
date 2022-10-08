const reply = require(".");

describe("reply", () => {
  it("loads the main reply", () => {
    expect(JSON.stringify(reply)).toEqual(
      JSON.stringify(require("server").reply)
    );
    expect(JSON.stringify(reply)).toEqual(
      JSON.stringify(require("server/reply"))
    );
  });

  it("has the right methods defined", () => {
    expect(reply.cookie).toEqual(jasmine.any(Function));
    expect(reply.download).toEqual(jasmine.any(Function));
    expect(reply.end).toEqual(jasmine.any(Function));
    expect(reply.file).toEqual(jasmine.any(Function));
    expect(reply.header).toEqual(jasmine.any(Function));
    expect(reply.json).toEqual(jasmine.any(Function));
    expect(reply.jsonp).toEqual(jasmine.any(Function));
    expect(reply.redirect).toEqual(jasmine.any(Function));
    expect(reply.render).toEqual(jasmine.any(Function));
    expect(reply.send).toEqual(jasmine.any(Function));
    expect(reply.status).toEqual(jasmine.any(Function));
    expect(reply.type).toEqual(jasmine.any(Function));
  });

  it("can load all the methods manually", () => {
    expect(typeof require("server/reply/cookie")).toBe("function");
    expect(typeof require("server/reply/download")).toBe("function");
    expect(typeof require("server/reply/end")).toBe("function");
    expect(typeof require("server/reply/file")).toBe("function");
    expect(typeof require("server/reply/header")).toBe("function");
    expect(typeof require("server/reply/json")).toBe("function");
    expect(typeof require("server/reply/jsonp")).toBe("function");
    expect(typeof require("server/reply/redirect")).toBe("function");
    expect(typeof require("server/reply/render")).toBe("function");
    expect(typeof require("server/reply/send")).toBe("function");
    expect(typeof require("server/reply/status")).toBe("function");
    expect(typeof require("server/reply/type")).toBe("function");
  });

  describe("reply: instances instead of global", () => {
    it("adds a method to the stack", () => {
      const mock = reply.file("./index.js");
      expect(mock.stack.length).toEqual(1);
      const inst = reply.file("./index.js");
      expect(inst.stack.length).toEqual(1);

      // Do not touch the global
      expect(mock.stack.length).toEqual(1);
    });

    it("adds several methods correctly", () => {
      const mock = reply.file("./index.js");
      expect(mock.stack.length).toEqual(1);
      const inst = reply.file("./index.js").file("./whatever.js");
      expect(inst.stack.length).toEqual(2);

      // Do not touch the global
      expect(mock.stack.length).toEqual(1);
    });
  });
});
