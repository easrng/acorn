/* eslint-disable */
import { readFileSync, writeFileSync } from "node:fs";
import Babel from "@babel/standalone";
let rawSource = readFileSync("acorn/dist/acorn.mjs", "utf-8");

const functionalRefactorPlugin = ({ types: t }) => {
  return {
    visitor: {
      Program(path) {
        // --- New Stage: Flatten types$1 and update object literal ---
        path.traverse({
          VariableDeclaration(varPath) {
            // Only target top-level declarations
            if (!t.isProgram(varPath.parent)) return;

            varPath.get("declarations").forEach(declPath => {
              const init = declPath.node.init;
              const id = declPath.node.id
              if (!t.isIdentifier(id)) return;
              if (!t.isObjectExpression(init)) return;

              const properties = init.properties;
              const keys = properties.map(p => (t.isIdentifier(p.key) ? p.key.name : null));

              // Identify the target object by its unique keys
              if (keys.includes("_null") && keys.includes("dollarBraceL")) {
                const newVars = [];

                // 1. Generate individual tt_ variables for every property
                properties.forEach(prop => {
                  if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) return;

                  const originalKey = prop.key.name;
                  const newVarName = `tt_${originalKey}`;
                  const originalValue = prop.value;

                  // Add to the list of declarations we will insert before the object
                  newVars.push(
                    t.variableDeclarator(t.identifier(newVarName), originalValue)
                  );

                  // 2. Replace the value in the object literal with a reference to the new variable
                  prop.value = t.identifier(newVarName);
                });

                const binding = varPath.scope.getBinding(id.name);
                if (binding) {
                  binding.referencePaths.forEach(refPath => {
                    const parent = refPath.parentPath;

                    // If it's used as obj.prop
                    if (parent.isMemberExpression() && parent.node.object === refPath.node) {
                      const propName = parent.node.property.name;
                      parent.replaceWith(t.identifier("tt_" + propName));
                    }
                  });
                }

                // 3. Insert the individual variable declarations immediately before the object literal
                varPath.insertBefore(t.variableDeclaration("var", newVars));
              }
            });
          }
        });

        let aliasName = null;
        // Keep track of what we transformed to validate later
        const transformedMethods = new Set();

        // Phase 1: Identify the alias (pp or similar) and unify
        path.traverse({
          VariableDeclarator(declPath) {
            const init = declPath.node.init;
            const isParserProto =
              t.isMemberExpression(init) &&
              t.isIdentifier(init.object, { name: "Parser" }) &&
              t.isIdentifier(init.property, { name: "prototype" });

            if (isParserProto) {
              const currentName = declPath.node.id.name;
              if (!aliasName) {
                aliasName = currentName;
                console.log(`Using alias: "${aliasName}"`);
              } else if (currentName !== aliasName) {
                declPath.scope.rename(currentName, aliasName);
                declPath.remove();
              }
            }
          },
        });

        if (!aliasName) {
          console.warn("No Parser.prototype alias found.");
          return;
        }

        const transformThisCallsVisitor = {
          CallExpression(callPath) {
            const callee = callPath.node.callee;
            if (
              t.isMemberExpression(callee) &&
              t.isThisExpression(callee.object) &&
              t.isIdentifier(callee.property)
            ) {
              const method = callee.property.name;
              callPath.node.callee = t.identifier(`pp_${method}`);
              callPath.node.arguments.unshift(t.thisExpression());
            }
          },
        };

        // Helper to find "updateContext"
        function isUpdateContextNode(node) {
          if (!node) return false;
          if (t.isIdentifier(node, { name: "updateContext" })) return true;
          if (t.isStringLiteral(node, { value: "updateContext" })) return true;
          if (t.isMemberExpression(node)) {
            return (
              isUpdateContextNode(node.object) ||
              isUpdateContextNode(node.property)
            );
          }
          return false;
        }

        path.traverse({
          VariableDeclarator(varPath) {
            const init = varPath.node.init;
            if (
              t.isFunctionExpression(init) &&
              t.isIdentifier(init.id, { name: "Parser" })
            ) {
              varPath.get("init").traverse(transformThisCallsVisitor);
            }
          },
          AssignmentExpression(assignPath) {
            const left = assignPath.node.left;
            const right = assignPath.node.right;
            if (!assignPath.getStatementParent().isExpressionStatement())
              return;
            if (
              !t.isFunctionExpression(right) &&
              !t.isArrowFunctionExpression(right)
            )
              return;

            const isPrototypeAccessorGet =
              t.isMemberExpression(left) &&
              t.isIdentifier(left.property, { name: "get" }) &&
              t.isMemberExpression(left.object) &&
              t.isIdentifier(left.object.object, {
                name: "prototypeAccessors",
              });

            if (isPrototypeAccessorGet || isUpdateContextNode(left)) {
              assignPath.get("right").traverse(transformThisCallsVisitor);
            }
          },
        });

        // Phase 3: Identify and store prototype method assignments
        const assignments = [];
        path.traverse({
          AssignmentExpression(assignPath) {
            const left = assignPath.node.left;
            const right = assignPath.node.right;

            const isAliasMatch = (node) =>
              t.isMemberExpression(node) &&
              t.isIdentifier(node.object, { name: aliasName }) &&
              t.isIdentifier(node.property);
            const isDirectProtoMatch =
              t.isMemberExpression(left) &&
              t.isMemberExpression(left.object) &&
              t.isIdentifier(left.object.object, { name: "Parser" }) &&
              t.isIdentifier(left.object.property, { name: "prototype" });

            // New logic: Handle pp.a = pp.b
            if (isAliasMatch(left) && isAliasMatch(right)) {
              const newName = `pp_${left.property.name}`;
              const targetName = `pp_${right.property.name}`;

              // Replace the assignment with: var pp_newName = pp_targetName
              assignPath.parentPath.replaceWith(
                t.variableDeclaration("var", [
                  t.variableDeclarator(
                    t.identifier(newName),
                    t.identifier(targetName),
                  ),
                ]),
              );
              transformedMethods.add(left.property.name);
              return; // Move to next
            }

            if (
              (isAliasMatch(left) || isDirectProtoMatch) &&
              t.isIdentifier(left.property) &&
              (t.isFunctionExpression(right) ||
                t.isArrowFunctionExpression(right))
            ) {
              transformedMethods.add(left.property.name); // Track for validation
              assignments.push({
                path: assignPath,
                propertyName: left.property.name,
                func: assignPath.get("right"),
              });
            }
          },
        });

        const decls = []
        assignments.forEach(({ path: assignPath, propertyName, func }) => {
          const newFuncName = `pp_${propertyName}`;
          const selfParam = t.identifier("self");

          func.get("body").traverse({
            ThisExpression(thisPath) {
              const parentPath = thisPath.parentPath;
              const grandParentPath = parentPath && parentPath.parentPath;
              const greatGrandParentPath = grandParentPath && grandParentPath.parentPath;

              if (
                parentPath.isMemberExpression() &&
                grandParentPath.isMemberExpression() && grandParentPath.node.property.name === 'bind' &&
                greatGrandParentPath.isCallExpression()
              ) {
                const methodIdentifier = parentPath.node.property;
                const bindCall = greatGrandParentPath.node;

                if (t.isIdentifier(methodIdentifier) && t.isThisExpression(bindCall.arguments[0])) {
                  // 1. Change this.method.bind to pp_method.bind
                  grandParentPath.get("object").replaceWith(t.identifier(`pp_${methodIdentifier.name}`));

                  // 2. Change .bind(this, ...) to .bind(null, self, ...)
                  bindCall.arguments[0] = t.nullLiteral();
                  bindCall.arguments.splice(1, 0, selfParam);

                  greatGrandParentPath.skip();
                  return;
                }
              }

              if (
                t.isMemberExpression(thisPath.parent) &&
                t.isCallExpression(thisPath.parentPath.parent)
              ) {
                const memberExpr = thisPath.parent;
                const callExpr = thisPath.parentPath.parent;
                if (
                  callExpr.callee === memberExpr &&
                  t.isIdentifier(memberExpr.property)
                ) {
                  const method = memberExpr.property.name;
                  callExpr.callee = t.identifier(`pp_${method}`);
                  callExpr.arguments.unshift(selfParam);
                  thisPath.parentPath.parentPath.skip();
                  return;
                }
              }
              thisPath.replaceWith(selfParam);
            },
            Function(innerFuncPath) {
              if (innerFuncPath.isArrowFunctionExpression()) return
              innerFuncPath.skip();
            },
          });

          if (assignPath.getFunctionParent()) {
            assignPath.node.left = t.identifier(newFuncName)
            assignPath.node.right = t.functionExpression(
              t.identifier("_" + newFuncName),
              [selfParam, ...func.node.params],
              func.node.body,
            )
            decls.push(t.variableDeclaration("var", [
              t.variableDeclarator(
                t.identifier(newFuncName))]))
          } else {
            const funcDecl = t.variableDeclaration("var", [
              t.variableDeclarator(
                t.identifier(newFuncName),
                t.functionExpression(
                  t.identifier("_" + newFuncName),
                  [selfParam, ...func.node.params],
                  func.node.body,
                ),
              ),
            ])

            decls.push(funcDecl)

            assignPath.parentPath.remove();
          }
        });

        path.unshiftContainer("body", decls);

        path.traverse({
          Function(funcPath) {
            const { node } = funcPath;

            // Check for exactly one parameter (e.g., 'p')
            if (node.params.length !== 1 || !t.isIdentifier(node.params[0]))
              return;
            const paramName = node.params[0].name;

            let body = node.body;
            // Handle arrow functions with expression bodies: (p) => p.tryReadTemplateToken()
            if (!t.isBlockStatement(body)) {
              if (isTargetCall(body, paramName)) {
                funcPath.replaceWith(t.identifier("pp_tryReadTemplateToken"));
              }
              return;
            }

            // Handle block bodies: function(p) { return p.tryReadTemplateToken(); }
            if (body.body.length === 1 && t.isReturnStatement(body.body[0])) {
              const argument = body.body[0].argument;
              if (isTargetCall(argument, paramName)) {
                funcPath.replaceWith(t.identifier("pp_tryReadTemplateToken"));
              }
            }
          },
        });

        path.traverse({
          CallExpression(path) {
            const { callee, arguments: args } = path.node;

            // 1. Transform: afterLeftParse.call(...) -> afterLeftParse(...)
            // We check if it's a MemberExpression (object.property) where property is 'call'
            if (
              callee.type === "MemberExpression" &&
              callee.property.type === "Identifier" &&
              callee.property.name === "call" &&
              callee.object.type === "Identifier" &&
              callee.object.name === "afterLeftParse"
            ) {
              // Replace the MemberExpression with just the object (afterLeftParse)
              path.get("callee").replaceWith(callee.object);
              return; // Move to next node
            }

            // 2. Transform: pp_parseMaybeAssign(self, false, refDestructuringErrors, self.parseParenItem)
            // -> pp_parseMaybeAssign(self, false, refDestructuringErrors, pp_parseParenItem)
            if (
              callee.type === "Identifier" &&
              callee.name === "pp_parseMaybeAssign" &&
              args.length === 4
            ) {
              const fourthArg = path.get("arguments")[3];

              // Check if the 4th argument is 'self.parseParenItem'
              if (
                fourthArg.isMemberExpression() &&
                fourthArg.node.object.name === "self" &&
                fourthArg.node.property.name === "parseParenItem"
              ) {
                // Replace the 4th argument with the new Identifier
                fourthArg.replaceWith(t.identifier("pp_parseParenItem"));
              }
            }

            // 3. Transform: new this(options, input).parse() -> pp_parse(new this(options, input))
            if (
              callee.type === "MemberExpression" &&
              callee.property.type === "Identifier" &&
              callee.property.name === "parse" &&
              callee.object.type === "NewExpression"
            ) {
              const newExpr = callee.object; // This is the 'new this(options, input)' part

              // Wrap the NewExpression inside a new call to 'pp_parse'
              path.replaceWith(
                t.callExpression(t.identifier("pp_parse"), [newExpr]),
              );
            }

            // 1. Check if it's a member expression (e.g., obj.method)
            if (t.isMemberExpression(callee)) {
              const TARGET_METHODS = new Set([
                "raiseRecoverable",
                "nextToken",
                "parseExpression",
              ]);
              // 2. Check if the method being called is 'getToken'
              // We use path.get('callee.property').isIdentifier({ name: 'getToken' })
              // to ensure we don't accidentally match computed properties like obj['getToken']
              if (t.isIdentifier(callee.property, { name: "getToken" })) {
                const identifier = callee.object;

                // 3. Replace with pp_getToken(identifier, ...args)
                path.replaceWith(
                  t.callExpression(t.identifier("pp_getToken"), [
                    identifier,
                    ...args,
                  ]),
                );
                // 2. Check if the method is in our target list
              } else if (TARGET_METHODS.has(callee.property.name)) {
                // 3. Validation: Must be 'parser' OR 'this.parser'
                const obj = callee.object;
                const isParser = t.isIdentifier(obj, { name: "parser" });
                const isThisParser =
                  t.isMemberExpression(obj) &&
                  t.isThisExpression(obj.object) &&
                  t.isIdentifier(obj.property, { name: "parser" });

                if (isParser || isThisParser) {
                  path.replaceWith(
                    t.callExpression(
                      t.identifier(`pp_${callee.property.name}`),
                      [obj, ...args],
                    ),
                  );
                }
              }
            }
          },
        });

        // Helper to identify p.tryReadTemplateToken()
        function isTargetCall(node, paramName) {
          return (
            t.isCallExpression(node) &&
            t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object, { name: paramName }) &&
            t.isIdentifier(node.callee.property, {
              name: "tryReadTemplateToken",
            }) &&
            node.arguments.length === 0
          );
        }

        path.traverse({
          MemberExpression(valPath) {
            if (t.isIdentifier(valPath.node.property)) {
              const propName = valPath.node.property.name;

              if (transformedMethods.has(propName)) {
                const parentFunc = valPath.getFunctionParent();
                if (parentFunc) {
                  parentFunc.node.id =
                    parentFunc.node.id || t.identifier("_" + Date.now());
                }
                const funcName =
                  (parentFunc && parentFunc.node.id.name) || "anonymous";

                // 1. ALLOWANCE: pp_updateContext or TokenType
                const isInsideUpdateContext =
                  funcName === "pp_updateContext" || funcName === "TokenType";

                if (
                  propName === "updateContext" &&
                  (isInsideUpdateContext || valPath.isMemberExpression())
                ) {
                  return;
                }

                // 2. NEW ALLOWANCE: pp_regexp_* allowing state.eat and state.raise
                const isInsideRegexp = funcName.startsWith("_pp_regexp_");
                const isStateObject = t.isIdentifier(valPath.node.object, {
                  name: "state",
                });
                const isAllowedRegexpMethod =
                  propName === "eat" || propName === "raise";

                if (isInsideRegexp && isStateObject && isAllowedRegexpMethod) {
                  return; // Valid literal state.eat/raise in regexp helpers
                }

                const isParserObject = t.isIdentifier(valPath.node.object, {
                  name: "Parser",
                });
                if (propName === "parse" && isParserObject) {
                  return;
                }

                if (valPath.parentPath.isAssignmentExpression()) return;

                // --- Failure Reporting ---
                const { line, column } = valPath.node.loc && valPath.node.loc.start || {
                  line: "?",
                  column: "?",
                };
                console.error(
                  `[VALIDATION FAILURE] Unconverted access: "${propName}" at ${line}:${column} in function "${funcName}" with parent "${valPath.parent.type}".`,
                );
              }
            }
          },
        });

        console.log("Refactoring complete.");
      },
    },
  };
};

const result = Babel.transform(rawSource, {
  filename: "acorn.js",
  sourceType: "module",
  plugins: [["transform-classes", {
    "loose": true
  }], functionalRefactorPlugin],
  generatorOpts: { retainLines: false, comments: true },
});

writeFileSync("acorn/dist/acorn-functional.mjs", result.code);
