/// <reference path="../../src/plugin/init.tsx" />


(
 /**
 * @param {import("../../src/plugin/init.tsx").Roarer} Roarer
 */
 async (Roarer) => {
  /// <reference path="roarer.d.ts" />

  class ExamplePlugin extends Roarer.RoarerPlugin {
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

  Roarer.plugins.register(new ExamplePlugin());
})(
  // @ts-ignore
  window.Roarer,
);

console.log("");
