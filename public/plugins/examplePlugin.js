/// <reference path="roarer.d.ts" />

(async (Roarer) => {
  /// <reference path="roarer.d.ts" />

  /**
   * @type {import("./roarer.d.ts").waindow}
   */
  // @ts-ignore
  let nwindow = window;

  class ExamplePlugin extends nwindow.RoarerPlugin {
    info() {
      return {
        name: "Example Plugin",
        identifier: "example-plugin",
        version: "1.0.0",
        description: "This is an example plugin.",
        author: "Your Name",
      };
    }
    start() {
      console.log("Example Plugin started!");
    }
    stop() {
      console.log("Example Plugin stopped!");
    }
    settings() {
      return React.createElement("div", null, "Settings");
    }
  }
  Roarer.addPlugin(new ExamplePlugin());
})(nwindow.Roarer);

console.log("");
