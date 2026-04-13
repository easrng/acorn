// Tests for ECMAScript Next `import.source` `import.defer`

if (typeof exports !== "undefined") {
  var test = require("./driver.js").test;
  var testFail = require("./driver.js").testFail;
}

test(
  "import.defer('a')",
  {},
  { ecmaVersion: 11, sourceType: "module" }
);

test(
  "import.source('b')",
  {},
  { ecmaVersion: 11, sourceType: "script" }
);

testFail("import.source", "'import.source' must be used in a dynamic import expression (1:7)", { ecmaVersion: 11, sourceType: "module" });
testFail("new import.defer('a')", "'import.defer' must be used in a dynamic import expression (1:11)", { ecmaVersion: 11, sourceType: "module" });
