// @ts-check
/* eslint-disable camelcase */

import { isIdentifierChar, isIdentifierStart } from "./identifier.js"
import { Parser } from "./state.js"
import { TokContext, types as tokContexts } from "./tokencontext.js"
import {
  TokenType,
  keywords as keywordTypes,
  types as tokTypes,
} from "./tokentype.js"
import { isNewLine, lineBreak } from "./whitespace.js"
function enableExt() {
  let TS_SCOPE_OTHER = 512
  let TS_SCOPE_TS_MODULE = 1024
  // let BIND_KIND_VALUE = 1
  // let BIND_KIND_TYPE = 2
  // let BIND_SCOPE_VAR = 4
  // let BIND_SCOPE_LEXICAL = 8
  // let BIND_SCOPE_FUNCTION = 16
  // let BIND_FLAGS_NONE = 64
  // let BIND_FLAGS_CLASS = 128
  // let BIND_FLAGS_TS_ENUM = 256
  // let BIND_FLAGS_TS_CONST_ENUM = 512
  let BIND_FLAGS_TS_EXPORT_ONLY = 1024
  // let BIND_CLASS = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_CLASS
  // let BIND_LEXICAL = BIND_KIND_VALUE | 0 | BIND_SCOPE_LEXICAL | 0
  // let BIND_VAR = BIND_KIND_VALUE | 0 | BIND_SCOPE_VAR | 0
  // let BIND_FUNCTION = BIND_KIND_VALUE | 0 | BIND_SCOPE_FUNCTION | 0
  // let BIND_TS_INTERFACE = 0 | BIND_KIND_TYPE | 0 | BIND_FLAGS_CLASS
  // let BIND_TS_TYPE = 0 | BIND_KIND_TYPE | 0 | 0
  // let BIND_TS_ENUM = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_TS_ENUM
  let BIND_TS_AMBIENT = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY
  // let BIND_NONE = 0 | 0 | 0 | BIND_FLAGS_NONE
  // let BIND_OUTSIDE = BIND_KIND_VALUE | 0 | 0 | BIND_FLAGS_NONE
  // let BIND_TS_CONST_ENUM = BIND_TS_ENUM | BIND_FLAGS_TS_CONST_ENUM
  // let BIND_TS_NAMESPACE = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY
  // let CLASS_ELEMENT_FLAG_STATIC = 4
  // let CLASS_ELEMENT_KIND_GETTER = 2
  // let CLASS_ELEMENT_KIND_SETTER = 1
  // let CLASS_ELEMENT_KIND_ACCESSOR = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_KIND_SETTER
  // let CLASS_ELEMENT_STATIC_GETTER = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_FLAG_STATIC
  // let CLASS_ELEMENT_STATIC_SETTER = CLASS_ELEMENT_KIND_SETTER | CLASS_ELEMENT_FLAG_STATIC

  // src/whitespace.ts
  let skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/y
  let skipWhiteSpaceToLineBreak = new RegExp(
    // Unfortunately JS doesn't support Perl's atomic /(?>pattern)/ or
    // possessive quantifiers, so we use a trick to prevent backtracking
    // when the look-ahead for line terminator fails.
    "(?=(" +
    // Capture the whitespace and comments that should be skipped inside
    // a look-ahead assertion, and then re-match the group as a unit.
    skipWhiteSpaceInLine.source +
    "))\\1" +
    // Look-ahead for either line terminator, start of multi-line comment,
    // or end of string.
    /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source,
    "y"
    // sticky
  )

  // src/parseutil.ts
  let DestructuringErrors = class {
    constructor() {
      this.shorthandAssign =
        this.trailingComma =
        this.parenthesizedAssign =
        this.parenthesizedBind =
        this.doubleProto =
        -1
    }
  }
  /**
   * @param {{ [x: string]: string; }} privateNameMap
   * @param {{ key: { name: any; }; type: string; kind: string; static: any; }} element
   */
  function isPrivateNameConflicted(privateNameMap, element) {
    const name = element.key.name
    const curr = privateNameMap[name]
    let next = "true"
    if (
      element.type === "MethodDefinition" &&
      (element.kind === "get" || element.kind === "set")
    ) {
      next = (element.static ? "s" : "i") + element.kind
    }
    if (
      (curr === "iget" && next === "iset") ||
      (curr === "iset" && next === "iget") ||
      (curr === "sget" && next === "sset") ||
      (curr === "sset" && next === "sget")
    ) {
      privateNameMap[name] = "true"
      return false
    } else if (!curr) {
      privateNameMap[name] = next
      return false
    } else {
      return true
    }
  }
  /**
   * @param {{ computed: any; key: any; }} node
   * @param {string} name
   */
  function checkKeyName(node, name) {
    const { computed, key } = node
    return (
      !computed &&
      ((key.type === "Identifier" && key.name === name) ||
        (key.type === "Literal" && key.value === name))
    )
  }

  // src/error.ts
  let AbstractMethodHasImplementation = (/** @type {{ methodName: string; }} */ { methodName }) =>
    `Method '${methodName}' cannot have an implementation because it is marked abstract.`
  let AbstractPropertyHasInitializer = (/** @type {{ propertyName: string; }} */ { propertyName }) =>
    `Property '${propertyName}' cannot have an initializer because it is marked abstract.`
  let AccesorCannotDeclareThisParameter =
    "'get' and 'set' accessors cannot declare 'this' parameters."
  let AccesorCannotHaveTypeParameters =
    "An accessor cannot have type parameters."
  let CannotFindName = (/** @type {{ name: string; }} */ { name }) => `Cannot find name '${name}'.`
  let ClassMethodHasDeclare = "Class methods cannot have the 'declare' modifier."
  let ClassMethodHasReadonly =
    "Class methods cannot have the 'readonly' modifier."
  let ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference =
    "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference."
  let ConstructorHasTypeParameters =
    "Type parameters cannot appear on a constructor declaration."
  let DeclareAccessor = (/** @type {{ kind: string; }} */ { kind }) => `'declare' is not allowed in ${kind}ters.`
  let DeclareClassFieldHasInitializer =
    "Initializers are not allowed in ambient contexts."
  let DeclareFunctionHasImplementation =
    "An implementation cannot be declared in ambient contexts."
  let DuplicateAccessibilityModifier = () =>
    "Accessibility modifier already seen."
  let DuplicateModifier = (/** @type {{ modifier: string; }} */ { modifier }) => `Duplicate modifier: '${modifier}'.`
  let EmptyHeritageClauseType = (/** @type {{ token: string; }} */ { token }) => `'${token}' list cannot be empty.`
  let EmptyTypeArguments = "Type argument list cannot be empty."
  let EmptyTypeParameters = "Type parameter list cannot be empty."
  let ExpectedAmbientAfterExportDeclare =
    "'export declare' must be followed by an ambient declaration."
  let ImportAliasHasImportType = "An import alias can not use 'import type'."
  let IncompatibleModifiers = (/** @type {{ modifiers: [string, string] }} */ { modifiers }) =>
    `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`
  let IndexSignatureHasAbstract =
    "Index signatures cannot have the 'abstract' modifier."
  let IndexSignatureHasAccessibility = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `Index signatures cannot have an accessibility modifier ('${modifier}').`
  let IndexSignatureHasDeclare =
    "Index signatures cannot have the 'declare' modifier."
  let IndexSignatureHasOverride =
    "'override' modifier cannot appear on an index signature."
  let InitializerNotAllowedInAmbientContext =
    "Initializers are not allowed in ambient contexts."
  let InvalidModifierOnTypeMember = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `'${modifier}' modifier cannot appear on a type member.`
  let InvalidModifierOnTypeParameter = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `'${modifier}' modifier cannot appear on a type parameter.`
  let InvalidModifierOnTypeParameterPositions = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`
  let InvalidModifiersOrder = (/** @type {{ orderedModifiers: [string, string]; }} */ { orderedModifiers }) =>
    `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`
  let InvalidPropertyAccessAfterInstantiationExpression =
    "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments."
  let InvalidTupleMemberLabel =
    "Tuple members must be labeled with a simple identifier."
  let MissingInterfaceName =
    "'interface' declarations must be followed by an identifier."
  let NonAbstractClassHasAbstractMethod =
    "Abstract methods can only appear within an abstract class."
  let OptionalTypeBeforeRequired =
    "A required element cannot follow an optional element."
  let OverrideNotInSubClass =
    "This member cannot have an 'override' modifier because its containing class does not extend another class."
  let PatternIsOptional =
    "A binding pattern parameter cannot be optional in an implementation signature."
  let PrivateElementHasAbstract =
    "Private elements cannot have the 'abstract' modifier."
  let PrivateElementHasAccessibility = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `Private elements cannot have an accessibility modifier ('${modifier}').`
  let PrivateMethodsHasAccessibility = (/** @type {{ modifier: string; }} */ { modifier }) =>
    `Private methods cannot have an accessibility modifier ('${modifier}').`
  let ReadonlyForMethodSignature =
    "'readonly' modifier can only appear on a property declaration or index signature."
  let ReservedArrowTypeParam =
    "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`."
  let ReservedTypeAssertion =
    "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead."
  let SetAccesorCannotHaveOptionalParameter =
    "A 'set' accessor cannot have an optional parameter."
  let SetAccesorCannotHaveRestParameter =
    "A 'set' accessor cannot have rest parameter."
  let SetAccesorCannotHaveReturnType =
    "A 'set' accessor cannot have a return type annotation."
  let StaticBlockCannotHaveModifier =
    "Static class blocks cannot have any modifier."
  let TypeAnnotationAfterAssign =
    "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`."
  let TypeImportCannotSpecifyDefaultAndNamed =
    "A type-only import can specify a default import or named bindings, but not both."
  let TypeModifierIsUsedInTypeExports =
    "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement."
  let TypeModifierIsUsedInTypeImports =
    "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement."
  let UnexpectedParameterModifier =
    "A parameter property is only allowed in a constructor implementation."
  let UnexpectedReadonly =
    "'readonly' type modifier is only permitted on array and tuple literal types."
  let UnexpectedTypeAnnotation = "Did not expect a type annotation here."
  let UnsupportedImportTypeArgument =
    "Argument in a type import must be a string literal."
  let UnsupportedParameterPropertyKind =
    "A parameter property may not be declared using a binding pattern."
  let UnsupportedSignatureParameterKind = (/** @type {{ type: string; }} */ { type }) =>
    `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`
  let UnexpectedLeadingDecorator =
    "Leading decorators must be attached to a class declaration."
  let DecoratorConstructor =
    "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?"
  let TrailingDecorator = "Decorators must be attached to a class element."
  let SpreadElementDecorator = "Decorators can't be used with SpreadElement"
  let keywordTypeValues = Object.values(keywordTypes)
  let tsTokenType = generateTsTokenType()
  let tsTokenContext = generateTsTokenContext()
  let tsKeywordsRegExp =
    /^(?:assert|asserts|global|keyof|readonly|unique|abstract|declare|enum|module|namespace|interface|type)$/
  tsTokenType.jsxTagStart.updateContext = function () {
    this.context.push(tsTokenContext.tc_expr)
    this.context.push(tsTokenContext.tc_oTag)
    this.exprAllowed = false
  }
  tsTokenType.jsxTagEnd.updateContext = function (prevType) {
    let out = this.context.pop()
    if (
      (out === tsTokenContext.tc_oTag && prevType === tokTypes.slash) ||
      out === tsTokenContext.tc_cTag
    ) {
      this.context.pop()
      this.exprAllowed = this.curContext() === tsTokenContext.tc_expr
    } else {
      this.exprAllowed = true
    }
  }
  /**
   * @param {TokenType} token
   */
  function tokenIsLiteralPropertyName(token) {
    return (
      token === tokTypes.name ||
      token === tokTypes.string ||
      token === tokTypes.num ||
      keywordTypeValues.includes(token)
    )
  }
  /**
   * @param {TokenType} token
   */
  function tokenIsKeywordOrIdentifier(token) {
    return token === tokTypes.name || keywordTypeValues.includes(token)
  }
  /**
   * @param {TokenType} token
   */
  function tokenIsIdentifier(token) {
    return token === tokTypes.name
  }
  /**
   * @param {string} token
   */
  function tokenIsTSDeclarationStart(token) {
    return (
      token === "abstract" ||
      token === "declare" ||
      token === "enum" ||
      token === "module" ||
      token === "namespace" ||
      token === "interface" ||
      token === "type"
    )
  }
  /**
   * @param {string} token
   */
  function tokenIsTSTypeOperator(token) {
    return token === "keyof" || token === "readonly" || token === "unique"
  }
  /**
   * @param {TokenType} token
   */
  function tokenIsTemplate(token) {
    return token === tokTypes.invalidTemplate
  }
  function generateTsTokenContext() {
    return {
      tc_oTag: new TokContext("<tag", false, false),
      tc_cTag: new TokContext("</tag", false, false),
      tc_expr: new TokContext("<tag>...</tag>", true, true),
    }
  }
  function generateTsTokenType() {
    return {
      at: new TokenType("@"),
      jsxName: new TokenType("jsxName"),
      jsxText: new TokenType("jsxText", {
        beforeExpr: true,
      }),
      jsxTagStart: new TokenType("jsxTagStart", {
        startsExpr: true,
      }),
      jsxTagEnd: new TokenType("jsxTagEnd"),
    }
  }
  let
    tokTypes2 = tsTokenType,
    tokContexts3 = tsTokenContext,
    keywordsRegExp = tsKeywordsRegExp

  // src/entities.ts
  let entities_default = /* @__PURE__ */ ((/** @type {Record<string, string>} */entities, charCode) => {
    "quot,3,amp,apos,20,lt,1,gt,97,nbsp,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,times,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,divide,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,82,OElig,oelig,12,Scaron,scaron,22,Yuml,25,fnof,307,circ,21,tilde,180,Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,1,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,7,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,7,thetasym,upsih,3,piv,7211,ensp,emsp,5,thinsp,2,zwnj,zwj,lrm,rlm,3,ndash,mdash,3,lsquo,rsquo,sbquo,1,ldquo,rdquo,bdquo,1,dagger,Dagger,bull,3,hellip,9,permil,1,prime,Prime,5,lsaquo,rsaquo,3,oline,5,frasl,103,euro,100,image,6,weierp,3,real,5,trade,18,alefsym,90,larr,uarr,rarr,darr,harr,32,crarr,26,lArr,uArr,rArr,dArr,hArr,43,forall,1,part,exist,1,empty,1,nabla,isin,notin,1,ni,3,prod,1,sum,minus,4,lowast,2,radic,2,prop,infin,1,ang,6,and,or,cap,cup,int,8,there4,7,sim,8,cong,2,asymp,23,ne,equiv,2,le,ge,28,sub,sup,nsub,1,sube,supe,13,oplus,1,otimes,13,perp,31,sdot,66,lceil,rceil,lfloor,rfloor,29,lang,rang,671,loz,149,spades,2,clubs,1,hearts,diams"
      .split(",")
      .forEach((v) =>
        v > "A"
          ? (entities[v] = String.fromCharCode(++charCode))
          : (charCode += +v)
      )
    return entities
  })({}, 33)

  // src/index.ts
  let hexNumber = /^[\da-fA-F]+$/
  let decimalNumber = /^\d+$/
  /**
   * @param {import("./acorn.js").Node} object
   * @returns {string | undefined}
   */
  function getQualifiedJSXName(object) {
    if (!object) return
    if (object.type === "JSXIdentifier") return object.name
    if (object.type === "JSXNamespacedName")
      return object.namespace.name + ":" + object.name.name
    if (object.type === "JSXMemberExpression")
      return (
        getQualifiedJSXName(object.object) +
        "." +
        getQualifiedJSXName(object.property)
      )
  }
  let skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g
  /**
   * @param {boolean} x
   */
  function assert(x) {
    if (!x) {
      throw new Error("Assert fail")
    }
  }
  /**
   * @param {string} modifier
   */
  function tsIsClassAccessor(modifier) {
    return modifier === "accessor"
  }
  /**
   * @param {string} modifier
   */
  function tsIsVarianceAnnotations(modifier) {
    return modifier === "in" || modifier === "out"
  }
  let FUNC_STATEMENT = 1
  let FUNC_HANGING_STATEMENT = 2
  let FUNC_NULLABLE_ID = 4
  const acornScope_SCOPE_TOP = 1;
  const acornScope_SCOPE_FUNCTION = 2;
  const acornScope_SCOPE_ASYNC = 4;
  const acornScope_SCOPE_GENERATOR = 8;
  const acornScope_SCOPE_ARROW = 16;
  const acornScope_SCOPE_SIMPLE_CATCH = 32;
  const acornScope_SCOPE_SUPER = 64;
  const acornScope_SCOPE_DIRECT_SUPER = 128;
  const acornScope_SCOPE_CLASS_STATIC_BLOCK = 256;
  const acornScope_SCOPE_VAR = 256;
  const acornScope_BIND_NONE = 0;
  const acornScope_BIND_VAR = 1;
  const acornScope_BIND_LEXICAL = 2;
  const acornScope_BIND_FUNCTION = 3;
  const acornScope_BIND_SIMPLE_CATCH = 4;
  const acornScope_BIND_OUTSIDE = 5;
  const acornScope_BIND_TS_TYPE = 6;
  const acornScope_BIND_TS_INTERFACE = 7;
  const acornScope_BIND_TS_NAMESPACE = 8;
  const acornScope_BIND_FLAGS_TS_EXPORT_ONLY = 1024;
  const acornScope_BIND_FLAGS_TS_IMPORT = 4096;
  const acornScope_BIND_FLAGS_TS_ENUM = 256;
  const acornScope_BIND_FLAGS_TS_CONST_ENUM = 512;
  const acornScope_BIND_FLAGS_CLASS = 128;
  /**
   * @param {boolean} async
   * @param {boolean} generator
   */
  function functionFlags(async, generator) {
    return (
      acornScope_SCOPE_FUNCTION |
      (async ? acornScope_SCOPE_ASYNC : 0) |
      (generator ? acornScope_SCOPE_GENERATOR : 0)
    )
  }
  /**
   * @param {import("./acorn.js").Expression | import("./acorn.js").Super} expression
   */
  function isPossiblyLiteralEnum(expression) {
    if (expression.type === "Identifier") return true
    if (expression.type !== "MemberExpression") return false
    if (
      expression.computed &&
      !(
        expression.property.type === "Literal" ||
        (expression.property.type === "TemplateLiteral" &&
          !expression.property.expressions.length)
      )
    )
      return false
    return isPossiblyLiteralEnum(expression.object)
  }
  /**
   * @param {string} modifier
   */
  function tsIsAccessModifier(modifier) {
    return (
      modifier === "private" || modifier === "public" || modifier === "protected"
    )
  }
  /**
   * @param {{ startsExpr: any; }} token
   */
  function tokenCanStartExpression(token) {
    return Boolean(token.startsExpr)
  }
  /**
   * @type {<T>(_: T) => NonNullable<T>}
   */
  function nonNull(x) {
    if (x == null) {
      throw new Error(`Unexpected ${x} value.`)
    }
    return x
  }
  /**
   * @param {string} value
   */
  function keywordTypeFromName(value) {
    switch (value) {
      case "any":
        return "TSAnyKeyword"
      case "boolean":
        return "TSBooleanKeyword"
      case "bigint":
        return "TSBigIntKeyword"
      case "never":
        return "TSNeverKeyword"
      case "number":
        return "TSNumberKeyword"
      case "object":
        return "TSObjectKeyword"
      case "string":
        return "TSStringKeyword"
      case "symbol":
        return "TSSymbolKeyword"
      case "undefined":
        return "TSUndefinedKeyword"
      case "unknown":
        return "TSUnknownKeyword"
      default:
        return undefined
    }
  }
  /**
   * @param {string} value
   */
  function nameFromKeywordType(value) {
    switch (value) {
      case "TSAnyKeyword":
        return "any"
      case "TSBooleanKeyword":
        return "boolean"
      case "TSBigIntKeyword":
        return "bigint"
      case "TSNeverKeyword":
        return "never"
      case "TSNumberKeyword":
        return "number"
      case "TSObjectKeyword":
        return "object"
      case "TSStringKeyword":
        return "string"
      case "TSSymbolKeyword":
        return "symbol"
      case "TSUndefinedKeyword":
        return "undefined"
      case "TSUnknownKeyword":
        return "unknown"
      default:
        return undefined
    }
  }
  /**
   * @param {string} code
   * @param {number} from
   */
  function nextLineBreak(code, from, end = code.length) {
    for (let i = from; i < end; i++) {
      let next = code.charCodeAt(i)
      if (isNewLine(next))
        return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10
          ? i + 2
          : i + 1
    }
    return -1
  }
  let pp = Parser.prototype
  pp.vanilla_canInsertSemicolon = pp.canInsertSemicolon
  pp.vanilla_checkExport = pp.checkExport
  pp.vanilla_checkLValInnerPattern = pp.checkLValInnerPattern
  pp.vanilla_checkLValSimple = pp.checkLValSimple
  pp.vanilla_checkLocalExport = pp.checkLocalExport
  pp.vanilla_currentScope = pp.currentScope
  pp.vanilla_declareName = pp.declareName
  pp.vanilla_eatContextual = pp.eatContextual
  pp.vanilla_enterScope = pp.enterScope
  pp.vanilla_exitScope = pp.exitScope
  pp.vanilla_expect = pp.expect
  pp.vanilla_finishNode = pp.finishNode
  pp.vanilla_finishToken = pp.finishToken
  pp.vanilla_getTokenFromCode = pp.getTokenFromCode
  pp.vanilla_isClassElementNameStart = pp.isClassElementNameStart
  pp.vanilla_isSimpleAssignTarget = pp.isSimpleAssignTarget
  pp.vanilla_isSimpleParamList = pp.isSimpleParamList
  pp.vanilla_parseArrowExpression = pp.parseArrowExpression
  pp.vanilla_parseAssignableListItem = pp.parseAssignableListItem
  pp.vanilla_parseBindingAtom = pp.parseBindingAtom
  pp.vanilla_parseBindingListItem = pp.parseBindingListItem
  pp.vanilla_parseCatchClauseParam = pp.parseCatchClauseParam
  pp.vanilla_parseClassField = pp.parseClassField
  pp.vanilla_parseClassId = pp.parseClassId
  pp.vanilla_parseClassMethod = pp.parseClassMethod
  pp.vanilla_parseClassStaticBlock = pp.parseClassStaticBlock
  pp.vanilla_parseClassSuper = pp.parseClassSuper
  pp.vanilla_parseExport = pp.parseExport
  pp.vanilla_parseExportAllDeclaration = pp.parseExportAllDeclaration
  pp.vanilla_parseExportDeclaration = pp.parseExportDeclaration
  pp.vanilla_parseExportDefaultDeclaration = pp.parseExportDefaultDeclaration
  pp.vanilla_parseExportSpecifier = pp.parseExportSpecifier
  pp.vanilla_parseExprAtom = pp.parseExprAtom
  pp.vanilla_parseExprAtomDefault = pp.parseExprAtomDefault
  pp.vanilla_parseExprList = pp.parseExprList
  pp.vanilla_parseExprOp = pp.parseExprOp
  pp.vanilla_parseExpressionStatement = pp.parseExpressionStatement
  pp.vanilla_parseFunction = pp.parseFunction
  pp.vanilla_parseFunctionBody = pp.parseFunctionBody
  pp.vanilla_parseFunctionParams = pp.parseFunctionParams
  pp.vanilla_parseGetterSetter = pp.parseGetterSetter
  pp.vanilla_parseIdent = pp.parseIdent
  pp.vanilla_parseIdentNode = pp.parseIdentNode
  pp.vanilla_parseImport = pp.parseImport
  pp.vanilla_parseImportSpecifier = pp.parseImportSpecifier
  pp.vanilla_parseMaybeAssign = pp.parseMaybeAssign
  pp.vanilla_parseMaybeConditional = pp.parseMaybeConditional
  pp.vanilla_parseMaybeDefault = pp.parseMaybeDefault
  pp.vanilla_parseMaybeUnary = pp.parseMaybeUnary
  pp.vanilla_parseMethod = pp.parseMethod
  pp.vanilla_parseNew = pp.parseNew
  pp.vanilla_parseParenAndDistinguishExpression = pp.parseParenAndDistinguishExpression
  pp.vanilla_parseParenArrowList = pp.parseParenArrowList
  pp.vanilla_parseParenItem = pp.parseParenItem
  pp.vanilla_parseProperty = pp.parseProperty
  pp.vanilla_parsePropertyValue = pp.parsePropertyValue
  pp.vanilla_parseStatement = pp.parseStatement
  pp.vanilla_parseSubscript = pp.parseSubscript
  pp.vanilla_parseSubscriptAsyncArrow = pp.parseSubscriptAsyncArrow
  pp.vanilla_parseTemplate = pp.parseTemplate
  pp.vanilla_parseVar = pp.parseVar
  pp.vanilla_parseVarId = pp.parseVarId
  pp.vanilla_parseVarStatement = pp.parseVarStatement
  pp.vanilla_parseYield = pp.parseYield
  pp.vanilla_raise = pp.raise
  pp.vanilla_raiseRecoverable = pp.raiseRecoverable
  pp.vanilla_readToken = pp.readToken
  pp.vanilla_readWord = pp.readWord
  pp.vanilla_semicolon = pp.semicolon
  pp.vanilla_shouldParseArrow = pp.shouldParseArrow
  pp.vanilla_shouldParseAsyncArrow = pp.shouldParseAsyncArrow
  pp.vanilla_shouldParseExportStatement = pp.shouldParseExportStatement
  pp.vanilla_skipBlockComment = pp.skipBlockComment
  pp.vanilla_skipLineComment = pp.skipLineComment
  pp.vanilla_startNodeAt = pp.startNodeAt
  pp.vanilla_toAssignable = pp.toAssignable
  pp.vanilla_toAssignableList = pp.toAssignableList
  pp.vanilla_updateContext = pp.updateContext
  pp.vanilla_parseBindingList = pp.parseBindingList
  pp.readToken = function readToken(code) {
    if (!this.__ts_jsxEnabled) {
      return this.vanilla_readToken(code)
    }
    if (!this.inType) {
      let context = this.curContext()
      if (context === tokContexts3.tc_expr) return this.__ts_jsx_readToken()
      if (context === tokContexts3.tc_oTag || context === tokContexts3.tc_cTag) {
        if (isIdentifierStart(code)) return this.__ts_jsx_readWord()
        if (code === 62) {
          ++this.pos
          return this.finishToken(tokTypes2.jsxTagEnd)
        }
        if ((code === 34 || code === 39) && context === tokContexts3.tc_oTag)
          return this.__ts_jsx_readString(code)
      }
    }
    return this.vanilla_readToken(code)
  }
  pp.getTokenFromCode = function getTokenFromCode(code) {
    if (this.inType) {
      return this.__ts_getTokenFromCodeInType(code)
    }
    if (code === 64) {
      ++this.pos
      return this.finishToken(tokTypes2.at)
    }
    return this.vanilla_getTokenFromCode(code)
  }
  pp.finishNode = function finishNode(node, type) {
    if (!this.__ts_enabled) {
      return this.vanilla_finishNode(node, type)
    }
    if (node.type !== "" && node.end !== 0) {
      return node
    }
    return this.vanilla_finishNode(node, type)
  }
  pp.__ts_startNodeAtNode = function __ts_startNodeAtNode(type) {
    return this.vanilla_startNodeAt(type.start, type.loc && type.loc.start)
  }
  pp.readWord = function readWord() {
    if (!this.__ts_enabled) {
      return this.vanilla_readWord()
    }
    let word = this.readWord1()
    let type = tokTypes.name
    if (this.keywords.test(word)) {
      type = keywordTypes[word]
    }
    return this.finishToken(type, word)
  }
  pp.skipBlockComment = function skipBlockComment() {
    if (!this.__ts_enabled) {
      return this.vanilla_skipBlockComment()
    }
    let startLoc
    if (!this.__ts_isLookahead)
      startLoc = this.options.onComment && this.curPosition()
    let start = this.pos,
      end = this.input.indexOf("*/", (this.pos += 2))
    if (end === -1) this.raise(this.pos - 2, "Unterminated comment")
    this.pos = end + 2
    if (this.options.locations) {
      for (
        let nextBreak, pos = start;
        (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;
      ) {
        ++this.curLine
        pos = this.lineStart = nextBreak
      }
    }
    if (this.__ts_isLookahead) return
    if (this.options.onComment) {
      this.options.onComment(
        true,
        this.input.slice(start + 2, end),
        start,
        this.pos,
        startLoc,
        this.curPosition()
      )
    }
  }
  pp.skipLineComment = function skipLineComment(startSkip) {
    if (!this.__ts_enabled) {
      return this.vanilla_skipLineComment(startSkip)
    }
    let start = this.pos
    let startLoc
    if (!this.__ts_isLookahead)
      startLoc = this.options.onComment && this.curPosition()
    let ch = this.input.charCodeAt((this.pos += startSkip))
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this.input.charCodeAt(++this.pos)
    }
    if (this.__ts_isLookahead) return
    if (this.options.onComment)
      this.options.onComment(
        false,
        this.input.slice(start + startSkip, this.pos),
        start,
        this.pos,
        startLoc,
        this.curPosition()
      )
  }
  pp.finishToken = function finishToken(type, val) {
    if (!this.__ts_enabled) {
      return this.vanilla_finishToken(type, val)
    }
    this.end = this.pos
    if (this.options.locations) this.endLoc = this.curPosition()
    let prevType = this.type
    this.type = type
    this.value = val
    if (!this.__ts_isLookahead) {
      this.updateContext(prevType)
    }
  }
  pp.resetStartLocationFromNode = function resetStartLocationFromNode(
    node,
    locationNode
  ) {
    if (!this.__ts_enabled) {
      return
    }
    this.__ts_resetStartLocation(
      node,
      locationNode.start,
      locationNode.loc.start
    )
  }
  pp.eatContextual = function eatContextual(name) {
    if (!this.__ts_enabled) {
      return this.vanilla_eatContextual(name)
    }
    if (keywordsRegExp.test(name)) {
      if (this.isContextual(name)) {
        this.next()
        return true
      }
      return false
    } else {
      return this.vanilla_eatContextual(name)
    }
  }
  pp.parseIdent = function parseIdent(allowReservedWords = undefined) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseIdent(allowReservedWords)
    }
    return this.vanilla_parseIdent(this.__ts_isAmbientContext || this.inType || allowReservedWords
    )
  }
  pp.parseMaybeUnary = function parseMaybeUnary(
    refExpressionErrors,
    sawUnary,
    incDec,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseMaybeUnary(refExpressionErrors,
        sawUnary,
        incDec,
        forInit
      )
    }
    if (!this.__ts_jsxEnabled && this.__ts_tsMatchLeftRelational()) {
      return this.__ts_tsParseTypeAssertion()
    } else {
      return this.vanilla_parseMaybeUnary(refExpressionErrors,
        sawUnary,
        incDec,
        forInit
      )
    }
  }
  pp.checkLValSimple = function checkLValSimple(
    expr,
    bindingType = acornScope_BIND_NONE,
    checkClashes,
    isLogicalAssignment
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_checkLValSimple(expr,
        bindingType,
        checkClashes,
        isLogicalAssignment
      )
    }
    if (
      expr.type === "TSNonNullExpression" ||
      expr.type === "TSAsExpression" ||
      expr.type === "TSSatisfiesExpression"
    ) {
      expr = expr.expression
    }
    let prevStrict = this.strict
    if (
      this.__ts_isAmbientContext ||
      this.inType ||
      bindingType === acornScope_BIND_TS_INTERFACE ||
      bindingType === acornScope_BIND_TS_TYPE ||
      bindingType === acornScope_BIND_FLAGS_TS_EXPORT_ONLY
    ) {
      this.strict = false
    }
    const result = this.vanilla_checkLValSimple(expr,
      bindingType,
      checkClashes,
      isLogicalAssignment
    )
    this.strict = prevStrict
    return result
  }
  pp.parseTemplate = function parseTemplate(o = {}) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseTemplate(o)
    }
    const { isTagged = false } = o
    let node = this.startNode()
    this.next()
    node.expressions = []
    let curElt = this.parseTemplateElement({
      isTagged,
    })
    node.quasis = [curElt]
    while (!curElt.tail) {
      if (this.type === tokTypes.eof)
        this.raise(this.pos, "Unterminated template literal")
      this.expect(tokTypes.dollarBraceL)
      node.expressions.push(
        this.inType ? this.__ts_tsParseType() : this.parseExpression()
      )
      this.expect(tokTypes.braceR)
      node.quasis.push(
        (curElt = this.parseTemplateElement({
          isTagged,
        }))
      )
    }
    this.next()
    return this.finishNode(node, "TemplateLiteral")
  }
  pp.parseFunction = function parseFunction(
    node,
    statement,
    allowExpressionBody,
    isAsync,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseFunction(node,
        statement,
        allowExpressionBody,
        isAsync,
        forInit
      )
    }
    this.initFunction(node)
    if (
      this.__ts_ecmaVersion() >= 9 ||
      (this.__ts_ecmaVersion() >= 6 && !isAsync)
    ) {
      if (this.type === tokTypes.star && statement & FUNC_HANGING_STATEMENT) {
        this.unexpected()
      }
      node.generator = this.eat(tokTypes.star)
    }
    if (this.__ts_ecmaVersion() >= 8) {
      node.async = !!isAsync
    }
    if (statement & FUNC_STATEMENT) {
      node.id =
        statement & FUNC_NULLABLE_ID && this.type !== tokTypes.name
          ? null
          : this.parseIdent()
    }
    let oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldAwaitIdentPos = this.awaitIdentPos
    const oldMaybeInArrowParameters = this.__ts_maybeInArrowParameters
    this.__ts_maybeInArrowParameters = false
    this.yieldPos = 0
    this.awaitPos = 0
    this.awaitIdentPos = 0
    this.enterScope(functionFlags(node.async, node.generator))
    if (!(statement & FUNC_STATEMENT)) {
      node.id = this.type === tokTypes.name ? this.parseIdent() : null
    }
    this.parseFunctionParams(node)
    const isDeclaration = statement & FUNC_STATEMENT
    this.parseFunctionBody(node, allowExpressionBody, false, forInit, {
      isFunctionDeclaration: isDeclaration,
    })
    this.yieldPos = oldYieldPos
    this.awaitPos = oldAwaitPos
    this.awaitIdentPos = oldAwaitIdentPos
    if (
      statement & FUNC_STATEMENT &&
      node.id &&
      !(statement & FUNC_HANGING_STATEMENT)
    ) {
      if (node.body) {
        this.checkLValSimple(
          node.id,
          this.strict || node.generator || node.async
            ? this.treatFunctionsAsVar
              ? acornScope_BIND_VAR
              : acornScope_BIND_LEXICAL
            : acornScope_BIND_FUNCTION
        )
      } else {
        this.checkLValSimple(node.id, BIND_TS_AMBIENT)
      }
    }
    this.__ts_maybeInArrowParameters = oldMaybeInArrowParameters
    return this.finishNode(
      node,
      isDeclaration ? "FunctionDeclaration" : "FunctionExpression"
    )
  }
  pp.parseFunctionBody = function parseFunctionBody(
    node,
    isArrowFunction = false,
    isMethod = false,
    forInit = false,
    tsConfig
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseFunctionBody(node,
        isArrowFunction,
        isMethod,
        forInit
      )
    }
    if (this.__ts_match(tokTypes.colon)) {
      node.returnType = this.__ts_tsParseTypeOrTypePredicateAnnotation(
        tokTypes.colon
      )
    }
    const bodilessType =
      tsConfig !== null &&
        tsConfig !== undefined &&
        tsConfig.isFunctionDeclaration
        ? "TSDeclareFunction"
        : tsConfig !== null && tsConfig !== undefined && tsConfig.isClassMethod
          ? "TSDeclareMethod"
          : undefined
    if (
      bodilessType &&
      !this.__ts_match(tokTypes.braceL) &&
      this.__ts_isLineTerminator()
    ) {
      this.exitScope()
      return this.finishNode(node, bodilessType)
    }
    if (bodilessType === "TSDeclareFunction" && this.__ts_isAmbientContext) {
      this.raise(node.start, DeclareFunctionHasImplementation)
      if (node.declare) {
        this.vanilla_parseFunctionBody(node,
          isArrowFunction,
          isMethod,
          false
        )
        return this.finishNode(node, bodilessType)
      }
    }
    for (const param of node.params) {
      if (
        param.optional &&
        param.type !== "Identifier" &&
        !this.__ts_isAmbientContext &&
        !this.inType
      ) {
        this.raise(param.start, PatternIsOptional)
      }
    }
    this.vanilla_parseFunctionBody(node,
      isArrowFunction,
      isMethod,
      forInit
    )
    return node
  }
  pp.isSimpleParamList = function isSimpleParamList(params) {
    if (!this.__ts_enabled) {
      return this.vanilla_isSimpleParamList(params)
    }
    for (let i = 0, list = params; i < list.length; i += 1) {
      let param = list[i]
      if (param.type !== "Identifier" && param.type !== "TSParameterProperty") {
        return false
      }
    }
    return true
  }
  pp.parseNew = function parseNew() {
    let _callee$extra
    if (!this.__ts_enabled) {
      return this.vanilla_parseNew()
    }
    if (this.containsEsc)
      this.raiseRecoverable(this.start, "Escape sequence in keyword new")
    let node = this.startNode()
    let meta = this.parseIdent(true)
    if (this.__ts_ecmaVersion() >= 6 && this.eat(tokTypes.dot)) {
      node.meta = meta
      let containsEsc = this.containsEsc
      node.property = this.parseIdent(true)
      if (node.property.name !== "target")
        this.raiseRecoverable(
          node.property.start,
          "The only valid meta property for new is 'new.target'"
        )
      if (containsEsc)
        this.raiseRecoverable(
          node.start,
          "'new.target' must not contain escaped characters"
        )
      if (!this["allowNewDotTarget"])
        this.raiseRecoverable(
          node.start,
          "'new.target' can only be used in functions and class static block"
        )
      return this.finishNode(node, "MetaProperty")
    }
    let startPos = this.start,
      startLoc = this.startLoc,
      isImport = this.type === tokTypes._import
    node.callee = this.parseSubscripts(
      this.parseExprAtom(),
      startPos,
      startLoc,
      true,
      false
    )
    if (isImport && node.callee.type === "ImportExpression") {
      this.raise(startPos, "Cannot use new with import()")
    }
    const { callee } = node
    if (
      callee.type === "TSInstantiationExpression" &&
      !(
        (_callee$extra = callee.extra) !== null &&
        _callee$extra !== undefined &&
        _callee$extra.parenthesized
      )
    ) {
      node.typeArguments = callee.typeArguments
      node.callee = callee.expression
    }
    if (this.eat(tokTypes.parenL))
      node.arguments = this.parseExprList(
        tokTypes.parenR,
        this.__ts_ecmaVersion() >= 8,
        false
      )
    else node.arguments = []
    return this.finishNode(node, "NewExpression")
  }
  pp.parseExprOp = function parseExprOp(
    left,
    leftStartPos,
    leftStartLoc,
    minPrec,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExprOp(left,
        leftStartPos,
        leftStartLoc,
        minPrec,
        forInit
      )
    }
    if (tokTypes._in.binop > minPrec && !this.__ts_hasPrecedingLineBreak()) {
      let nodeType
      if (this.isContextual("as")) {
        nodeType = "TSAsExpression"
      }
      if (this.isContextual("satisfies")) {
        nodeType = "TSSatisfiesExpression"
      }
      if (nodeType) {
        const node = this.startNodeAt(leftStartPos, leftStartLoc)
        node.expression = left
        const _const = this.__ts_tsTryNextParseConstantContext()
        if (_const) {
          node.typeAnnotation = _const
        } else {
          node.typeAnnotation = this.__ts_tsNextThenParseType()
        }
        this.finishNode(node, nodeType)
        this.__ts_reScan_lt_gt()
        return this.parseExprOp(
          node,
          leftStartPos,
          leftStartLoc,
          minPrec,
          forInit
        )
      }
    }
    return this.vanilla_parseExprOp(left,
      leftStartPos,
      leftStartLoc,
      minPrec,
      forInit
    )
  }
  pp.parseImport = function parseImport(node) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseImport(node)
    }
    let enterHead = this.__ts_lookahead()
    node.importKind = "value"
    this.__ts_importOrExportOuterKind = "value"
    if (
      tokenIsIdentifier(enterHead.type) ||
      this.__ts_match(tokTypes.star) ||
      this.__ts_match(tokTypes.braceL)
    ) {
      let ahead = this.__ts_lookahead(2)
      let nextAhead = this.__ts_lookahead(3)
      if (
        // import type, { a } from "b";
        ahead.type !== tokTypes.comma &&
        // import type from "a";
        !(
          this.__ts_isContextualWithState("from", ahead) &&
          !this.__ts_isContextualWithState("from", nextAhead)
        ) &&
        // import type = require("a");
        ahead.type !== tokTypes.eq &&
        this.__ts_ts_eatContextualWithState("type", 1, enterHead)
      ) {
        this.__ts_importOrExportOuterKind = "type"
        node.importKind = "type"
        enterHead = this.__ts_lookahead()
        ahead = this.__ts_lookahead(2)
      }
      if (tokenIsIdentifier(enterHead.type) && ahead.type === tokTypes.eq) {
        this.next()
        const importNode = this.__ts_tsParseImportEqualsDeclaration(node)
        this.__ts_importOrExportOuterKind = "value"
        return importNode
      }
    }
    this.next()
    if (this.type === tokTypes.string) {
      node.specifiers = []
      node.source = this.parseExprAtom()
    } else {
      node.specifiers = this.parseImportSpecifiers(node)
      this.expectContextual("from")
      node.source =
        this.type === tokTypes.string ? this.parseExprAtom() : this.unexpected()
    }
    node.attributes = this.parseWithClause()
    this.semicolon()
    this.finishNode(node, "ImportDeclaration")
    this.__ts_importOrExportOuterKind = "value"
    if (
      node.importKind === "type" &&
      node.specifiers.length > 1 &&
      node.specifiers[0].type === "ImportDefaultSpecifier"
    ) {
      this.raise(node.start, TypeImportCannotSpecifyDefaultAndNamed)
    }
    return node
  }
  pp.parseExportDefaultDeclaration = function parseExportDefaultDeclaration() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExportDefaultDeclaration()
    }
    if (this.__ts_isAbstractClass()) {
      const cls = this.startNode()
      this.next()
      cls.abstract = true
      return this.parseClass(cls, "nullableID")
    }
    if (this.isContextual("interface")) {
      const result = this.__ts_tsParseInterfaceDeclaration(this.startNode())
      if (result) return result
    }
    return this.vanilla_parseExportDefaultDeclaration()
  }
  pp.parseExportAllDeclaration = function parseExportAllDeclaration(
    node,
    exports
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExportAllDeclaration(node, exports)
    }
    if (this.__ts_ecmaVersion() >= 11) {
      if (this.eatContextual("as")) {
        node.exported = this.parseModuleExportName()
        this.checkExport(exports, node.exported, this.lastTokStart)
      } else {
        node.exported = null
      }
    }
    this.expectContextual("from")
    if (this.type !== tokTypes.string) this.unexpected()
    node.source = this.parseExprAtom()
    node.attributes = this.parseWithClause()
    this.semicolon()
    return this.finishNode(node, "ExportAllDeclaration")
  }
  pp.parseExport = function parseExport(node, exports) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExport(node, exports)
    }
    let enterHead = this.__ts_lookahead()
    if (this.__ts_ts_eatWithState(tokTypes._import, 2, enterHead)) {
      if (this.isContextual("type") && this.__ts_lookaheadCharCode() !== 61) {
        node.importKind = "type"
        this.__ts_importOrExportOuterKind = "type"
        this.next()
      } else {
        node.importKind = "value"
        this.__ts_importOrExportOuterKind = "value"
      }
      const exportEqualsNode = this.__ts_tsParseImportEqualsDeclaration(
        node /* isExport */,
        true
      )
      this.__ts_importOrExportOuterKind = undefined
      return exportEqualsNode
    } else if (this.__ts_ts_eatWithState(tokTypes.eq, 2, enterHead)) {
      const assign = node
      assign.expression = this.parseExpression()
      this.semicolon()
      this.__ts_importOrExportOuterKind = undefined
      return this.finishNode(assign, "TSExportAssignment")
    } else if (this.__ts_ts_eatContextualWithState("as", 2, enterHead)) {
      const decl = node
      this.expectContextual("namespace")
      decl.id = this.parseIdent(true)
      this.semicolon()
      this.__ts_importOrExportOuterKind = undefined
      return this.finishNode(decl, "TSNamespaceExportDeclaration")
    } else {
      const lookahead2 = this.__ts_lookahead(2).type
      if (
        this.__ts_isContextualWithState("type", enterHead) &&
        (lookahead2 === tokTypes.braceL ||
          // export type { ... }
          lookahead2 === tokTypes.star)
      ) {
        this.next()
        this.__ts_importOrExportOuterKind = "type"
        node.exportKind = "type"
      } else {
        this.__ts_importOrExportOuterKind = "value"
        node.exportKind = "value"
      }
      this.next()
      if (this.eat(tokTypes.star)) {
        return this.parseExportAllDeclaration(node, exports)
      }
      if (this.eat(tokTypes._default)) {
        this.checkExport(exports, "default", this.lastTokStart)
        node.declaration = this.parseExportDefaultDeclaration()
        return this.finishNode(node, "ExportDefaultDeclaration")
      }
      if (this.shouldParseExportStatement()) {
        node.declaration = this.parseExportDeclaration(node)
        if (node.declaration.type === "VariableDeclaration")
          this.checkVariableExport(exports, node.declaration.declarations)
        else
          this.checkExport(
            exports,
            node.declaration.id,
            node.declaration.id.start
          )
        node.specifiers = []
        node.source = null
      } else {
        node.declaration = null
        node.specifiers = this.parseExportSpecifiers(exports)
        if (this.eatContextual("from")) {
          if (this.type !== tokTypes.string) this.unexpected()
          node.source = this.parseExprAtom()
          node.attributes = this.parseWithClause()
        } else {
          for (let spec of node.specifiers) {
            this.checkUnreserved(spec.local)
            this.checkLocalExport(spec.local)
            if (spec.local.type === "Literal") {
              this.raise(
                spec.local.start,
                "A string literal cannot be used as an exported binding without `from`."
              )
            }
          }
          node.source = null
        }
        this.semicolon()
      }
      return this.finishNode(node, "ExportNamedDeclaration")
    }
  }
  pp.checkExport = function checkExport(exports, name, _) {
    if (!this.__ts_enabled) {
      return this.vanilla_checkExport(exports, name, _)
    }
    if (!exports) {
      return
    }
    if (typeof name !== "string") {
      name = name.type === "Identifier" ? name.name : name.value
    }
    exports[name] = true
  }
  pp.parseMaybeDefault = function parseMaybeDefault(startPos, startLoc, left) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseMaybeDefault(startPos,
        startLoc,
        left
      )
    }
    const node = this.vanilla_parseMaybeDefault(startPos,
      startLoc,
      left
    )
    if (
      node.type === "AssignmentPattern" &&
      node.typeAnnotation &&
      node.right.start < node.typeAnnotation.start
    ) {
      this.raise(node.typeAnnotation.start, TypeAnnotationAfterAssign)
    }
    return node
  }
  pp.toAssignableList = function toAssignableList(exprList, isBinding) {
    if (!this.__ts_enabled) {
      return this.vanilla_toAssignableList(exprList, isBinding)
    }
    if (!exprList) exprList = []
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i]
      if (
        (expr === null || expr === undefined ? undefined : expr.type) ===
        "TSTypeCastExpression"
      ) {
        exprList[i] = this.__ts_typeCastToParameter(expr)
      }
    }
    return this.vanilla_toAssignableList(exprList, isBinding)
  }
  pp.parseExprAtom = function parseExprAtom(
    refDestructuringErrors,
    forInit,
    forNew
  ) {
    if (this.__ts_decoratorsEnabled && this.__ts_match(tokTypes2.at)) {
      this.__ts_parseDecorators()
      return this.parseExprAtom()
    }
    if (!this.__ts_enabled) {
      return this.__ts_super_parseExprAtom(
        refDestructuringErrors,
        forInit,
        forNew
      )
    }
    if (tokenIsIdentifier(this.type)) {
      let canBeArrow = this.potentialArrowAt === this.start
      let startPos = this.start,
        startLoc = this.startLoc,
        containsEsc = this.containsEsc
      let id = this.parseIdent(false)
      if (
        this.__ts_ecmaVersion() >= 8 &&
        !containsEsc &&
        id.name === "async" &&
        !this.canInsertSemicolon() &&
        this.eat(tokTypes._function)
      ) {
        this.overrideContext(tokContexts.f_expr)
        return this.parseFunction(
          this.startNodeAt(startPos, startLoc),
          0,
          false,
          true,
          forInit
        )
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(tokTypes.arrow))
          return this.parseArrowExpression(
            this.startNodeAt(startPos, startLoc),
            [id],
            false,
            forInit
          )
        if (
          this.__ts_ecmaVersion() >= 8 &&
          id.name === "async" &&
          this.type === tokTypes.name &&
          !containsEsc &&
          (!this.potentialArrowInForAwait ||
            this.value !== "of" ||
            this.containsEsc)
        ) {
          id = this.parseIdent(false)
          if (this.canInsertSemicolon() || !this.eat(tokTypes.arrow))
            this.unexpected()
          return this.parseArrowExpression(
            this.startNodeAt(startPos, startLoc),
            [id],
            true,
            forInit
          )
        }
      }
      return id
    } else {
      return this.__ts_super_parseExprAtom(
        refDestructuringErrors,
        forInit,
        forNew
      )
    }
  }
  pp.parseExprAtomDefault = function parseExprAtomDefault() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExprAtomDefault()
    }
    if (tokenIsIdentifier(this.type)) {
      const canBeArrow = this["potentialArrowAt"] === this.start
      const containsEsc = this.containsEsc
      const id = this.parseIdent()
      if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
        const { type } = this
        if (type === tokTypes._function) {
          this.next()
          return this.parseFunction(
            this.__ts_startNodeAtNode(id),
            undefined,
            true,
            true
          )
        } else if (tokenIsIdentifier(type)) {
          if (this.__ts_lookaheadCharCode() === 61) {
            const paramId = this.parseIdent(false)
            if (this.canInsertSemicolon() || !this.eat(tokTypes.arrow))
              this.unexpected()
            return this.parseArrowExpression(
              this.__ts_startNodeAtNode(id),
              [paramId],
              true
            )
          } else {
            return id
          }
        }
      }
      if (
        canBeArrow &&
        this.__ts_match(tokTypes.arrow) &&
        !this.canInsertSemicolon()
      ) {
        this.next()
        return this.parseArrowExpression(this.__ts_startNodeAtNode(id), [id], false)
      }
      return id
    } else {
      this.unexpected()
    }
  }
  pp.parseIdentNode = function parseIdentNode() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseIdentNode()
    }
    let node = this.startNode()
    if (
      tokenIsKeywordOrIdentifier(this.type) &&
      // Taken from super-class method
      !(
        (this.type.keyword === "class" || this.type.keyword === "function") &&
        (this.lastTokEnd !== this.lastTokStart + 1 ||
          this.input.charCodeAt(this.lastTokStart) !== 46)
      )
    ) {
      node.name = this.value
    } else {
      return this.vanilla_parseIdentNode()
    }
    return node
  }
  pp.parseVarStatement = function parseVarStatement(
    node,
    kind,
    allowMissingInitializer = false
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseVarStatement(node,
        kind,
        allowMissingInitializer
      )
    }
    const isAmbientContext = this.__ts_isAmbientContext
    this.next()
    this.vanilla_parseVar(node,
      false,
      kind,
      allowMissingInitializer || isAmbientContext
    )
    this.semicolon()
    const declaration = this.finishNode(node, "VariableDeclaration")
    if (!isAmbientContext) return declaration
    for (const { id, init } of declaration.declarations) {
      if (!init) continue
      if (kind !== "const" || !!id.typeAnnotation) {
        this.raise(init.start, InitializerNotAllowedInAmbientContext)
      } else if (
        init.type !== "Literal" &&
        (init.type !== "TemplateLiteral" || init.expressions.length > 0) &&
        !isPossiblyLiteralEnum(init)
      ) {
        this.raise(
          init.start,
          ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference
        )
      }
    }
    return declaration
  }
  pp.parseStatement = function parseStatement(context, topLevel, exports) {
    if (this.__ts_decoratorsEnabled && this.__ts_match(tokTypes2.at)) {
      this.__ts_parseDecorators(true)
    }
    if (!this.__ts_enabled) {
      return this.vanilla_parseStatement(context,
        topLevel,
        exports
      )
    }
    if (
      this.__ts_match(tokTypes._const) &&
      this.__ts_isLookaheadContextual("enum")
    ) {
      const node = this.startNode()
      this.expect(tokTypes._const)
      return this.__ts_tsParseEnumDeclaration(node, {
        const: true,
      })
    }
    if (this.isContextual("enum")) {
      return this.__ts_tsParseEnumDeclaration(this.startNode())
    }
    if (this.isContextual("interface")) {
      const result = this.__ts_tsParseInterfaceDeclaration(this.startNode())
      if (result) return result
    }
    return this.vanilla_parseStatement(context, topLevel, exports)
  }
  pp.parseExpressionStatement = function parseExpressionStatement(node, expr) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExpressionStatement(node, expr)
    }
    const decl =
      expr.type === "Identifier"
        ? this.__ts_tsParseExpressionStatement(node, expr)
        : undefined
    return (
      decl || this.vanilla_parseExpressionStatement(node, expr)
    )
  }
  pp.shouldParseExportStatement = function shouldParseExportStatement() {
    if (!this.__ts_enabled) {
      return this.vanilla_shouldParseExportStatement()
    }
    if (this.__ts_tsIsDeclarationStart()) return true
    if (this.__ts_match(tokTypes2.at)) {
      return true
    }
    return this.vanilla_shouldParseExportStatement()
  }
  pp.parseMaybeConditional = function parseMaybeConditional(
    forInit,
    refDestructuringErrors
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseMaybeConditional(forInit,
        refDestructuringErrors
      )
    }
    let startPos = this.start,
      startLoc = this.startLoc
    let expr = this.parseExprOps(forInit, refDestructuringErrors)
    if (this.checkExpressionErrors(refDestructuringErrors)) return expr
    if (
      !this.__ts_maybeInArrowParameters ||
      !this.__ts_match(tokTypes.question)
    ) {
      return this.__ts_parseConditional(
        expr,
        startPos,
        startLoc,
        forInit,
        refDestructuringErrors
      )
    }
    const result = this.__ts_tryParse(() =>
      this.__ts_parseConditional(
        expr,
        startPos,
        startLoc,
        forInit,
        refDestructuringErrors
      )
    )
    if (!result.node) {
      if (result.error) {
        this.__ts_setOptionalParametersError(
          refDestructuringErrors,
          result.error
        )
      }
      return expr
    }
    if (result.error) this.__ts_setLookaheadState(result.failState)
    return result.node
  }
  pp.parseParenItem = function parseParenItem(node) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseParenItem(node)
    }
    const startPos = this.start
    const startLoc = this.startLoc
    node = this.vanilla_parseParenItem(node)
    if (this.eat(tokTypes.question)) {
      node.optional = true
      this.__ts_resetEndLocation(node)
    }
    if (this.__ts_match(tokTypes.colon)) {
      const typeCastNode = this.startNodeAt(startPos, startLoc)
      typeCastNode.expression = node
      typeCastNode.typeAnnotation = this.__ts_tsParseTypeAnnotation()
      return this.finishNode(typeCastNode, "TSTypeCastExpression")
    }
    return node
  }
  pp.parseExportDeclaration = function parseExportDeclaration(node) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExportDeclaration(node)
    }
    if (!this.__ts_isAmbientContext && this.isContextual("declare")) {
      return this.__ts_tsInAmbientContext(() =>
        this.parseExportDeclaration(node)
      )
    }
    const startPos = this.start
    const startLoc = this.startLoc
    const isDeclare = this.eatContextual("declare")
    if (
      isDeclare &&
      (this.isContextual("declare") || !this.shouldParseExportStatement())
    ) {
      this.raise(this.start, ExpectedAmbientAfterExportDeclare)
    }
    const isIdentifier = tokenIsIdentifier(this.type)
    const declaration =
      (isIdentifier && this.__ts_tsTryParseExportDeclaration()) ||
      this.parseStatement(null)
    if (!declaration) return null
    if (
      declaration.type === "TSInterfaceDeclaration" ||
      declaration.type === "TSTypeAliasDeclaration" ||
      isDeclare
    ) {
      node.exportKind = "type"
    }
    if (isDeclare) {
      this.__ts_resetStartLocation(declaration, startPos, startLoc)
      declaration.declare = true
    }
    return declaration
  }
  pp.parseClassId = function parseClassId(node, isStatement) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseClassId(node, isStatement)
    }
    if (!isStatement && this.isContextual("implements")) {
      return
    }
    this.vanilla_parseClassId(node, isStatement)
    const typeParameters = this.__ts_tsTryParseTypeParameters(
      this.__ts_tsParseInOutModifiers.bind(this)
    )
    if (typeParameters) node.typeParameters = typeParameters
  }
  pp.parseClassField = function parseClassField(field) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseClassField(field)
    }
    const isPrivate = field.key.type === "PrivateIdentifier"
    if (isPrivate) {
      if (field.abstract) {
        this.raise(field.start, PrivateElementHasAbstract)
      }
      if (field.accessibility) {
        this.raise(
          field.start,
          PrivateElementHasAccessibility({
            modifier: field.accessibility,
          })
        )
      }
      this.__ts_parseClassPropertyAnnotation(field)
    } else {
      this.__ts_parseClassPropertyAnnotation(field)
      if (
        this.__ts_isAmbientContext &&
        !(field.readonly && !field.typeAnnotation) &&
        this.__ts_match(tokTypes.eq)
      ) {
        this.raise(this.start, DeclareClassFieldHasInitializer)
      }
      if (field.abstract && this.__ts_match(tokTypes.eq)) {
        const { key } = field
        this.raise(
          this.start,
          AbstractPropertyHasInitializer({
            propertyName:
              key.type === "Identifier" && !field.computed
                ? key.name
                : `[${this.input.slice(key.start, key.end)}]`,
          })
        )
      }
    }
    return this.vanilla_parseClassField(field)
  }
  pp.parseClassMethod = function parseClassMethod(
    method,
    isGenerator,
    isAsync,
    allowsDirectSuper
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseClassMethod(method,
        isGenerator,
        isAsync,
        allowsDirectSuper
      )
    }
    const isConstructor = method.kind === "constructor"
    const isPrivate = method.key.type === "PrivateIdentifier"
    const typeParameters = this.__ts_tsTryParseTypeParameters(
      this.__ts_tsParseConstModifier.bind(this)
    )
    if (isPrivate) {
      if (typeParameters) method.typeParameters = typeParameters
      if (method.accessibility) {
        this.raise(
          method.start,
          PrivateMethodsHasAccessibility({
            modifier: method.accessibility,
          })
        )
      }
    } else {
      if (typeParameters && isConstructor) {
        this.raise(typeParameters.start, ConstructorHasTypeParameters)
      }
    }
    const { declare = false, kind } = method
    if (declare && (kind === "get" || kind === "set")) {
      this.raise(
        method.start,
        DeclareAccessor({
          kind,
        })
      )
    }
    if (typeParameters) method.typeParameters = typeParameters
    const key = method.key
    if (method.kind === "constructor") {
      if (isGenerator) this.raise(key.start, "Constructor can't be a generator")
      if (isAsync) this.raise(key.start, "Constructor can't be an async method")
    } else if (method.static && checkKeyName(method, "prototype")) {
      this.raise(
        key.start,
        "Classes may not have a static property named prototype"
      )
    }
    const value = (method.value = this.parseMethod(
      isGenerator,
      isAsync,
      allowsDirectSuper,
      true,
      method
    ))
    let params = value["params"]
    if (
      params.length > 0 &&
      params[0].type === "Identifier" &&
      params[0].name === "this"
    ) {
      params = params.slice(1)
    }
    if (method.kind === "get" && params.length !== 0)
      this.raiseRecoverable(value.start, "getter should have no params")
    if (method.kind === "set" && params.length !== 1)
      this.raiseRecoverable(value.start, "setter should have exactly one param")
    if (method.kind === "set" && params[0].type === "RestElement")
      this.raiseRecoverable(params[0].start, "Setter cannot use rest params")
    return this.finishNode(method, "MethodDefinition")
  }
  pp.parseClassElement = function parseClassElement(constructorAllowsSuper) {
    if (this.eat(tokTypes.semi)) return null
    let node = this.startNode()
    let keyName = ""
    let isGenerator = false
    let isAsync = false
    let kind = "method"
    let isStatic = false
    const modifiers = this.__ts_enabled
      ? [
        "declare",
        "private",
        "public",
        "protected",
        "accessor",
        "override",
        "abstract",
        "readonly",
        "static",
      ]
      : this.__ts_decoratorsEnabled ? ["accessor", "static"] : ["static"]
    const modifierMap = this.__ts_tsParseModifiers({
      modified: node,
      allowedModifiers: modifiers,
      disallowedModifiers: ["in", "out"],
      stopOnStartOfClassStaticBlock: true,
      errorTemplate: InvalidModifierOnTypeParameterPositions,
    })
    isStatic = Boolean(modifierMap.static)
    const callParseClassMemberWithIsStatic = () => {
      if (this.__ts_tsIsStartOfStaticBlocks()) {
        this.next()
        this.next()
        if (this.__ts_tsHasSomeModifiers(node, modifiers)) {
          this.raise(this.start, StaticBlockCannotHaveModifier)
        }
        if (this.__ts_ecmaVersion() >= 13) {
          this.vanilla_parseClassStaticBlock(node)
          return node
        }
      } else {
        const idx = this.__ts_enabled && this.__ts_tsTryParseIndexSignature(node)
        if (idx) {
          if (node.abstract) {
            this.raise(node.start, IndexSignatureHasAbstract)
          }
          if (node.accessibility) {
            this.raise(
              node.start,
              IndexSignatureHasAccessibility({
                modifier: node.accessibility,
              })
            )
          }
          if (node.declare) {
            this.raise(node.start, IndexSignatureHasDeclare)
          }
          if (node.override) {
            this.raise(node.start, IndexSignatureHasOverride)
          }
          return idx
        }
        if (!this.__ts_inAbstractClass && node.abstract) {
          this.raise(node.start, NonAbstractClassHasAbstractMethod)
        }
        if (node.override) {
          if (!constructorAllowsSuper) {
            this.raise(node.start, OverrideNotInSubClass)
          }
        }
        node.static = isStatic
        if (isStatic) {
          if (!(this.isClassElementNameStart() || this.type === tokTypes.star)) {
            keyName = "static"
          }
        }
        if (
          !keyName &&
          this.__ts_ecmaVersion() >= 8 &&
          this.eatContextual("async")
        ) {
          if (
            (this.isClassElementNameStart() || this.type === tokTypes.star) &&
            !this.canInsertSemicolon()
          ) {
            isAsync = true
          } else {
            keyName = "async"
          }
        }
        if (
          !keyName &&
          (this.__ts_ecmaVersion() >= 9 || !isAsync) &&
          this.eat(tokTypes.star)
        ) {
          isGenerator = true
        }
        if (!keyName && !isAsync && !isGenerator) {
          const lastValue = this.value
          if (this.eatContextual("get") || this.eatContextual("set")) {
            if (this.isClassElementNameStart()) {
              kind = lastValue
            } else {
              keyName = lastValue
            }
          }
        }
        if (keyName) {
          node.computed = false
          node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc)
          node.key.name = keyName
          this.finishNode(node.key, "Identifier")
        } else {
          this.parseClassElementName(node)
        }
        this.__ts_enabled && this.__ts_parsePostMemberNameModifiers(node)
        if (
          this.__ts_isClassMethod() ||
          this.__ts_ecmaVersion() < 13 ||
          this.type === tokTypes.parenL ||
          kind !== "method" ||
          isGenerator ||
          isAsync
        ) {
          const isConstructor = !node.static && checkKeyName(node, "constructor")
          const allowsDirectSuper = isConstructor && constructorAllowsSuper
          if (isConstructor && kind !== "method")
            this.raise(node.key.start, "Constructor can't have get/set modifier")
          node.kind = isConstructor ? "constructor" : kind
          this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper)
        } else {
          this.parseClassField(node)
        }
        return node
      }
    }
    if (node.declare) {
      this.__ts_tsInAmbientContext(callParseClassMemberWithIsStatic)
    } else {
      callParseClassMemberWithIsStatic()
    }
    return node
  }
  pp.isClassElementNameStart = function isClassElementNameStart() {
    if (!this.__ts_enabled) {
      return this.vanilla_isClassElementNameStart()
    }
    if (this.__ts_tsIsIdentifier()) {
      return true
    }
    return this.vanilla_isClassElementNameStart()
  }
  pp.parseClassSuper = function parseClassSuper(node) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseClassSuper(node)
    }
    this.vanilla_parseClassSuper(node)
    if (
      node.superClass &&
      (this.__ts_tsMatchLeftRelational() ||
        this.__ts_match(tokTypes.bitShift))
    ) {
      node.superTypeParameters = this.__ts_tsParseTypeArgumentsInExpression()
    }
    if (this.eatContextual("implements")) {
      node.implements = this.__ts_tsParseHeritageClause("implements")
    }
  }
  pp.parseFunctionParams = function parseFunctionParams(node) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseFunctionParams(node)
    }
    const typeParameters = this.__ts_tsTryParseTypeParameters(
      this.__ts_tsParseConstModifier.bind(this)
    )
    if (typeParameters) node.typeParameters = typeParameters
    this.vanilla_parseFunctionParams(node)
  }
  pp.parseVarId = function parseVarId(decl, kind) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseVarId(decl, kind)
    }
    this.vanilla_parseVarId(decl, kind)
    if (
      decl.id.type === "Identifier" &&
      !this.__ts_hasPrecedingLineBreak() &&
      this.value === "!" &&
      this.eat(tokTypes.prefix)
    ) {
      decl.definite = true
    }
    const type = this.__ts_tsTryParseTypeAnnotation()
    if (type) {
      decl.id.typeAnnotation = type
      this.__ts_resetEndLocation(decl.id)
    }
  }
  pp.parseArrowExpression = function parseArrowExpression(
    node,
    params,
    isAsync,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseArrowExpression(node,
        params,
        isAsync,
        forInit
      )
    }
    if (this.__ts_match(tokTypes.colon)) {
      node.returnType = this.__ts_tsParseTypeAnnotation()
    }
    let oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldAwaitIdentPos = this.awaitIdentPos
    this.enterScope(functionFlags(isAsync, false) | acornScope_SCOPE_ARROW)
    this.initFunction(node)
    const oldMaybeInArrowParameters = this.__ts_maybeInArrowParameters
    if (this.__ts_ecmaVersion() >= 8) node.async = !!isAsync
    this.yieldPos = 0
    this.awaitPos = 0
    this.awaitIdentPos = 0
    this.__ts_maybeInArrowParameters = true
    node.params = this.toAssignableList(params, true)
    this.__ts_maybeInArrowParameters = false
    this.parseFunctionBody(node, true, false, forInit)
    this.yieldPos = oldYieldPos
    this.awaitPos = oldAwaitPos
    this.awaitIdentPos = oldAwaitIdentPos
    this.__ts_maybeInArrowParameters = oldMaybeInArrowParameters
    return this.finishNode(node, "ArrowFunctionExpression")
  }
  pp.parseMaybeAssign = function parseMaybeAssign(
    forInit,
    refExpressionErrors,
    afterLeftParse
  ) {
    let _jsxResult,
      _jsxResult2,
      _typeCast,
      _jsxResult3,
      _typeCast2,
      _jsxResult4,
      _typeCast3
    if (!this.__ts_enabled) {
      return this.__ts_super_parseMaybeAssign(
        forInit,
        refExpressionErrors,
        afterLeftParse
      )
    }
    let state
    let jsxResult
    let typeCast
    if (this.__ts_jsxEnabled && this.__ts_tsMatchLeftRelational()) {
      state = this.__ts_cloneCurLookaheadState()
      this.finishToken(tokTypes2.jsxTagStart)
      jsxResult = this.__ts_tryParse(
        () =>
          this.__ts_super_parseMaybeAssign(
            forInit,
            refExpressionErrors,
            afterLeftParse
          ),
        state
      )
      if (!jsxResult.error) return jsxResult.node
      const context = this.context
      const currentContext = context[context.length - 1]
      const lastCurrentContext = context[context.length - 2]
      if (
        currentContext === tokContexts3.tc_oTag &&
        lastCurrentContext === tokContexts3.tc_expr
      ) {
        context.pop()
        context.pop()
      } else if (
        currentContext === tokContexts3.tc_oTag ||
        currentContext === tokContexts3.tc_expr
      ) {
        context.pop()
      }
    }
    if (
      !(
        (_jsxResult = jsxResult) !== null &&
        _jsxResult !== undefined &&
        _jsxResult.error
      ) &&
      !this.__ts_tsMatchLeftRelational()
    ) {
      return this.__ts_super_parseMaybeAssign(
        forInit,
        refExpressionErrors,
        afterLeftParse
      )
    }
    if (
      !state ||
      this.__ts_compareLookaheadState(state, this.__ts_getCurLookaheadState())
    ) {
      state = this.__ts_cloneCurLookaheadState()
    }
    let typeParameters
    const arrow = this.__ts_tryParse((abort) => {
      let _expr$extra, _typeParameters
      typeParameters = this.__ts_tsParseTypeParameters(
        this.__ts_tsParseConstModifier.bind(this)
      )
      const expr = this.__ts_super_parseMaybeAssign(
        forInit,
        refExpressionErrors,
        afterLeftParse
      )
      if (
        expr.type !== "ArrowFunctionExpression" ||
        ((_expr$extra = expr.extra) !== null &&
          _expr$extra !== undefined &&
          _expr$extra.parenthesized)
      ) {
        abort()
      }
      if (
        ((_typeParameters = typeParameters) === null ||
          _typeParameters === undefined
          ? undefined
          : _typeParameters.params.length) !== 0
      ) {
        this.resetStartLocationFromNode(expr, typeParameters)
      }
      expr.typeParameters = typeParameters
      return expr
    }, state)
    if (!arrow.error && !arrow.aborted) {
      if (typeParameters)
        this.__ts_reportReservedArrowTypeParam(typeParameters)
      return arrow.node
    }
    if (!jsxResult) {
      typeCast = this.__ts_tryParse(
        () =>
          this.__ts_super_parseMaybeAssign(
            forInit,
            refExpressionErrors,
            afterLeftParse
          ),
        state
      )
      if (!typeCast.error) return typeCast.node
    }
    if (
      (_jsxResult2 = jsxResult) !== null &&
      _jsxResult2 !== undefined &&
      _jsxResult2.node
    ) {
      this.__ts_setLookaheadState(jsxResult.failState)
      return jsxResult.node
    }
    if (arrow.node) {
      this.__ts_setLookaheadState(arrow.failState)
      if (typeParameters)
        this.__ts_reportReservedArrowTypeParam(typeParameters)
      return arrow.node
    }
    if (
      (_typeCast = typeCast) !== null &&
      _typeCast !== undefined &&
      _typeCast.node
    ) {
      this.__ts_setLookaheadState(typeCast.failState)
      return typeCast.node
    }
    if (
      (_jsxResult3 = jsxResult) !== null &&
      _jsxResult3 !== undefined &&
      _jsxResult3.thrown
    )
      this.raise(jsxResult.error.pos, jsxResult.error.message)
    if (arrow.thrown) this.raise(arrow.error.pos, arrow.error.message)
    if (
      (_typeCast2 = typeCast) !== null &&
      _typeCast2 !== undefined &&
      _typeCast2.thrown
    )
      this.raise(typeCast.error.pos, typeCast.error.message)
    const err = (
      ((_jsxResult4 = jsxResult) === null || _jsxResult4 === undefined
        ? undefined
        : _jsxResult4.error) ||
      arrow.error ||
      ((_typeCast3 = typeCast) === null || _typeCast3 === undefined
        ? undefined
        : _typeCast3.error)
    );
    this.raise(err.pos, err.message)
  }
  pp.parseAssignableListItem = function parseAssignableListItem(allowModifiers) {
    const decorators = []
    if (this.__ts_decoratorsEnabled) {
      while (this.__ts_match(tokTypes2.at)) {
        decorators.push(this.__ts_parseDecorator())
      }
    }
    if (!this.__ts_enabled) {
      const elt = this.vanilla_parseAssignableListItem(allowModifiers)
      if (decorators.length) {
        elt.decorators = decorators
      }
      return elt
    }
    const startPos = this.start
    const startLoc = this.startLoc
    let accessibility
    let readonly = false
    let override = false
    if (allowModifiers !== undefined) {
      const modified = {}
      this.__ts_tsParseModifiers({
        modified,
        allowedModifiers: [
          "public",
          "private",
          "protected",
          "override",
          "readonly",
        ],
      })
      accessibility = modified.accessibility
      override = modified.override
      readonly = modified.readonly
      if (allowModifiers === false && (accessibility || readonly || override)) {
        this.raise(startLoc.column, UnexpectedParameterModifier)
      }
    }
    const left = this.parseMaybeDefault(startPos, startLoc)
    this.parseBindingListItem(left)
    const elt = this.parseMaybeDefault(left["start"], left["loc"].start, left)
    if (decorators.length) {
      elt.decorators = decorators
    }
    if (accessibility || readonly || override) {
      const pp2 = this.startNodeAt(startPos, startLoc)
      if (accessibility) pp2.accessibility = accessibility
      if (readonly) pp2.readonly = readonly
      if (override) pp2.override = override
      if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
        this.raise(pp2.start, UnsupportedParameterPropertyKind)
      }
      pp2.parameter = elt
      return this.finishNode(pp2, "TSParameterProperty")
    }
    return elt
  }
  pp.checkLValInnerPattern = function checkLValInnerPattern(
    expr,
    bindingType = acornScope_BIND_NONE,
    checkClashes
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_checkLValInnerPattern(expr,
        bindingType,
        checkClashes
      )
    }
    switch (expr.type) {
      case "TSParameterProperty":
        this.checkLValInnerPattern(expr.parameter, bindingType, checkClashes)
        break
      default: {
        this.vanilla_checkLValInnerPattern(expr,
          bindingType,
          checkClashes
        )
        break
      }
    }
  }
  pp.parseBindingListItem = function parseBindingListItem(param) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseBindingListItem(param)
    }
    if (this.eat(tokTypes.question)) {
      param.optional = true
    }
    const type = this.__ts_tsTryParseTypeAnnotation()
    if (type) param.typeAnnotation = type
    this.__ts_resetEndLocation(param)
    return param
  }
  pp.parseYield = function parseYield(forInit) {
    if (!this.__ts_enabled) {
      return this.__ts_super_parseYield(forInit)
    }
    if (!this.yieldPos) {
      this.yieldPos = this.start
    }
    const lookahead = this.__ts_lookahead()
    if (lookahead.type === tokTypes.relational && lookahead.value === "<") {
      const result = this.__ts_tryParse((abort) => {
        this.next()
        let node = this.startNode()
        const expr = this.parseMaybeAssign(forInit)
        if (expr.type !== "TSTypeAssertion") abort()
        node.delegate = false
        node.argument = expr
        return this.finishNode(node, "YieldExpression")
      })
      if (!result.aborted && !result.thrown && result.node) {
        return result.node
      }
    }
    return this.__ts_super_parseYield(forInit)
  }
  pp.isSimpleAssignTarget = function isSimpleAssignTarget(expr) {
    if (!this.__ts_enabled) {
      return this.vanilla_isSimpleAssignTarget(expr)
    }
    return (
      expr.type === "TSAsExpression" ||
      expr.type === "TSSatisfiesExpression" ||
      expr.type === "TSNonNullExpression" ||
      expr.type === "TSTypeAssertion" ||
      this.vanilla_isSimpleAssignTarget(expr)
    )
  }
  pp.toAssignable = function toAssignable(
    node,
    isBinding = false,
    refDestructuringErrors = new DestructuringErrors()
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_toAssignable(node,
        isBinding,
        refDestructuringErrors
      )
    }
    switch (node.type) {
      case "ParenthesizedExpression":
        return this.__ts_toAssignableParenthesizedExpression(
          node,
          isBinding,
          refDestructuringErrors
        )
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
        return this.toAssignable(
          node.expression,
          isBinding,
          refDestructuringErrors
        )
      case "MemberExpression":
        break
      case "AssignmentExpression":
        if (!isBinding && node.left.type === "TSTypeCastExpression") {
          node.left = this.__ts_typeCastToParameter(node.left)
        }
        return this.vanilla_toAssignable(node,
          isBinding,
          refDestructuringErrors
        )
      case "TSTypeCastExpression": {
        return this.toAssignable(this.__ts_typeCastToParameter(node))
      }
      default:
        return this.vanilla_toAssignable(node,
          isBinding,
          refDestructuringErrors
        )
    }
    return node
  }
  pp.parseBindingAtom = function parseBindingAtom() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseBindingAtom()
    }
    switch (this.type) {
      case tokTypes._this:
        return this.parseIdent(/* liberal */ true)
      default:
        return this.vanilla_parseBindingAtom()
    }
  }
  pp.shouldParseArrow = function shouldParseArrow(exprList) {
    if (!this.__ts_enabled) {
      return this.vanilla_shouldParseArrow()
    }
    let shouldParseArrowRes
    if (this.__ts_match(tokTypes.colon)) {
      shouldParseArrowRes = exprList.every((expr) =>
        this.__ts_isAssignable(expr, true)
      )
    } else {
      shouldParseArrowRes = !this.canInsertSemicolon()
    }
    if (shouldParseArrowRes) {
      if (this.__ts_match(tokTypes.colon)) {
        const result = this.__ts_tryParse((abort) => {
          const returnType = this.__ts_tsParseTypeOrTypePredicateAnnotation(
            tokTypes.colon
          )
          if (this.canInsertSemicolon() || !this.__ts_match(tokTypes.arrow))
            abort()
          return returnType
        })
        if (result.aborted) {
          this.__ts_shouldParseArrowReturnType = undefined
          return false
        }
        if (!result.thrown) {
          if (result.error) this.__ts_setLookaheadState(result.failState)
          this.__ts_shouldParseArrowReturnType = result.node
        }
      }
      if (!this.__ts_match(tokTypes.arrow)) {
        this.__ts_shouldParseArrowReturnType = undefined
        return false
      }
      return true
    }
    this.__ts_shouldParseArrowReturnType = undefined
    return shouldParseArrowRes
  }
  pp.parseParenArrowList = function parseParenArrowList(
    startPos,
    startLoc,
    exprList,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseParenArrowList(startPos,
        startLoc,
        exprList,
        forInit
      )
    }
    const node = this.startNodeAt(startPos, startLoc)
    node.returnType = this.__ts_shouldParseArrowReturnType
    this.__ts_shouldParseArrowReturnType = undefined
    return this.parseArrowExpression(node, exprList, false, forInit)
  }
  pp.parseParenAndDistinguishExpression =
    function parseParenAndDistinguishExpression(canBeArrow, forInit) {
      if (!this.__ts_enabled) {
        return this.vanilla_parseParenAndDistinguishExpression(canBeArrow,
          forInit
        )
      }
      let startPos = this.start,
        startLoc = this.startLoc,
        val,
        allowTrailingComma = this.__ts_ecmaVersion() >= 8
      if (this.__ts_ecmaVersion() >= 6) {
        const oldMaybeInArrowParameters = this.__ts_maybeInArrowParameters
        this.__ts_maybeInArrowParameters = true
        this.next()
        let innerStartPos = this.start,
          innerStartLoc = this.startLoc
        let exprList = [],
          first = true,
          lastIsComma = false
        let refDestructuringErrors = new DestructuringErrors(),
          oldYieldPos = this.yieldPos,
          oldAwaitPos = this.awaitPos,
          spreadStart
        this.yieldPos = 0
        this.awaitPos = 0
        while (this.type !== tokTypes.parenR) {
          first ? (first = false) : this.expect(tokTypes.comma)
          if (
            allowTrailingComma &&
            this.afterTrailingComma(tokTypes.parenR, true)
          ) {
            lastIsComma = true
            break
          } else if (this.type === tokTypes.ellipsis) {
            spreadStart = this.start
            exprList.push(this.parseParenItem(this.parseRestBinding()))
            if (this.type === tokTypes.comma) {
              this.raise(
                this.start,
                "Comma is not permitted after the rest element"
              )
            }
            break
          } else {
            exprList.push(
              this.parseMaybeAssign(
                forInit,
                refDestructuringErrors,
                this.parseParenItem
              )
            )
          }
        }
        let innerEndPos = this.lastTokEnd,
          innerEndLoc = this.lastTokEndLoc
        this.expect(tokTypes.parenR)
        this.__ts_maybeInArrowParameters = oldMaybeInArrowParameters
        if (
          canBeArrow &&
          this.shouldParseArrow(exprList) &&
          this.eat(tokTypes.arrow)
        ) {
          this.checkPatternErrors(refDestructuringErrors, false)
          this.checkYieldAwaitInDefaultParams()
          this.yieldPos = oldYieldPos
          this.awaitPos = oldAwaitPos
          return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
        }
        if (!exprList.length || lastIsComma) this.unexpected(this.lastTokStart)
        if (spreadStart) this.unexpected(spreadStart)
        this.checkExpressionErrors(refDestructuringErrors, true)
        this.yieldPos = oldYieldPos || this.yieldPos
        this.awaitPos = oldAwaitPos || this.awaitPos
        if (exprList.length > 1) {
          val = this.startNodeAt(innerStartPos, innerStartLoc)
          val.expressions = exprList
          this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc)
        } else {
          val = exprList[0]
        }
      } else {
        val = this.parseParenExpression()
      }
      if (this.options.preserveParens) {
        let par = this.startNodeAt(startPos, startLoc)
        par.expression = val
        return this.finishNode(par, "ParenthesizedExpression")
      } else {
        return val
      }
    }
  pp.shouldParseAsyncArrow = function shouldParseAsyncArrow() {
    if (!this.__ts_enabled) {
      return this.vanilla_shouldParseAsyncArrow()
    }
    if (this.__ts_match(tokTypes.colon)) {
      const result = this.__ts_tryParse((abort) => {
        const returnType = this.__ts_tsParseTypeOrTypePredicateAnnotation(
          tokTypes.colon
        )
        if (this.canInsertSemicolon() || !this.__ts_match(tokTypes.arrow))
          abort()
        return returnType
      })
      if (result.aborted) {
        this.__ts_shouldParseAsyncArrowReturnType = undefined
        return false
      }
      if (!result.thrown) {
        if (result.error) this.__ts_setLookaheadState(result.failState)
        this.__ts_shouldParseAsyncArrowReturnType = result.node
        return !this.canInsertSemicolon() && this.eat(tokTypes.arrow)
      }
    } else {
      return !this.canInsertSemicolon() && this.eat(tokTypes.arrow)
    }
  }
  pp.parseSubscriptAsyncArrow = function parseSubscriptAsyncArrow(
    startPos,
    startLoc,
    exprList,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseSubscriptAsyncArrow(startPos,
        startLoc,
        exprList,
        forInit
      )
    }
    const arrN = this.startNodeAt(startPos, startLoc)
    arrN.returnType = this.__ts_shouldParseAsyncArrowReturnType
    this.__ts_shouldParseAsyncArrowReturnType = undefined
    return this.parseArrowExpression(arrN, exprList, true, forInit)
  }
  pp.parseExprList = function parseExprList(
    close,
    allowTrailingComma,
    allowEmpty,
    refDestructuringErrors
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExprList(close,
        allowTrailingComma,
        allowEmpty,
        refDestructuringErrors
      )
    }
    let elts = [],
      first = true
    while (!this.eat(close)) {
      if (!first) {
        this.expect(tokTypes.comma)
        if (allowTrailingComma && this.afterTrailingComma(close)) break
      } else first = false
      let elt
      if (allowEmpty && this.type === tokTypes.comma) elt = null
      else if (this.type === tokTypes.ellipsis) {
        elt = this.parseSpread(refDestructuringErrors)
        if (
          this.__ts_maybeInArrowParameters &&
          this.__ts_match(tokTypes.colon)
        ) {
          elt.typeAnnotation = this.__ts_tsParseTypeAnnotation()
        }
        if (
          refDestructuringErrors &&
          this.type === tokTypes.comma &&
          refDestructuringErrors.trailingComma < 0
        )
          refDestructuringErrors.trailingComma = this.start
      } else {
        elt = this.parseMaybeAssign(
          false,
          refDestructuringErrors,
          this.parseParenItem
        )
      }
      elts.push(elt)
    }
    return elts
  }
  pp.parseSubscript = function parseSubscript(
    base,
    startPos,
    startLoc,
    noCalls,
    maybeAsyncArrow,
    optionalChained,
    forInit
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseSubscript(base,
        startPos,
        startLoc,
        noCalls,
        maybeAsyncArrow,
        optionalChained,
        forInit
      )
    }
    let _optionalChained = optionalChained
    if (
      !this.__ts_hasPrecedingLineBreak() &&
      // NODE: replace bang
      this.value === "!" &&
      this.__ts_match(tokTypes.prefix)
    ) {
      this.exprAllowed = false
      this.next()
      const nonNullExpression = this.startNodeAt(startPos, startLoc)
      nonNullExpression.expression = base
      base = this.finishNode(nonNullExpression, "TSNonNullExpression")
      return base
    }
    let isOptionalCall = false
    if (
      this.__ts_match(tokTypes.questionDot) &&
      this.__ts_lookaheadCharCode() === 60
    ) {
      if (noCalls) {
        return base
      }
      base.optional = true
      _optionalChained = isOptionalCall = true
      this.next()
    }
    if (
      this.__ts_tsMatchLeftRelational() ||
      this.__ts_match(tokTypes.bitShift)
    ) {
      let missingParenErrorLoc
      const result = this.__ts_tsTryParseAndCatch(() => {
        if (!noCalls && this.__ts_atPossibleAsyncArrow(base)) {
          const asyncArrowFn = this.__ts_tsTryParseGenericAsyncArrowFunction(
            startPos,
            startLoc,
            forInit
          )
          if (asyncArrowFn) {
            base = asyncArrowFn
            return base
          }
        }
        const typeArguments = this.__ts_tsParseTypeArgumentsInExpression()
        if (!typeArguments) return base
        if (isOptionalCall && !this.__ts_match(tokTypes.parenL)) {
          missingParenErrorLoc = this.curPosition()
          return base
        }
        if (tokenIsTemplate(this.type) || this.type === tokTypes.backQuote) {
          const result2 = this.__ts_parseTaggedTemplateExpression(
            base,
            startPos,
            startLoc,
            _optionalChained
          )
          result2.typeArguments = typeArguments
          return result2
        }
        if (!noCalls && this.eat(tokTypes.parenL)) {
          let refDestructuringErrors = new DestructuringErrors()
          const node2 = this.startNodeAt(startPos, startLoc)
          node2.callee = base
          node2.arguments = this.parseExprList(
            tokTypes.parenR,
            this.__ts_ecmaVersion() >= 8,
            false,
            refDestructuringErrors
          )
          this.__ts_tsCheckForInvalidTypeCasts(node2.arguments)
          node2.typeArguments = typeArguments
          if (_optionalChained) {
            node2.optional = isOptionalCall
          }
          this.checkExpressionErrors(refDestructuringErrors, true)
          base = this.finishNode(node2, "CallExpression")
          return base
        }
        const tokenType = this.type
        if (
          // a<b>>c is not (a<b>)>c, but a<(b>>c)
          this.__ts_tsMatchRightRelational() ||
          // a<b>>>c is not (a<b>)>>c, but a<(b>>>c)
          tokenType === tokTypes.bitShift ||
          // a<b>c is (a<b)>c
          (tokenType !== tokTypes.parenL &&
            tokenCanStartExpression(tokenType) &&
            !this.__ts_hasPrecedingLineBreak())
        ) {
          return
        }
        const node = this.startNodeAt(startPos, startLoc)
        node.expression = base
        node.typeArguments = typeArguments
        return this.finishNode(node, "TSInstantiationExpression")
      })
      if (missingParenErrorLoc) {
        this.unexpected(missingParenErrorLoc)
      }
      if (result) {
        if (
          result.type === "TSInstantiationExpression" &&
          (this.__ts_match(tokTypes.dot) ||
            (this.__ts_match(tokTypes.questionDot) &&
              this.__ts_lookaheadCharCode() !== 40))
        ) {
          this.raise(
            this.start,
            InvalidPropertyAccessAfterInstantiationExpression
          )
        }
        base = result
        return base
      }
    }
    let optionalSupported = this.__ts_ecmaVersion() >= 11
    let optional = optionalSupported && this.eat(tokTypes.questionDot)
    if (noCalls && optional)
      this.raise(
        this.lastTokStart,
        "Optional chaining cannot appear in the callee of new expressions"
      )
    let computed = this.eat(tokTypes.bracketL)
    if (
      computed ||
      (optional &&
        this.type !== tokTypes.parenL &&
        this.type !== tokTypes.backQuote) ||
      this.eat(tokTypes.dot)
    ) {
      let node = this.startNodeAt(startPos, startLoc)
      node.object = base
      if (computed) {
        node.property = this.parseExpression()
        this.expect(tokTypes.bracketR)
      } else if (this.type === tokTypes.privateId && base.type !== "Super") {
        node.property = this.parsePrivateIdent()
      } else {
        node.property = this.parseIdent(this.options.allowReserved !== "never")
      }
      node.computed = !!computed
      if (optionalSupported) {
        node.optional = optional
      }
      base = this.finishNode(node, "MemberExpression")
    } else if (!noCalls && this.eat(tokTypes.parenL)) {
      const oldMaybeInArrowParameters = this.__ts_maybeInArrowParameters
      this.__ts_maybeInArrowParameters = true
      let refDestructuringErrors = new DestructuringErrors(),
        oldYieldPos = this.yieldPos,
        oldAwaitPos = this.awaitPos,
        oldAwaitIdentPos = this.awaitIdentPos
      this.yieldPos = 0
      this.awaitPos = 0
      this.awaitIdentPos = 0
      let exprList = this.parseExprList(
        tokTypes.parenR,
        this.__ts_ecmaVersion() >= 8,
        false,
        refDestructuringErrors
      )
      if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
        this.checkPatternErrors(refDestructuringErrors, false)
        this.checkYieldAwaitInDefaultParams()
        if (this.awaitIdentPos > 0)
          this.raise(
            this.awaitIdentPos,
            "Cannot use 'await' as identifier inside an async function"
          )
        this.yieldPos = oldYieldPos
        this.awaitPos = oldAwaitPos
        this.awaitIdentPos = oldAwaitIdentPos
        base = this.parseSubscriptAsyncArrow(
          startPos,
          startLoc,
          exprList,
          forInit
        )
      } else {
        this.checkExpressionErrors(refDestructuringErrors, true)
        this.yieldPos = oldYieldPos || this.yieldPos
        this.awaitPos = oldAwaitPos || this.awaitPos
        this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos
        let node = this.startNodeAt(startPos, startLoc)
        node.callee = base
        node.arguments = exprList
        if (optionalSupported) {
          node.optional = optional
        }
        base = this.finishNode(node, "CallExpression")
      }
      this.__ts_maybeInArrowParameters = oldMaybeInArrowParameters
    } else if (this.type === tokTypes.backQuote) {
      if (optional || _optionalChained) {
        this.raise(
          this.start,
          "Optional chaining cannot appear in the tag of tagged template expressions"
        )
      }
      let node = this.startNodeAt(startPos, startLoc)
      node.tag = base
      node.quasi = this.parseTemplate({
        isTagged: true,
      })
      base = this.finishNode(node, "TaggedTemplateExpression")
    }
    return base
  }
  pp.parseGetterSetter = function parseGetterSetter(prop) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseGetterSetter(prop)
    }
    prop.kind = prop.key.name
    this.parsePropertyName(prop)
    const typeParameters = this.__ts_tsTryParseTypeParameters(
      this.__ts_tsParseConstModifier.bind(this)
    )
    prop.value = this.parseMethod(false)
    if (typeParameters) prop.value.typeParameters = typeParameters
    let paramCount = prop.kind === "get" ? 0 : 1
    const firstParam = prop.value.params[0]
    const hasContextParam = firstParam && this.__ts_isThisParam(firstParam)
    paramCount = hasContextParam ? paramCount + 1 : paramCount
    if (prop.value.params.length !== paramCount) {
      let start = prop.value.start
      if (prop.kind === "get")
        this.raiseRecoverable(start, "getter should have no params")
      else this.raiseRecoverable(start, "setter should have exactly one param")
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
        this.raiseRecoverable(
          prop.value.params[0].start,
          "Setter cannot use rest params"
        )
    }
  }
  pp.parsePropertyValue = function parsePropertyValue(
    prop,
    isPattern,
    isGenerator,
    isAsync,
    startPos,
    startLoc,
    refDestructuringErrors,
    containsEsc
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parsePropertyValue(prop,
        isPattern,
        isGenerator,
        isAsync,
        startPos,
        startLoc,
        refDestructuringErrors,
        containsEsc
      )
    }
    if (this.__ts_tsMatchLeftRelational()) {
      if (isPattern) this.unexpected()
      prop.kind = "init"
      prop.method = true
      const typeParameters = this.__ts_tsTryParseTypeParameters(
        this.__ts_tsParseConstModifier.bind(this)
      )
      prop.value = this.parseMethod(isGenerator, isAsync)
      if (typeParameters) prop.value.typeParameters = typeParameters
      return
    }
    return this.vanilla_parsePropertyValue(prop,
      isPattern,
      isGenerator,
      isAsync,
      startPos,
      startLoc,
      refDestructuringErrors,
      containsEsc
    )
  }
  pp.parseProperty = function parseProperty(isPattern, refDestructuringErrors) {
    if (!this.__ts_decoratorsEnabled) {
      return this.vanilla_parseProperty(isPattern,
        refDestructuringErrors
      )
    }
    if (!isPattern) {
      let decorators = []
      if (this.__ts_match(tokTypes2.at)) {
        while (this.__ts_match(tokTypes2.at)) {
          decorators.push(this.__ts_parseDecorator())
        }
      }
      const property = this.vanilla_parseProperty(isPattern,
        refDestructuringErrors
      )
      if (property.type === "SpreadElement") {
        if (decorators.length) this.raise(property.start, SpreadElementDecorator)
      }
      if (decorators.length) {
        property.decorators = decorators
        decorators = []
      }
      return property
    }
    return this.vanilla_parseProperty(isPattern,
      refDestructuringErrors
    )
  }
  pp.parseCatchClauseParam = function parseCatchClauseParam() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseCatchClauseParam()
    }
    const param = this.parseBindingAtom()
    let simple = param.type === "Identifier"
    this.enterScope(simple ? acornScope_SCOPE_SIMPLE_CATCH : 0)
    this.checkLValPattern(
      param,
      simple ? acornScope_BIND_SIMPLE_CATCH : acornScope_BIND_LEXICAL
    )
    const type = this.__ts_tsTryParseTypeAnnotation()
    if (type) {
      param.typeAnnotation = type
      this.__ts_resetEndLocation(param)
    }
    this.expect(tokTypes.parenR)
    return param
  }
  pp.parseClass = function parseClass(node, isStatement) {
    const oldInAbstractClass = this.__ts_inAbstractClass
    this.__ts_inAbstractClass = !!node.abstract
    try {
      this.next()
      if (this.__ts_decoratorsEnabled) this.__ts_takeDecorators(node)
      const oldStrict = this.strict
      this.strict = true
      this.parseClassId(node, isStatement)
      const oldAmbient = this.__ts_isAmbientContext
      if (node.declare) this.__ts_isAmbientContext = true
      this.parseClassSuper(node)
      this.__ts_isAmbientContext = oldAmbient
      const privateNameMap = this.enterClassBody()
      const classBody = this.startNode()
      let hadConstructor = false
      classBody.body = []
      let decorators = []
      this.expect(tokTypes.braceL)
      while (this.type !== tokTypes.braceR) {
        if (this.__ts_decoratorsEnabled && this.__ts_match(tokTypes2.at)) {
          decorators.push(this.__ts_parseDecorator())
          continue
        }
        const element = this.parseClassElement(node.superClass !== null)
        if (decorators.length) {
          element.decorators = decorators
          this.resetStartLocationFromNode(element, decorators[0])
          decorators = []
        }
        if (element) {
          let _element$value
          classBody.body.push(element)
          if (
            element.type === "MethodDefinition" &&
            element.kind === "constructor" &&
            element.value.type === "FunctionExpression"
          ) {
            if (hadConstructor) {
              this.raiseRecoverable(
                element.start,
                "Duplicate constructor in the same class"
              )
            }
            hadConstructor = true
            if (element.decorators && element.decorators.length > 0) {
              this.raise(element.start, DecoratorConstructor)
            }
          } else if (
            element.key &&
            element.key.type === "PrivateIdentifier" &&
            ((_element$value = element.value) === null ||
              _element$value === undefined
              ? undefined
              : _element$value.type) !== "TSDeclareMethod" &&
            isPrivateNameConflicted(privateNameMap, element)
          ) {
            this.raiseRecoverable(
              element.key.start,
              `Identifier '#${element.key.name}' has already been declared`
            )
          }
        }
      }
      this.strict = oldStrict
      this.next()
      if (decorators.length) {
        this.raise(this.start, TrailingDecorator)
      }
      node.body = this.finishNode(classBody, "ClassBody")
      this.exitClassBody()
      return this.finishNode(
        node,
        isStatement ? "ClassDeclaration" : "ClassExpression"
      )
    } finally {
      this.__ts_inAbstractClass = oldInAbstractClass
    }
  }
  pp.parseMethod = function parseMethod(
    isGenerator,
    isAsync,
    allowDirectSuper,
    inClassScope,
    method
  ) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseMethod(isGenerator,
        isAsync,
        allowDirectSuper,
        inClassScope,
        method
      )
    }
    let node = this.startNode(),
      oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldAwaitIdentPos = this.awaitIdentPos
    this.initFunction(node)
    if (this.__ts_ecmaVersion() >= 6) node.generator = isGenerator
    if (this.__ts_ecmaVersion() >= 8) node.async = !!isAsync
    this.yieldPos = 0
    this.awaitPos = 0
    this.awaitIdentPos = 0
    this.enterScope(
      functionFlags(isAsync, node.generator) |
      acornScope_SCOPE_SUPER |
      (allowDirectSuper ? acornScope_SCOPE_DIRECT_SUPER : 0)
    )
    this.expect(tokTypes.parenL)
    node.params = this.__ts_parseClassFunctionParams()
    this.checkYieldAwaitInDefaultParams()
    this.parseFunctionBody(node, false, true, false, {
      isClassMethod: inClassScope,
    })
    this.yieldPos = oldYieldPos
    this.awaitPos = oldAwaitPos
    this.awaitIdentPos = oldAwaitIdentPos
    if (method && method.abstract) {
      const hasBody = !!node.body
      if (hasBody) {
        const { key } = method
        this.raise(
          method.start,
          AbstractMethodHasImplementation({
            methodName:
              key.type === "Identifier" && !method.computed
                ? key.name
                : `[${this.input.slice(key.start, key.end)}]`,
          })
        )
      }
    }
    return this.finishNode(node, "FunctionExpression")
  }
  pp.parseImportSpecifier = function parseImportSpecifier() {
    if (!this.__ts_enabled) {
      return this.vanilla_parseImportSpecifier()
    }
    const isMaybeTypeOnly = this.isContextual("type")
    if (isMaybeTypeOnly) {
      let node = this.startNode()
      node.imported = this.parseModuleExportName()
      this.__ts_parseTypeOnlyImportExportSpecifier(
        node /* isImport */,
        true,
        this.__ts_importOrExportOuterKind === "type"
      )
      return this.finishNode(node, "ImportSpecifier")
    } else {
      const node = this.vanilla_parseImportSpecifier()
      node.importKind = "value"
      return node
    }
  }
  pp.parseExportSpecifier = function parseExportSpecifier(exports) {
    if (!this.__ts_enabled) {
      return this.vanilla_parseExportSpecifier(exports)
    }
    const isMaybeTypeOnly = this.isContextual("type")
    const isString = this.__ts_match(tokTypes.string)
    if (!isString && isMaybeTypeOnly) {
      let node = this.startNode()
      node.local = this.parseModuleExportName()
      this.__ts_parseTypeOnlyImportExportSpecifier(
        node /* isImport */,
        false,
        this.__ts_importOrExportOuterKind === "type"
      )
      this.finishNode(node, "ExportSpecifier")
      this.checkExport(exports, node.exported, node.exported.start)
      return node
    } else {
      const node = this.vanilla_parseExportSpecifier(exports)
      node.exportKind = "value"
      return node
    }
  }
  pp.raiseRecoverable = function raiseRecoverable(pos, message) {
    if (!this.__ts_enabled) {
      return this.vanilla_raiseRecoverable(pos, message)
    }
    return this.__ts_raiseCommonCheck(pos, message, true)
  }
  pp.raise = function raise(pos, message) {
    if (!this.__ts_enabled) {
      return this.vanilla_raise(pos, message)
    }
    return this.__ts_raiseCommonCheck(pos, message, true)
  }
  pp.updateContext = function updateContext(prevType) {
    if (!this.__ts_enabled) {
      return this.__ts_super_updateContext(prevType)
    }
    const { type } = this
    if (type === tokTypes.braceL) {
      let curContext = this.curContext()
      if (curContext === tokContexts3.tc_oTag)
        this.context.push(tokContexts.b_expr)
      else if (curContext === tokContexts3.tc_expr)
        this.context.push(tokContexts.b_tmpl)
      else this.__ts_super_updateContext(prevType)
      this.exprAllowed = true
    } else if (type === tokTypes.slash && prevType === tokTypes2.jsxTagStart) {
      this.context.length -= 2
      this.context.push(tokContexts3.tc_cTag)
      this.exprAllowed = false
    } else {
      return this.__ts_super_updateContext(prevType)
    }
  }
  pp.__ts_jsx_parseOpeningElementAt = function __ts_jsx_parseOpeningElementAt(
    startPos,
    startLoc
  ) {
    if (!this.__ts_enabled) {
      return this.__ts_super_jsx_parseOpeningElementAt(startPos, startLoc)
    }
    let node = this.startNodeAt(startPos, startLoc)
    let nodeName = this.__ts_super_jsx_parseElementName()
    if (nodeName) node.name = nodeName
    if (
      this.__ts_match(tokTypes.relational) ||
      this.__ts_match(tokTypes.bitShift)
    ) {
      const typeArguments = this.__ts_tsTryParseAndCatch(() =>
        this.__ts_tsParseTypeArgumentsInExpression()
      )
      if (typeArguments) node.typeArguments = typeArguments
    }
    node.attributes = []
    while (this.type !== tokTypes.slash && this.type !== tokTypes2.jsxTagEnd)
      node.attributes.push(this.__ts_super_jsx_parseAttribute())
    node.selfClosing = this.eat(tokTypes.slash)
    this.expect(tokTypes2.jsxTagEnd)
    return this.finishNode(
      node,
      nodeName ? "JSXOpeningElement" : "JSXOpeningFragment"
    )
  }
  pp.enterScope = function enterScope(flags) {
    if (flags === TS_SCOPE_TS_MODULE) {
      this.__ts_importsStack.push([])
    }
    this.vanilla_enterScope(flags)
    const scope = this.vanilla_currentScope()
    scope.types = []
    scope.enums = []
    scope.constEnums = []
    scope.classes = []
    scope.exportOnlyBindings = []
  }
  pp.exitScope = function exitScope() {
    if (!this.__ts_enabled) {
      return this.vanilla_exitScope()
    }
    const scope = this.vanilla_currentScope()
    if (scope.flags === TS_SCOPE_TS_MODULE) {
      this.__ts_importsStack.pop()
    }
    this.vanilla_exitScope()
  }
  pp.declareName = function declareName(name, bindingType, pos) {
    if (!this.__ts_enabled) {
      return this.vanilla_declareName(name, bindingType, pos)
    }
    if (bindingType & acornScope_BIND_FLAGS_TS_IMPORT) {
      if (this.__ts_hasImport(name, true)) {
        this.raise(pos, `Identifier '${name}' has already been declared.`)
      }
      this.__ts_importsStack[this.__ts_importsStack.length - 1].push(name)
      return
    }
    const scope = this.currentScope()
    this.__ts_maybeExportDefined(scope, name)
    if (bindingType & acornScope_BIND_FLAGS_TS_EXPORT_ONLY) {
      scope.exportOnlyBindings.push(name)
      return
    }
    if (
      bindingType === acornScope_BIND_TS_TYPE ||
      bindingType === acornScope_BIND_TS_INTERFACE
    ) {
      if (bindingType === acornScope_BIND_TS_TYPE && scope.types.includes(name)) {
        this.raise(pos, `type '${name}' has already been declared.`)
      }
      scope.types.push(name)
    } else {
      this.vanilla_declareName(name, bindingType, pos)
    }
    if (bindingType & acornScope_BIND_FLAGS_TS_ENUM) scope.enums.push(name)
    if (bindingType & acornScope_BIND_FLAGS_TS_CONST_ENUM)
      scope.constEnums.push(name)
    if (bindingType & acornScope_BIND_FLAGS_CLASS) scope.classes.push(name)
  }
  pp.checkLocalExport = function checkLocalExport(id) {
    if (!this.__ts_enabled) {
      return this.vanilla_checkLocalExport(id)
    }
    const { name } = id
    if (this.__ts_importsStack.length > 1) return
    if (this.__ts_hasImport(name)) return
    const len = this.scopeStack.length
    for (let i = len - 1; i >= 0; i--) {
      const scope = this.scopeStack[i]
      if (
        scope.types.indexOf(name) > -1 ||
        scope.exportOnlyBindings.indexOf(name) > -1
      )
        return
    }
    this.vanilla_checkLocalExport(id)
  }
  pp.__ts_ecmaVersion = function __ts_ecmaVersion() {
    return this.options.ecmaVersion
  }
  pp.__ts_tryParse = function __ts_tryParse(
    fn,
    oldState = this.__ts_cloneCurLookaheadState()
  ) {
    const abortSignal = {
      node: null,
    }
    const prev = this.__ts__inTryParse;
    try {
      this.__ts__inTryParse = true
      const node = fn((node2 = null) => {
        abortSignal.node = node2
        throw abortSignal
      })
      return {
        node,
        error: null,
        thrown: false,
        aborted: false,
        failState: null,
      }
    } catch (error) {
      const failState = this.__ts_getCurLookaheadState()
      this.__ts_setLookaheadState(oldState)
      if (typeof error.pos === 'number') {
        return {
          node: null,
          error,
          thrown: true,
          aborted: false,
          failState,
        }
      }
      if (error === abortSignal) {
        return {
          node: abortSignal.node,
          error: null,
          thrown: false,
          aborted: true,
          failState,
        }
      }
      throw error
    } finally {
      this.__ts__inTryParse = prev
    }
  }
  pp.__ts_getTokenFromCodeInType = function __ts_getTokenFromCodeInType(
    code
  ) {
    if (code === 62) {
      return this.finishOp(tokTypes.relational, 1)
    }
    if (code === 60) {
      return this.finishOp(tokTypes.relational, 1)
    }
    return this.vanilla_getTokenFromCode(code)
  }
  pp.__ts_isAbstractClass = function __ts_isAbstractClass() {
    return (
      this.isContextual("abstract") &&
      this.__ts_lookahead().type === tokTypes._class
    )
  }
  pp.__ts_setOptionalParametersError =
    function __ts_setOptionalParametersError(refExpressionErrors, resultError) {
      let _resultError$loc
      refExpressionErrors.optionalParametersLoc =
        (_resultError$loc =
          resultError === null || resultError === undefined
            ? undefined
            : resultError.loc) !== null && _resultError$loc !== undefined
          ? _resultError$loc
          : this.startLoc
    }
  pp.__ts_reScan_lt_gt = function __ts_reScan_lt_gt() {
    if (this.type === tokTypes.relational) {
      this.pos -= 1
      this.readToken_lt_gt(this.fullCharCodeAtPos())
    }
  }
  pp.__ts_reScan_lt = function __ts_reScan_lt() {
    const { type } = this
    if (type === tokTypes.bitShift) {
      this.pos -= 2
      this.finishOp(tokTypes.relational, 1)
      return tokTypes.relational
    }
    return type
  }
  pp.__ts_resetEndLocation = function __ts_resetEndLocation(
    node,
    endPos = this.lastTokEnd,
    endLoc = this.lastTokEndLoc
  ) {
    node.end = endPos
    node.loc.end = endLoc
    if (this.options.ranges) node.range[1] = endPos
  }
  pp.__ts_nextTokenStart = function __ts_nextTokenStart() {
    return this.__ts_nextTokenStartSince(this.pos)
  }
  pp.__ts_tsHasSomeModifiers = function __ts_tsHasSomeModifiers(
    member,
    modifiers
  ) {
    return modifiers.some((modifier) => {
      if (tsIsAccessModifier(modifier)) {
        return member.accessibility === modifier
      }
      return !!member[modifier]
    })
  }
  pp.__ts_tsIsStartOfStaticBlocks = function __ts_tsIsStartOfStaticBlocks() {
    return this.isContextual("static") && this.__ts_lookaheadCharCode() === 123
  }
  pp.__ts_tsCheckForInvalidTypeCasts =
    function __ts_tsCheckForInvalidTypeCasts(items) {
      items.forEach((node) => {
        if (
          (node === null || node === undefined ? undefined : node.type) ===
          "TSTypeCastExpression"
        ) {
          this.raise(node.typeAnnotation.start, UnexpectedTypeAnnotation)
        }
      })
    }
  pp.__ts_atPossibleAsyncArrow = function __ts_atPossibleAsyncArrow(base) {
    return (
      base.type === "Identifier" &&
      base.name === "async" &&
      this.lastTokEnd === base.end &&
      !this.canInsertSemicolon() &&
      base.end - base.start === 5 &&
      base.start === this.potentialArrowAt
    )
  }
  pp.__ts_tsIsIdentifier = function __ts_tsIsIdentifier() {
    return tokenIsIdentifier(this.type)
  }
  pp.__ts_tsTryParseTypeOrTypePredicateAnnotation =
    function __ts_tsTryParseTypeOrTypePredicateAnnotation() {
      return this.__ts_match(tokTypes.colon)
        ? this.__ts_tsParseTypeOrTypePredicateAnnotation(tokTypes.colon)
        : undefined
    }
  pp.__ts_tsTryParseGenericAsyncArrowFunction =
    function __ts_tsTryParseGenericAsyncArrowFunction(
      startPos,
      startLoc,
      forInit
    ) {
      if (!this.__ts_tsMatchLeftRelational()) {
        return undefined
      }
      const oldMaybeInArrowParameters = this.__ts_maybeInArrowParameters
      this.__ts_maybeInArrowParameters = true
      const res = this.__ts_tsTryParseAndCatch(() => {
        const node = this.startNodeAt(startPos, startLoc)
        node.typeParameters = this.__ts_tsParseTypeParameters(
          this.__ts_tsParseConstModifier.bind(this)
        )
        this.vanilla_parseFunctionParams(node)
        node.returnType = this.__ts_tsTryParseTypeOrTypePredicateAnnotation()
        this.expect(tokTypes.arrow)
        return node
      })
      this.__ts_maybeInArrowParameters = oldMaybeInArrowParameters
      if (!res) {
        return undefined
      }
      return this.vanilla_parseArrowExpression(res /* params are already set */,
        null /* async */,
        true /* forInit */,
        forInit
      )
    }
  pp.__ts_tsParseTypeArgumentsInExpression =
    function __ts_tsParseTypeArgumentsInExpression() {
      if (this.__ts_reScan_lt() !== tokTypes.relational) {
        return undefined
      }
      return this.__ts_tsParseTypeArguments()
    }
  pp.__ts_tsInNoContext = function __ts_tsInNoContext(cb) {
    const oldContext = this.context
    this.context = [oldContext[0]]
    try {
      return cb()
    } finally {
      this.context = oldContext
    }
  }
  pp.__ts_tsTryParseTypeAnnotation =
    function __ts_tsTryParseTypeAnnotation() {
      return this.__ts_match(tokTypes.colon)
        ? this.__ts_tsParseTypeAnnotation()
        : undefined
    }
  pp.__ts_isUnparsedContextual = function __ts_isUnparsedContextual(
    nameStart,
    name
  ) {
    const nameEnd = nameStart + name.length
    if (this.input.slice(nameStart, nameEnd) === name) {
      const nextCh = this.input.charCodeAt(nameEnd)
      return !(
        isIdentifierChar(nextCh) ||
        // check if `nextCh is between 0xd800 - 0xdbff,
        // if `nextCh` is NaN, `NaN & 0xfc00` is 0, the function
        // returns true
        (nextCh & 64512) === 55296
      )
    }
    return false
  }
  pp.__ts_isAbstractConstructorSignature =
    function __ts_isAbstractConstructorSignature() {
      return (
        this.isContextual("abstract") &&
        this.__ts_lookahead().type === tokTypes._new
      )
    }
  pp.__ts_nextTokenStartSince = function __ts_nextTokenStartSince(pos) {
    skipWhiteSpace.lastIndex = pos
    return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos
  }
  pp.__ts_lookaheadCharCode = function __ts_lookaheadCharCode() {
    return this.input.charCodeAt(this.__ts_nextTokenStart())
  }
  pp.__ts_compareLookaheadState = function __ts_compareLookaheadState(
    state,
    state2
  ) {
    for (const key of Object.keys(state)) {
      if (state[key] !== state2[key]) return false
    }
    return true
  }
  pp.__ts_createLookaheadState = function __ts_createLookaheadState() {
    this.value = null
    this.context = [this.curContext()]
  }
  pp.__ts_getCurLookaheadState = function __ts_getCurLookaheadState() {
    return {
      endLoc: this.endLoc,
      lastTokEnd: this.lastTokEnd,
      lastTokStart: this.lastTokStart,
      lastTokStartLoc: this.lastTokStartLoc,
      pos: this.pos,
      value: this.value,
      type: this.type,
      start: this.start,
      end: this.end,
      context: this.context,
      startLoc: this.startLoc,
      lastTokEndLoc: this.lastTokEndLoc,
      curLine: this.curLine,
      lineStart: this.lineStart,
      containsEsc: this.containsEsc,
    }
  }
  pp.__ts_cloneCurLookaheadState = function __ts_cloneCurLookaheadState() {
    return {
      pos: this.pos,
      value: this.value,
      type: this.type,
      start: this.start,
      end: this.end,
      context: this.context && this.context.slice(),
      startLoc: this.startLoc,
      lastTokEndLoc: this.lastTokEndLoc,
      endLoc: this.endLoc,
      lastTokEnd: this.lastTokEnd,
      lastTokStart: this.lastTokStart,
      lastTokStartLoc: this.lastTokStartLoc,
      curLine: this.curLine,
      lineStart: this.lineStart,
      containsEsc: this.containsEsc,
    }
  }
  pp.__ts_setLookaheadState = function __ts_setLookaheadState(state) {
    this.pos = state.pos
    this.value = state.value
    this.endLoc = state.endLoc
    this.lastTokEnd = state.lastTokEnd
    this.lastTokStart = state.lastTokStart
    this.lastTokStartLoc = state.lastTokStartLoc
    this.type = state.type
    this.start = state.start
    this.end = state.end
    this.context = state.context
    this.startLoc = state.startLoc
    this.lastTokEndLoc = state.lastTokEndLoc
    this.curLine = state.curLine
    this.lineStart = state.lineStart
    this.containsEsc = state.containsEsc
  }
  pp.__ts_tsLookAhead = function __ts_tsLookAhead(f) {
    const state = this.__ts_cloneCurLookaheadState()
    const res = f()
    this.__ts_setLookaheadState(state)
    return res
  }
  pp.__ts_lookahead = function __ts_lookahead(number) {
    const oldState = this.__ts_getCurLookaheadState()
    this.__ts_createLookaheadState()
    this.__ts_isLookahead = true
    if (number !== undefined) {
      for (let i = 0; i < number; i++) {
        this.nextToken()
      }
    } else {
      this.nextToken()
    }
    this.__ts_isLookahead = false
    const curState = this.__ts_getCurLookaheadState()
    this.__ts_setLookaheadState(oldState)
    return curState
  }
  pp.__ts_resetStartLocation = function __ts_resetStartLocation(
    node,
    start,
    startLoc
  ) {
    node.start = start
    node.loc.start = startLoc
    if (this.options.ranges) node.range[0] = start
  }
  pp.__ts_isLineTerminator = function __ts_isLineTerminator() {
    return (
      this.eat(tokTypes.semi) || this.vanilla_canInsertSemicolon()
    )
  }
  pp.__ts_hasFollowingLineBreak = function __ts_hasFollowingLineBreak() {
    skipWhiteSpaceToLineBreak.lastIndex = this.end
    return skipWhiteSpaceToLineBreak.test(this.input)
  }
  pp.__ts_addExtra = function __ts_addExtra(
    node,
    key,
    value,
    enumerable = true
  ) {
    if (!node) return
    const extra = (node.extra = node.extra || {})
    if (enumerable) {
      extra[key] = value
    } else {
      Object.defineProperty(extra, key, {
        enumerable,
        value,
      })
    }
  }
  pp.__ts_isLiteralPropertyName = function __ts_isLiteralPropertyName() {
    return tokenIsLiteralPropertyName(this.type)
  }
  pp.__ts_hasPrecedingLineBreak = function __ts_hasPrecedingLineBreak() {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  }
  pp.__ts_createIdentifier = function __ts_createIdentifier(node, name) {
    node.name = name
    return this.finishNode(node, "Identifier")
  }
  pp.__ts_isThisParam = function __ts_isThisParam(param) {
    return param.type === "Identifier" && param.name === "this"
  }
  pp.__ts_isLookaheadContextual = function __ts_isLookaheadContextual(name) {
    const next = this.__ts_nextTokenStart()
    return this.__ts_isUnparsedContextual(next, name)
  }
  pp.__ts_isContextualWithState = function __ts_isContextualWithState(
    keyword,
    state
  ) {
    return (
      state.type === tokTypes.name &&
      state.value === keyword &&
      !state.containsEsc
    )
  }
  pp.__ts_tsIsStartOfMappedType = function __ts_tsIsStartOfMappedType() {
    this.next()
    if (this.eat(tokTypes.plusMin)) {
      return this.isContextual("readonly")
    }
    if (this.isContextual("readonly")) {
      this.next()
    }
    if (!this.__ts_match(tokTypes.bracketL)) {
      return false
    }
    this.next()
    if (!this.__ts_tsIsIdentifier()) {
      return false
    }
    this.next()
    return this.__ts_match(tokTypes._in)
  }
  pp.__ts_tsInDisallowConditionalTypesContext =
    function __ts_tsInDisallowConditionalTypesContext(cb) {
      const oldInDisallowConditionalTypesContext =
        this.__ts_inDisallowConditionalTypesContext
      this.__ts_inDisallowConditionalTypesContext = true
      try {
        return cb()
      } finally {
        this.__ts_inDisallowConditionalTypesContext =
          oldInDisallowConditionalTypesContext
      }
    }
  pp.__ts_tsTryParseType = function __ts_tsTryParseType() {
    return this.__ts_tsEatThenParseType(tokTypes.colon)
  }
  pp.__ts_match = function __ts_match(type) {
    return this.type === type
  }
  pp.__ts_ts_eatWithState = function __ts_ts_eatWithState(
    type,
    nextCount,
    state
  ) {
    const targetType = state.type
    if (type === targetType) {
      for (let i = 0; i < nextCount; i++) {
        this.next()
      }
      return true
    } else {
      return false
    }
  }
  pp.__ts_ts_eatContextualWithState = function __ts_ts_eatContextualWithState(
    name,
    nextCount,
    state
  ) {
    if (keywordsRegExp.test(name)) {
      if (this.__ts_isContextualWithState(name, state)) {
        for (let i = 0; i < nextCount; i++) {
          this.next()
        }
        return true
      }
      return false
    } else {
      if (!this.__ts_isContextualWithState(name, state)) return false
      for (let i = 0; i < nextCount; i++) {
        this.next()
      }
      return true
    }
  }
  pp.__ts_tsIsExternalModuleReference =
    function __ts_tsIsExternalModuleReference() {
      return (
        this.isContextual("require") && this.__ts_lookaheadCharCode() === 40
      )
    }
  pp.__ts_tsParseExternalModuleReference =
    function __ts_tsParseExternalModuleReference() {
      const node = this.startNode()
      this.expectContextual("require")
      this.expect(tokTypes.parenL)
      if (!this.__ts_match(tokTypes.string)) {
        this.unexpected()
      }
      node.expression = this.parseExprAtom()
      this.expect(tokTypes.parenR)
      return this.finishNode(node, "TSExternalModuleReference")
    }
  pp.__ts_tsParseEntityName = function __ts_tsParseEntityName(
    allowReservedWords = true
  ) {
    let entity = this.parseIdent(allowReservedWords)
    while (this.eat(tokTypes.dot)) {
      const node = this.__ts_startNodeAtNode(entity)
      node.left = entity
      node.right = this.parseIdent(allowReservedWords)
      entity = this.finishNode(node, "TSQualifiedName")
    }
    return entity
  }
  pp.__ts_tsParseEnumMember = function __ts_tsParseEnumMember() {
    const node = this.startNode()
    node.id = this.__ts_match(tokTypes.string)
      ? this.parseLiteral(this.value)
      : this.parseIdent(/* liberal */ true)
    if (this.eat(tokTypes.eq)) {
      node.initializer = this.parseMaybeAssign()
    }
    return this.finishNode(node, "TSEnumMember")
  }
  pp.__ts_tsParseEnumDeclaration = function __ts_tsParseEnumDeclaration(
    node,
    properties = {}
  ) {
    if (properties.const) node.const = true
    if (properties.declare) node.declare = true
    this.expectContextual("enum")
    node.id = this.parseIdent()
    this.checkLValSimple(node.id, acornScope_BIND_VAR)
    this.expect(tokTypes.braceL)
    node.members = this.__ts_tsParseDelimitedList(
      "EnumMembers",
      this.__ts_tsParseEnumMember.bind(this)
    )
    this.expect(tokTypes.braceR)
    return this.finishNode(node, "TSEnumDeclaration")
  }
  pp.__ts_tsParseModuleBlock = function __ts_tsParseModuleBlock() {
    const node = this.startNode()
    this.enterScope(TS_SCOPE_OTHER)
    this.expect(tokTypes.braceL)
    node.body = []
    while (this.type !== tokTypes.braceR) {
      let stmt = this.parseStatement(null, true)
      node.body.push(stmt)
    }
    this.next()
    this.vanilla_exitScope()
    return this.finishNode(node, "TSModuleBlock")
  }
  pp.__ts_tsParseAmbientExternalModuleDeclaration =
    function __ts_tsParseAmbientExternalModuleDeclaration(node) {
      if (this.isContextual("global")) {
        node.global = true
        node.id = this.parseIdent(true)
      } else if (this.__ts_match(tokTypes.string)) {
        node.id = this.parseLiteral(this.value)
      } else {
        this.unexpected()
      }
      if (this.__ts_match(tokTypes.braceL)) {
        this.enterScope(TS_SCOPE_TS_MODULE)
        node.body = this.__ts_tsParseModuleBlock()
        this.vanilla_exitScope()
      } else {
        this.vanilla_semicolon()
      }
      return this.finishNode(node, "TSModuleDeclaration")
    }
  pp.__ts_tsTryParseDeclare = function __ts_tsTryParseDeclare(nany) {
    if (this.__ts_isLineTerminator()) {
      return
    }
    let starttype = this.type
    let kind
    if (this.isContextual("let")) {
      starttype = tokTypes._var
      kind = "let"
    }
    return this.__ts_tsInAmbientContext(() => {
      if (starttype === tokTypes._function) {
        nany.declare = true
        return this.parseFunctionStatement(
          nany /* async */,
          false /* declarationPosition */,
          true
        )
      }
      if (starttype === tokTypes._class) {
        nany.declare = true
        return this.parseClass(nany, true)
      }
      if (this.isContextual("enum")) {
        return this.__ts_tsParseEnumDeclaration(nany, {
          declare: true,
        })
      }
      if (this.isContextual("global")) {
        return this.__ts_tsParseAmbientExternalModuleDeclaration(nany)
      }
      if (starttype === tokTypes._const || starttype === tokTypes._var) {
        if (
          !this.__ts_match(tokTypes._const) ||
          !this.__ts_isLookaheadContextual("enum")
        ) {
          nany.declare = true
          return this.parseVarStatement(nany, kind || this.value, true)
        }
        this.expect(tokTypes._const)
        return this.__ts_tsParseEnumDeclaration(nany, {
          const: true,
          declare: true,
        })
      }
      if (this.isContextual("interface")) {
        const result = this.__ts_tsParseInterfaceDeclaration(nany, {
          declare: true,
        })
        if (result) return result
      }
      if (tokenIsIdentifier(starttype)) {
        return this.__ts_tsParseDeclaration(nany, this.value /* next */, true)
      }
    })
  }
  pp.__ts_tsIsListTerminator = function __ts_tsIsListTerminator(kind) {
    switch (kind) {
      case "EnumMembers":
      case "TypeMembers":
        return this.__ts_match(tokTypes.braceR)
      case "HeritageClauseElement":
        return this.__ts_match(tokTypes.braceL)
      case "TupleElementTypes":
        return this.__ts_match(tokTypes.bracketR)
      case "TypeParametersOrArguments":
        return this.__ts_tsMatchRightRelational()
    }
  }
  pp.__ts_tsParseDelimitedListWorker =
    function __ts_tsParseDelimitedListWorker(
      kind,
      parseElement,
      expectSuccess,
      refTrailingCommaPos
    ) {
      const result = []
      let trailingCommaPos = -1
      for (; ;) {
        if (this.__ts_tsIsListTerminator(kind)) {
          break
        }
        trailingCommaPos = -1
        const element = parseElement()
        if (element == null) {
          return undefined
        }
        result.push(element)
        if (this.eat(tokTypes.comma)) {
          trailingCommaPos = this.lastTokStart
          continue
        }
        if (this.__ts_tsIsListTerminator(kind)) {
          break
        }
        if (expectSuccess) {
          this.expect(tokTypes.comma)
        }
        return undefined
      }
      if (refTrailingCommaPos) {
        refTrailingCommaPos.value = trailingCommaPos
      }
      return result
    }
  pp.__ts_tsParseDelimitedList = function __ts_tsParseDelimitedList(
    kind,
    parseElement,
    refTrailingCommaPos
  ) {
    return nonNull(
      this.__ts_tsParseDelimitedListWorker(
        kind,
        parseElement /* expectSuccess */,
        true,
        refTrailingCommaPos
      )
    )
  }
  pp.__ts_tsParseBracketedList = function __ts_tsParseBracketedList(
    kind,
    parseElement,
    bracket,
    skipFirstToken,
    refTrailingCommaPos
  ) {
    if (!skipFirstToken) {
      if (bracket) {
        this.expect(tokTypes.bracketL)
      } else {
        this.expect(tokTypes.relational)
      }
    }
    const result = this.__ts_tsParseDelimitedList(
      kind,
      parseElement,
      refTrailingCommaPos
    )
    if (bracket) {
      this.expect(tokTypes.bracketR)
    } else {
      this.expect(tokTypes.relational)
    }
    return result
  }
  pp.__ts_tsParseTypeParameterName =
    function __ts_tsParseTypeParameterName() {
      const typeName = this.parseIdent(true)
      return typeName.name
    }
  pp.__ts_tsEatThenParseType = function __ts_tsEatThenParseType(token) {
    return !this.__ts_match(token)
      ? undefined
      : this.__ts_tsNextThenParseType()
  }
  pp.__ts_tsExpectThenParseType = function __ts_tsExpectThenParseType(token) {
    return this.__ts_tsDoThenParseType(() => this.expect(token))
  }
  pp.__ts_tsNextThenParseType = function __ts_tsNextThenParseType() {
    return this.__ts_tsDoThenParseType(() => this.next())
  }
  pp.__ts_tsDoThenParseType = function __ts_tsDoThenParseType(cb) {
    return this.__ts_tsInType(() => {
      cb()
      return this.__ts_tsParseType()
    })
  }
  pp.__ts_tsSkipParameterStart = function __ts_tsSkipParameterStart() {
    if (tokenIsIdentifier(this.type) || this.__ts_match(tokTypes._this)) {
      this.next()
      return true
    }
    if (this.__ts_match(tokTypes.braceL)) {
      try {
        this.parseObj(true)
        return true
      } catch (_unused) {
        return false
      }
    }
    if (this.__ts_match(tokTypes.bracketL)) {
      this.next()
      try {
        this.parseBindingList(tokTypes.bracketR, true, true)
        return true
      } catch (_unused2) {
        return false
      }
    }
    return false
  }
  pp.__ts_tsIsUnambiguouslyStartOfFunctionType =
    function __ts_tsIsUnambiguouslyStartOfFunctionType() {
      this.next()
      if (
        this.__ts_match(tokTypes.parenR) ||
        this.__ts_match(tokTypes.ellipsis)
      ) {
        return true
      }
      if (this.__ts_tsSkipParameterStart()) {
        if (
          this.__ts_match(tokTypes.colon) ||
          this.__ts_match(tokTypes.comma) ||
          this.__ts_match(tokTypes.question) ||
          this.__ts_match(tokTypes.eq)
        ) {
          return true
        }
        if (this.__ts_match(tokTypes.parenR)) {
          this.next()
          if (this.__ts_match(tokTypes.arrow)) {
            return true
          }
        }
      }
      return false
    }
  pp.__ts_tsIsStartOfFunctionType = function __ts_tsIsStartOfFunctionType() {
    if (this.__ts_tsMatchLeftRelational()) {
      return true
    }
    return (
      this.__ts_match(tokTypes.parenL) &&
      this.__ts_tsLookAhead(
        this.__ts_tsIsUnambiguouslyStartOfFunctionType.bind(this)
      )
    )
  }
  pp.__ts_tsInAllowConditionalTypesContext =
    function __ts_tsInAllowConditionalTypesContext(cb) {
      const oldInDisallowConditionalTypesContext =
        this.__ts_inDisallowConditionalTypesContext
      this.__ts_inDisallowConditionalTypesContext = false
      try {
        return cb()
      } finally {
        this.__ts_inDisallowConditionalTypesContext =
          oldInDisallowConditionalTypesContext
      }
    }
  pp.__ts_tsParseBindingListForSignature =
    function __ts_tsParseBindingListForSignature() {
      return this.vanilla_parseBindingList(tokTypes.parenR, true, true)
        .map((pattern) => {
          if (
            pattern.type !== "Identifier" &&
            pattern.type !== "RestElement" &&
            pattern.type !== "ObjectPattern" &&
            pattern.type !== "ArrayPattern"
          ) {
            this.raise(
              pattern.start,
              UnsupportedSignatureParameterKind({
                type: pattern.type,
              })
            )
          }
          return pattern
        })
    }
  pp.__ts_tsParseTypePredicateAsserts =
    function __ts_tsParseTypePredicateAsserts() {
      if (!this.isContextual("asserts")) {
        return false
      }
      const containsEsc = this.containsEsc
      this.next()
      if (!tokenIsIdentifier(this.type) && !this.__ts_match(tokTypes._this)) {
        return false
      }
      if (containsEsc) {
        this.raise(this.lastTokStart, "Escape sequence in keyword asserts")
      }
      return true
    }
  pp.__ts_tsParseThisTypeNode = function __ts_tsParseThisTypeNode() {
    const node = this.startNode()
    this.next()
    return this.finishNode(node, "TSThisType")
  }
  pp.__ts_tsParseTypeAnnotation = function __ts_tsParseTypeAnnotation(
    eatColon = true,
    t = this.startNode()
  ) {
    this.__ts_tsInType(() => {
      if (eatColon) this.expect(tokTypes.colon)
      t.typeAnnotation = this.__ts_tsParseType()
    })
    return this.finishNode(t, "TSTypeAnnotation")
  }
  pp.__ts_tsParseThisTypePredicate = function __ts_tsParseThisTypePredicate(
    lhs
  ) {
    this.next()
    const node = this.__ts_startNodeAtNode(lhs)
    node.parameterName = lhs
    node.typeAnnotation = this.__ts_tsParseTypeAnnotation(/* eatColon */ false)
    node.asserts = false
    return this.finishNode(node, "TSTypePredicate")
  }
  pp.__ts_tsParseThisTypeOrThisTypePredicate =
    function __ts_tsParseThisTypeOrThisTypePredicate() {
      const thisKeyword = this.__ts_tsParseThisTypeNode()
      if (this.isContextual("is") && !this.__ts_hasPrecedingLineBreak()) {
        return this.__ts_tsParseThisTypePredicate(thisKeyword)
      } else {
        return thisKeyword
      }
    }
  pp.__ts_tsParseTypePredicatePrefix =
    function __ts_tsParseTypePredicatePrefix() {
      const id = this.parseIdent(true)
      if (this.isContextual("is") && !this.__ts_hasPrecedingLineBreak()) {
        this.next()
        return id
      }
    }
  pp.__ts_tsParseTypeOrTypePredicateAnnotation =
    function __ts_tsParseTypeOrTypePredicateAnnotation(returnToken) {
      return this.__ts_tsInType(() => {
        const t = this.startNode()
        this.expect(returnToken)
        const node = this.startNode()
        const asserts = !!this.__ts_tsTryParse(
          this.__ts_tsParseTypePredicateAsserts.bind(this)
        )
        if (asserts && this.__ts_match(tokTypes._this)) {
          let thisTypePredicate =
            this.__ts_tsParseThisTypeOrThisTypePredicate()
          if (thisTypePredicate.type === "TSThisType") {
            node.parameterName = thisTypePredicate
            node.asserts = true
            node.typeAnnotation = null
            thisTypePredicate = this.finishNode(node, "TSTypePredicate")
          } else {
            this.resetStartLocationFromNode(thisTypePredicate, node)
            thisTypePredicate.asserts = true
          }
          t.typeAnnotation = thisTypePredicate
          return this.finishNode(t, "TSTypeAnnotation")
        }
        const typePredicateVariable =
          this.__ts_tsIsIdentifier() &&
          this.__ts_tsTryParse(
            this.__ts_tsParseTypePredicatePrefix.bind(this)
          )
        if (!typePredicateVariable) {
          if (!asserts) {
            return this.__ts_tsParseTypeAnnotation(/* eatColon */ false, t)
          }
          node.parameterName = this.parseIdent(true)
          node.asserts = asserts
          node.typeAnnotation = null
          t.typeAnnotation = this.finishNode(node, "TSTypePredicate")
          return this.finishNode(t, "TSTypeAnnotation")
        }
        const type = this.__ts_tsParseTypeAnnotation(/* eatColon */ false)
        node.parameterName = typePredicateVariable
        node.typeAnnotation = type
        node.asserts = asserts
        t.typeAnnotation = this.finishNode(node, "TSTypePredicate")
        return this.finishNode(t, "TSTypeAnnotation")
      })
    }
  pp.__ts_tsFillSignature = function __ts_tsFillSignature(
    returnToken,
    signature
  ) {
    const returnTokenRequired = returnToken === tokTypes.arrow
    const paramsKey = "parameters"
    const returnTypeKey = "typeAnnotation"
    signature.typeParameters = this.__ts_tsTryParseTypeParameters()
    this.expect(tokTypes.parenL)
    signature[paramsKey] = this.__ts_tsParseBindingListForSignature()
    if (returnTokenRequired) {
      signature[returnTypeKey] =
        this.__ts_tsParseTypeOrTypePredicateAnnotation(returnToken)
    } else if (this.__ts_match(returnToken)) {
      signature[returnTypeKey] =
        this.__ts_tsParseTypeOrTypePredicateAnnotation(returnToken)
    }
  }
  pp.__ts_tsTryNextParseConstantContext =
    function __ts_tsTryNextParseConstantContext() {
      if (this.__ts_lookahead().type !== tokTypes._const) return null
      this.next()
      const typeReference = this.__ts_tsParseTypeReference()
      if (typeReference.typeParameters || typeReference.typeArguments) {
        this.raise(
          typeReference.typeName.start,
          CannotFindName({
            name: "const",
          })
        )
      }
      return typeReference
    }
  pp.__ts_tsParseFunctionOrConstructorType =
    function __ts_tsParseFunctionOrConstructorType(type, abstract) {
      const node = this.startNode()
      if (type === "TSConstructorType") {
        node.abstract = !!abstract
        if (abstract) this.next()
        this.next()
      }
      this.__ts_tsInAllowConditionalTypesContext(() =>
        this.__ts_tsFillSignature(tokTypes.arrow, node)
      )
      return this.finishNode(node, type)
    }
  pp.__ts_tsParseUnionOrIntersectionType =
    function __ts_tsParseUnionOrIntersectionType(
      kind,
      parseConstituentType,
      operator
    ) {
      const node = this.startNode()
      const hasLeadingOperator = this.eat(operator)
      const types = []
      do {
        types.push(parseConstituentType())
      } while (this.eat(operator))
      if (types.length === 1 && !hasLeadingOperator) {
        return types[0]
      }
      node.types = types
      return this.finishNode(node, kind)
    }
  pp.__ts_tsCheckTypeAnnotationForReadOnly =
    function __ts_tsCheckTypeAnnotationForReadOnly(node) {
      switch (node.typeAnnotation.type) {
        case "TSTupleType":
        case "TSArrayType":
          return
        default:
          this.raise(node.start, UnexpectedReadonly)
      }
    }
  pp.__ts_tsParseTypeOperator = function __ts_tsParseTypeOperator() {
    const node = this.startNode()
    const operator = this.value
    this.next()
    node.operator = operator
    node.typeAnnotation = this.__ts_tsParseTypeOperatorOrHigher()
    if (operator === "readonly") {
      this.__ts_tsCheckTypeAnnotationForReadOnly(node)
    }
    return this.finishNode(node, "TSTypeOperator")
  }
  pp.__ts_tsParseConstraintForInferType =
    function __ts_tsParseConstraintForInferType() {
      if (this.eat(tokTypes._extends)) {
        const constraint = this.__ts_tsInDisallowConditionalTypesContext(() =>
          this.__ts_tsParseType()
        )
        if (
          this.__ts_inDisallowConditionalTypesContext ||
          !this.__ts_match(tokTypes.question)
        ) {
          return constraint
        }
      }
    }
  pp.__ts_tsParseInferType = function __ts_tsParseInferType() {
    const node = this.startNode()
    this.expectContextual("infer")
    const typeParameter = this.startNode()
    typeParameter.name = this.__ts_tsParseTypeParameterName()
    typeParameter.constraint = this.__ts_tsTryParse(() =>
      this.__ts_tsParseConstraintForInferType()
    )
    node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter")
    return this.finishNode(node, "TSInferType")
  }
  pp.__ts_tsParseLiteralTypeNode = function __ts_tsParseLiteralTypeNode() {
    const node = this.startNode()
    node.literal = (() => {
      switch (this.type) {
        case tokTypes.num:
        // we don't need bigint type here
        // case tt.bigint:
        case tokTypes.string:
        case tokTypes._true:
        case tokTypes._false:
          return this.parseExprAtom()
        default:
          this.unexpected()
      }
    })()
    return this.finishNode(node, "TSLiteralType")
  }
  pp.__ts_tsParseImportType = function __ts_tsParseImportType() {
    const node = this.startNode()
    this.expect(tokTypes._import)
    this.expect(tokTypes.parenL)
    if (!this.__ts_match(tokTypes.string)) {
      this.raise(this.start, UnsupportedImportTypeArgument)
    }
    node.source = this.parseExprAtom()
    if (this.eat(tokTypes.comma) && this.eat(tokTypes.braceL)) {
      this.expect(tokTypes._with)
      if (!this.__ts_match(tokTypes.colon)) this.expect(tokTypes.colon)
      this.finishToken(tokTypes._with)
      node.attributes = this.parseWithClause()
      this.eat(tokTypes.braceR)
      this.eat(tokTypes.comma)
    }
    this.expect(tokTypes.parenR)
    if (this.eat(tokTypes.dot)) {
      node.qualifier = this.__ts_tsParseEntityName()
    }
    if (this.__ts_tsMatchLeftRelational()) {
      node.typeArguments = this.__ts_tsParseTypeArguments()
    }
    return this.finishNode(node, "TSImportType")
  }
  pp.__ts_tsParseTypeQuery = function __ts_tsParseTypeQuery() {
    const node = this.startNode()
    this.expect(tokTypes._typeof)
    if (this.__ts_match(tokTypes._import)) {
      node.exprName = this.__ts_tsParseImportType()
    } else {
      node.exprName = this.__ts_tsParseEntityName()
    }
    if (
      !this.__ts_hasPrecedingLineBreak() &&
      this.__ts_tsMatchLeftRelational()
    ) {
      node.typeArguments = this.__ts_tsParseTypeArguments()
    }
    return this.finishNode(node, "TSTypeQuery")
  }
  pp.__ts_tsParseMappedTypeParameter =
    function __ts_tsParseMappedTypeParameter() {
      const node = this.startNode()
      node.name = this.__ts_tsParseTypeParameterName()
      node.constraint = this.__ts_tsExpectThenParseType(tokTypes._in)
      return this.finishNode(node, "TSTypeParameter")
    }
  pp.__ts_tsParseMappedType = function __ts_tsParseMappedType() {
    const node = this.startNode()
    this.expect(tokTypes.braceL)
    if (this.__ts_match(tokTypes.plusMin)) {
      node.readonly = this.value
      this.next()
      this.expectContextual("readonly")
    } else if (this.eatContextual("readonly")) {
      node.readonly = true
    }
    this.expect(tokTypes.bracketL)
    node.typeParameter = this.__ts_tsParseMappedTypeParameter()
    node.nameType = this.eatContextual("as") ? this.__ts_tsParseType() : null
    this.expect(tokTypes.bracketR)
    if (this.__ts_match(tokTypes.plusMin)) {
      node.optional = this.value
      this.next()
      this.expect(tokTypes.question)
    } else if (this.eat(tokTypes.question)) {
      node.optional = true
    }
    node.typeAnnotation = this.__ts_tsTryParseType()
    this.semicolon()
    this.expect(tokTypes.braceR)
    return this.finishNode(node, "TSMappedType")
  }
  pp.__ts_tsParseTypeLiteral = function __ts_tsParseTypeLiteral() {
    const node = this.startNode()
    node.members = this.__ts_tsParseObjectTypeMembers()
    return this.finishNode(node, "TSTypeLiteral")
  }
  pp.__ts_tsParseTupleElementType = function __ts_tsParseTupleElementType() {
    const startLoc = this.startLoc
    const startPos = this["start"]
    const rest = this.eat(tokTypes.ellipsis)
    let type = this.__ts_tsParseType()
    const optional = this.eat(tokTypes.question)
    const labeled = this.eat(tokTypes.colon)
    if (labeled) {
      const labeledNode = this.__ts_startNodeAtNode(type)
      labeledNode.optional = optional
      let kw = nameFromKeywordType(type.type)
      if (kw) {
        labeledNode.label = Object.assign({}, type, {
          type: "Identifier",
          name: kw,
        })
      } else if (
        type.type === "TSTypeReference" &&
        !type.typeArguments &&
        type.typeName.type === "Identifier"
      ) {
        labeledNode.label = type.typeName
      } else {
        this.raise(type.start, InvalidTupleMemberLabel)
        labeledNode.label = type
      }
      labeledNode.elementType = this.__ts_tsParseType()
      type = this.finishNode(labeledNode, "TSNamedTupleMember")
    } else if (optional) {
      const optionalTypeNode = this.__ts_startNodeAtNode(type)
      optionalTypeNode.typeAnnotation = type
      type = this.finishNode(optionalTypeNode, "TSOptionalType")
    }
    if (rest) {
      const restNode = this.startNodeAt(startPos, startLoc)
      restNode.typeAnnotation = type
      type = this.finishNode(restNode, "TSRestType")
    }
    return type
  }
  pp.__ts_tsParseTupleType = function __ts_tsParseTupleType() {
    const node = this.startNode()
    node.elementTypes = this.__ts_tsParseBracketedList(
      "TupleElementTypes",
      this.__ts_tsParseTupleElementType.bind(this) /* bracket */,
      true /* skipFirstToken */,
      false
    )
    let seenOptionalElement = false
    node.elementTypes.forEach((elementNode) => {
      const { type } = elementNode
      if (
        seenOptionalElement &&
        type !== "TSRestType" &&
        type !== "TSOptionalType" &&
        !(type === "TSNamedTupleMember" && elementNode.optional)
      ) {
        this.raise(elementNode.start, OptionalTypeBeforeRequired)
      }
      seenOptionalElement ||
        (seenOptionalElement =
          (type === "TSNamedTupleMember" && elementNode.optional) ||
          type === "TSOptionalType")
      if (type === "TSRestType") {
        elementNode = elementNode.typeAnnotation
      }
    })
    return this.finishNode(node, "TSTupleType")
  }
  pp.__ts_tsParseTemplateLiteralType =
    function __ts_tsParseTemplateLiteralType() {
      const node = this.startNode()
      node.literal = this.parseTemplate({
        isTagged: false,
      })
      return this.finishNode(node, "TSLiteralType")
    }
  pp.__ts_tsParseTypeReference = function __ts_tsParseTypeReference() {
    const node = this.startNode()
    node.typeName = this.__ts_tsParseEntityName()
    if (
      !this.__ts_hasPrecedingLineBreak() &&
      this.__ts_tsMatchLeftRelational()
    ) {
      node.typeArguments = this.__ts_tsParseTypeArguments()
    }
    return this.finishNode(node, "TSTypeReference")
  }
  pp.__ts_tsMatchLeftRelational = function __ts_tsMatchLeftRelational() {
    return this.__ts_match(tokTypes.relational) && this.value === "<"
  }
  pp.__ts_tsMatchRightRelational = function __ts_tsMatchRightRelational() {
    return this.__ts_match(tokTypes.relational) && this.value === ">"
  }
  pp.__ts_tsParseParenthesizedType =
    function __ts_tsParseParenthesizedType() {
      const node = this.startNode()
      this.expect(tokTypes.parenL)
      node.typeAnnotation = this.__ts_tsParseType()
      this.expect(tokTypes.parenR)
      return this.finishNode(node, "TSParenthesizedType")
    }
  pp.__ts_tsParseNonArrayType = function __ts_tsParseNonArrayType() {
    switch (this.type) {
      case tokTypes.string:
      case tokTypes.num:
      // we don't need bigint type here
      // case tt.bigint:
      case tokTypes._true:
      case tokTypes._false:
        return this.__ts_tsParseLiteralTypeNode()
      case tokTypes.plusMin:
        if (this.value === "-") {
          const node = this.startNode()
          const nextToken = this.__ts_lookahead()
          if (nextToken.type !== tokTypes.num) {
            this.unexpected()
          }
          node.literal = this.parseMaybeUnary()
          return this.finishNode(node, "TSLiteralType")
        }
        break
      case tokTypes._this:
        return this.__ts_tsParseThisTypeOrThisTypePredicate()
      case tokTypes._typeof:
        return this.__ts_tsParseTypeQuery()
      case tokTypes._import:
        return this.__ts_tsParseImportType()
      case tokTypes.braceL:
        return this.__ts_tsLookAhead(
          this.__ts_tsIsStartOfMappedType.bind(this)
        )
          ? this.__ts_tsParseMappedType()
          : this.__ts_tsParseTypeLiteral()
      case tokTypes.bracketL:
        return this.__ts_tsParseTupleType()
      case tokTypes.parenL:
        return this.__ts_tsParseParenthesizedType()
      // parse template string here
      case tokTypes.backQuote:
      case tokTypes.dollarBraceL:
        return this.__ts_tsParseTemplateLiteralType()
      default: {
        const { type } = this
        if (
          tokenIsIdentifier(type) ||
          type === tokTypes._void ||
          type === tokTypes._null
        ) {
          const nodeType =
            type === tokTypes._void
              ? "TSVoidKeyword"
              : type === tokTypes._null
                ? "TSNullKeyword"
                : keywordTypeFromName(this.value)
          if (nodeType !== undefined && this.__ts_lookaheadCharCode() !== 46) {
            const node = this.startNode()
            this.next()
            return this.finishNode(node, nodeType)
          }
          return this.__ts_tsParseTypeReference()
        }
      }
    }
    this.unexpected()
  }
  pp.__ts_tsParseArrayTypeOrHigher =
    function __ts_tsParseArrayTypeOrHigher() {
      let type = this.__ts_tsParseNonArrayType()
      while (
        !this.__ts_hasPrecedingLineBreak() &&
        this.eat(tokTypes.bracketL)
      ) {
        if (this.__ts_match(tokTypes.bracketR)) {
          const node = this.__ts_startNodeAtNode(type)
          node.elementType = type
          this.expect(tokTypes.bracketR)
          type = this.finishNode(node, "TSArrayType")
        } else {
          const node = this.__ts_startNodeAtNode(type)
          node.objectType = type
          node.indexType = this.__ts_tsParseType()
          this.expect(tokTypes.bracketR)
          type = this.finishNode(node, "TSIndexedAccessType")
        }
      }
      return type
    }
  pp.__ts_tsParseTypeOperatorOrHigher =
    function __ts_tsParseTypeOperatorOrHigher() {
      const isTypeOperator =
        tokenIsTSTypeOperator(this.value) && this.isContextual(this.value)
      return isTypeOperator
        ? this.__ts_tsParseTypeOperator()
        : this.isContextual("infer")
          ? this.__ts_tsParseInferType()
          : this.__ts_tsInAllowConditionalTypesContext(() =>
            this.__ts_tsParseArrayTypeOrHigher()
          )
    }
  pp.__ts_tsParseIntersectionTypeOrHigher =
    function __ts_tsParseIntersectionTypeOrHigher() {
      return this.__ts_tsParseUnionOrIntersectionType(
        "TSIntersectionType",
        this.__ts_tsParseTypeOperatorOrHigher.bind(this),
        tokTypes.bitwiseAND
      )
    }
  pp.__ts_tsParseUnionTypeOrHigher =
    function __ts_tsParseUnionTypeOrHigher() {
      return this.__ts_tsParseUnionOrIntersectionType(
        "TSUnionType",
        this.__ts_tsParseIntersectionTypeOrHigher.bind(this),
        tokTypes.bitwiseOR
      )
    }
  pp.__ts_tsParseNonConditionalType =
    function __ts_tsParseNonConditionalType() {
      if (this.__ts_tsIsStartOfFunctionType()) {
        return this.__ts_tsParseFunctionOrConstructorType("TSFunctionType")
      }
      if (this.__ts_match(tokTypes._new)) {
        return this.__ts_tsParseFunctionOrConstructorType("TSConstructorType")
      } else if (this.__ts_isAbstractConstructorSignature()) {
        return this.__ts_tsParseFunctionOrConstructorType(
          "TSConstructorType" /* abstract */,
          true
        )
      }
      return this.__ts_tsParseUnionTypeOrHigher()
    }
  pp.__ts_tsParseType = function __ts_tsParseType() {
    assert(this.inType)
    const type = this.__ts_tsParseNonConditionalType()
    if (
      this.__ts_inDisallowConditionalTypesContext ||
      this.__ts_hasPrecedingLineBreak() ||
      !this.eat(tokTypes._extends)
    ) {
      return type
    }
    const node = this.__ts_startNodeAtNode(type)
    node.checkType = type
    node.extendsType = this.__ts_tsInDisallowConditionalTypesContext(() =>
      this.__ts_tsParseNonConditionalType()
    )
    this.expect(tokTypes.question)
    node.trueType = this.__ts_tsInAllowConditionalTypesContext(() =>
      this.__ts_tsParseType()
    )
    this.expect(tokTypes.colon)
    node.falseType = this.__ts_tsInAllowConditionalTypesContext(() =>
      this.__ts_tsParseType()
    )
    return this.finishNode(node, "TSConditionalType")
  }
  pp.__ts_tsIsUnambiguouslyIndexSignature =
    function __ts_tsIsUnambiguouslyIndexSignature() {
      this.next()
      if (tokenIsIdentifier(this.type)) {
        this.next()
        return this.__ts_match(tokTypes.colon)
      }
      return false
    }
  pp.__ts_tsInType = function __ts_tsInType(cb) {
    const oldInType = this.inType
    this.inType = true
    try {
      return cb()
    } finally {
      this.inType = oldInType
    }
  }
  pp.__ts_tsTryParseIndexSignature = function __ts_tsTryParseIndexSignature(
    node
  ) {
    if (
      !(
        this.__ts_match(tokTypes.bracketL) &&
        this.__ts_tsLookAhead(
          this.__ts_tsIsUnambiguouslyIndexSignature.bind(this)
        )
      )
    ) {
      return undefined
    }
    this.expect(tokTypes.bracketL)
    const id = this.parseIdent(true)
    id.typeAnnotation = this.__ts_tsParseTypeAnnotation()
    this.__ts_resetEndLocation(id)
    this.expect(tokTypes.bracketR)
    node.parameters = [id]
    const type = this.__ts_tsTryParseTypeAnnotation()
    if (type) node.typeAnnotation = type
    this.__ts_tsParseTypeMemberSemicolon()
    return this.finishNode(node, "TSIndexSignature")
  }
  pp.__ts_tsParseTypeModifiers = function __ts_tsParseTypeModifiers(node) {
    this.__ts_tsParseModifiers({
      modified: node,
      allowedModifiers: ["const"],
      disallowedModifiers: ["in", "out"],
      errorTemplate: InvalidModifierOnTypeParameterPositions,
    })
  }
  pp.__ts_tsParseConstModifier = function __ts_tsParseConstModifier(node) {
    this.__ts_tsParseModifiers({
      modified: node,
      allowedModifiers: ["const"],
      // for better error recovery
      disallowedModifiers: ["in", "out"],
      errorTemplate: InvalidModifierOnTypeParameterPositions,
    })
  }
  pp.__ts_tsParseTypeParameter = function __ts_tsParseTypeParameter(
    parseModifiers = this.__ts_tsParseTypeModifiers.bind(this)
  ) {
    const node = this.startNode()
    node.modifiers = parseModifiers(node)
    node.name = this.__ts_tsParseTypeParameterName()
    node.constraint = this.__ts_tsEatThenParseType(tokTypes._extends)
    node.default = this.__ts_tsEatThenParseType(tokTypes.eq)
    return this.finishNode(node, "TSTypeParameter")
  }
  pp.__ts_tsParseTypeParameters = function __ts_tsParseTypeParameters(
    parseModifiers
  ) {
    const node = this.startNode()
    if (this.__ts_tsMatchLeftRelational()) {
      this.next()
    } else {
      this.unexpected()
    }
    const refTrailingCommaPos = {
      value: -1,
    }
    node.params = this.__ts_tsParseBracketedList(
      "TypeParametersOrArguments",
      this.__ts_tsParseTypeParameter.bind(this, parseModifiers) /* bracket */,
      false /* skipFirstToken */,
      true,
      refTrailingCommaPos
    )
    if (node.params.length === 0) {
      this.raise(this.start, EmptyTypeParameters)
    }
    if (refTrailingCommaPos.value !== -1) {
      this.__ts_addExtra(node, "trailingComma", refTrailingCommaPos.value)
    }
    return this.finishNode(node, "TSTypeParameterDeclaration")
  }
  pp.__ts_tsTryParseTypeParameters = function __ts_tsTryParseTypeParameters(
    parseModifiers
  ) {
    if (this.__ts_tsMatchLeftRelational()) {
      return this.__ts_tsParseTypeParameters(parseModifiers)
    }
  }
  pp.__ts_tsTryParse = function __ts_tsTryParse(f) {
    const state = this.__ts_cloneCurLookaheadState()
    const result = f()
    if (result !== undefined && result !== false) {
      return result
    } else {
      this.__ts_setLookaheadState(state)
      return undefined
    }
  }
  pp.__ts_tsTokenCanFollowModifier =
    function __ts_tsTokenCanFollowModifier() {
      return (
        (this.__ts_match(tokTypes.bracketL) ||
          this.__ts_match(tokTypes.braceL) ||
          this.__ts_match(tokTypes.star) ||
          this.__ts_match(tokTypes.ellipsis) ||
          this.__ts_match(tokTypes.privateId) ||
          this.__ts_isLiteralPropertyName()) &&
        (this.__ts_modifier === "static" || !this.__ts_hasPrecedingLineBreak())
      )
    }
  pp.__ts_tsNextTokenCanFollowModifier =
    function __ts_tsNextTokenCanFollowModifier() {
      this.next(true)
      return this.__ts_tsTokenCanFollowModifier()
    }
  pp.__ts_tsParseModifier = function __ts_tsParseModifier(
    allowedModifiers,
    stopOnStartOfClassStaticBlock
  ) {
    const modifier = this.value
    if (allowedModifiers.indexOf(modifier) !== -1 && !this.containsEsc) {
      if (
        stopOnStartOfClassStaticBlock &&
        this.__ts_tsIsStartOfStaticBlocks()
      ) {
        return undefined
      }
      this.__ts_modifier = modifier
      if (
        this.__ts_tsTryParse(
          this.__ts_tsNextTokenCanFollowModifier.bind(this)
        )
      ) {
        this.__ts_modifier = undefined
        return modifier
      }
      this.__ts_modifier = undefined
    }
    return undefined
  }
  pp.__ts_tsParseModifiers = function __ts_tsParseModifiers(o) {
    const {
      modified,
      allowedModifiers,
      disallowedModifiers,
      stopOnStartOfClassStaticBlock,
      errorTemplate = InvalidModifierOnTypeMember,
    } = o
    const modifiedMap = {}
    const enforceOrder = (loc, modifier, before, after) => {
      if (modifier === before && modified[after]) {
        this.raise(
          loc.column,
          InvalidModifiersOrder({
            orderedModifiers: [before, after],
          })
        )
      }
    }
    const incompatible = (pos, modifier, mod1, mod2) => {
      if (
        (modified[mod1] && modifier === mod2) ||
        (modified[mod2] && modifier === mod1)
      ) {
        this.raise(
          pos,
          IncompatibleModifiers({
            modifiers: [mod1, mod2],
          })
        )
      }
    }
    for (; ;) {
      const startPos = this.pos
      const modifier = this.__ts_tsParseModifier(
        allowedModifiers.concat(
          disallowedModifiers !== null && disallowedModifiers !== undefined
            ? disallowedModifiers
            : []
        ),
        stopOnStartOfClassStaticBlock
      )
      if (!modifier) break
      if (tsIsAccessModifier(modifier)) {
        if (modified.accessibility) {
          this.raise(this.start, DuplicateAccessibilityModifier())
        } else {
          enforceOrder(startPos, modifier, modifier, "override")
          enforceOrder(startPos, modifier, modifier, "static")
          enforceOrder(startPos, modifier, modifier, "readonly")
          enforceOrder(startPos, modifier, modifier, "accessor")
          modifiedMap.accessibility = modifier
          modified["accessibility"] = modifier
        }
      } else if (tsIsVarianceAnnotations(modifier)) {
        if (modified[modifier]) {
          this.raise(
            this.start,
            DuplicateModifier({
              modifier,
            })
          )
        } else {
          enforceOrder(startPos, modifier, "in", "out")
          modifiedMap[modifier] = modifier
          modified[modifier] = true
        }
      } else if (tsIsClassAccessor(modifier)) {
        if (modified[modifier]) {
          this.raise(
            this.start,
            DuplicateModifier({
              modifier,
            })
          )
        } else {
          incompatible(startPos, modifier, "accessor", "readonly")
          modifiedMap[modifier] = modifier
          modified[modifier] = true
        }
      } else if (modifier === "const") {
        if (modified[modifier]) {
          this.raise(
            this.start,
            DuplicateModifier({
              modifier,
            })
          )
        } else {
          modifiedMap[modifier] = modifier
          modified[modifier] = true
        }
      } else {
        if (Object.hasOwnProperty.call(modified, modifier)) {
          this.raise(
            this.start,
            DuplicateModifier({
              modifier,
            })
          )
        } else {
          enforceOrder(startPos, modifier, "static", "readonly")
          enforceOrder(startPos, modifier, "static", "override")
          enforceOrder(startPos, modifier, "override", "readonly")
          enforceOrder(startPos, modifier, "abstract", "override")
          incompatible(startPos, modifier, "declare", "override")
          incompatible(startPos, modifier, "static", "abstract")
          modifiedMap[modifier] = modifier
          modified[modifier] = true
        }
      }
      if (
        disallowedModifiers !== null &&
        disallowedModifiers !== undefined &&
        disallowedModifiers.includes(modifier)
      ) {
        this.raise(
          this.start,
          errorTemplate({
            modifier,
          })
        )
      }
    }
    return modifiedMap
  }
  pp.__ts_tsParseInOutModifiers = function __ts_tsParseInOutModifiers(node) {
    this.__ts_tsParseModifiers({
      modified: node,
      allowedModifiers: ["in", "out"],
      disallowedModifiers: [
        "public",
        "private",
        "protected",
        "readonly",
        "declare",
        "abstract",
        "override",
      ],
      errorTemplate: InvalidModifierOnTypeParameter,
    })
  }
  pp.__ts_tsParseTypeAssertion = function __ts_tsParseTypeAssertion() {
    if (this.options.disallowAmbiguousJSXLike) {
      this.raise(this.start, ReservedTypeAssertion)
    }
    const result = this.__ts_tryParse(() => {
      const node = this.startNode()
      const _const = this.__ts_tsTryNextParseConstantContext()
      node.typeAnnotation = _const || this.__ts_tsNextThenParseType()
      this.expect(tokTypes.relational)
      node.expression = this.parseMaybeUnary()
      return this.finishNode(node, "TSTypeAssertion")
    })
    if (result.error) {
      return this.__ts_tsParseTypeParameters(
        this.__ts_tsParseConstModifier.bind(this)
      )
    } else {
      return result.node
    }
  }
  pp.__ts_tsParseTypeArguments = function __ts_tsParseTypeArguments() {
    const node = this.startNode()
    node.params = this.__ts_tsInType(() =>
      // Temporarily remove a JSX parsing context, which makes us scan different tokens.
      this.__ts_tsInNoContext(() => {
        this.expect(tokTypes.relational)
        return this.__ts_tsParseDelimitedList(
          "TypeParametersOrArguments",
          this.__ts_tsParseType.bind(this)
        )
      })
    )
    if (node.params.length === 0) {
      this.raise(this.start, EmptyTypeArguments)
    }
    this.exprAllowed = false
    this.expect(tokTypes.relational)
    return this.finishNode(node, "TSTypeParameterInstantiation")
  }
  pp.__ts_tsParseHeritageClause = function __ts_tsParseHeritageClause(token) {
    const originalStart = this.start
    const delimitedList = this.__ts_tsParseDelimitedList(
      "HeritageClauseElement",
      () => {
        const node = this.startNode()
        node.expression = this.__ts_tsParseEntityName()
        if (this.__ts_tsMatchLeftRelational()) {
          node.typeParameters = this.__ts_tsParseTypeArguments()
        }
        return this.finishNode(node, "TSExpressionWithTypeArguments")
      }
    )
    if (!delimitedList.length) {
      this.raise(
        originalStart,
        EmptyHeritageClauseType({
          token,
        })
      )
    }
    return delimitedList
  }
  pp.__ts_tsParseTypeMemberSemicolon =
    function __ts_tsParseTypeMemberSemicolon() {
      if (!this.eat(tokTypes.comma) && !this.__ts_isLineTerminator()) {
        this.expect(tokTypes.semi)
      }
    }
  pp.__ts_tsTryParseAndCatch = function __ts_tsTryParseAndCatch(f) {
    const result = this.__ts_tryParse((abort) => f() || abort())
    if (result.aborted || !result.node) return undefined
    if (result.error) this.__ts_setLookaheadState(result.failState)
    return result.node
  }
  pp.__ts_tsParseSignatureMember = function __ts_tsParseSignatureMember(
    kind,
    node
  ) {
    this.__ts_tsFillSignature(tokTypes.colon, node)
    this.__ts_tsParseTypeMemberSemicolon()
    return this.finishNode(node, kind)
  }
  pp.__ts_tsParsePropertyOrMethodSignature =
    function __ts_tsParsePropertyOrMethodSignature(node, readonly) {
      if (this.eat(tokTypes.question)) node.optional = true
      const nodeAny = node
      if (
        this.__ts_match(tokTypes.parenL) ||
        this.__ts_tsMatchLeftRelational()
      ) {
        if (readonly) {
          this.raise(node.start, ReadonlyForMethodSignature)
        }
        const method = nodeAny
        if (method.kind && this.__ts_tsMatchLeftRelational()) {
          this.raise(this.start, AccesorCannotHaveTypeParameters)
        }
        this.__ts_tsFillSignature(tokTypes.colon, method)
        this.__ts_tsParseTypeMemberSemicolon()
        const paramsKey = "parameters"
        const returnTypeKey = "typeAnnotation"
        if (method.kind === "get") {
          if (method[paramsKey].length > 0) {
            this.raise(
              this.start,
              "A 'get' accesor must not have any formal parameters."
            )
            if (this.__ts_isThisParam(method[paramsKey][0])) {
              this.raise(this.start, AccesorCannotDeclareThisParameter)
            }
          }
        } else if (method.kind === "set") {
          if (method[paramsKey].length !== 1) {
            this.raise(
              this.start,
              "A 'get' accesor must not have any formal parameters."
            )
          } else {
            const firstParameter = method[paramsKey][0]
            if (this.__ts_isThisParam(firstParameter)) {
              this.raise(this.start, AccesorCannotDeclareThisParameter)
            }
            if (firstParameter.type === "Identifier" && firstParameter.optional) {
              this.raise(this.start, SetAccesorCannotHaveOptionalParameter)
            }
            if (firstParameter.type === "RestElement") {
              this.raise(this.start, SetAccesorCannotHaveRestParameter)
            }
          }
          if (method[returnTypeKey]) {
            this.raise(
              method[returnTypeKey].start,
              SetAccesorCannotHaveReturnType
            )
          }
        } else {
          method.kind = "method"
        }
        return this.finishNode(method, "TSMethodSignature")
      } else {
        const property = nodeAny
        if (readonly) property.readonly = true
        const type = this.__ts_tsTryParseTypeAnnotation()
        if (type) property.typeAnnotation = type
        this.__ts_tsParseTypeMemberSemicolon()
        return this.finishNode(property, "TSPropertySignature")
      }
    }
  pp.__ts_tsParseTypeMember = function __ts_tsParseTypeMember() {
    const node = this.startNode()
    if (
      this.__ts_match(tokTypes.parenL) ||
      this.__ts_tsMatchLeftRelational()
    ) {
      return this.__ts_tsParseSignatureMember(
        "TSCallSignatureDeclaration",
        node
      )
    }
    if (this.__ts_match(tokTypes._new)) {
      const id = this.startNode()
      this.next()
      if (
        this.__ts_match(tokTypes.parenL) ||
        this.__ts_tsMatchLeftRelational()
      ) {
        return this.__ts_tsParseSignatureMember(
          "TSConstructSignatureDeclaration",
          node
        )
      } else {
        node.key = this.__ts_createIdentifier(id, "new")
        return this.__ts_tsParsePropertyOrMethodSignature(node, false)
      }
    }
    this.__ts_tsParseModifiers({
      modified: node,
      allowedModifiers: ["readonly"],
      disallowedModifiers: [
        "declare",
        "abstract",
        "private",
        "protected",
        "public",
        "static",
        "override",
      ],
    })
    const idx = this.__ts_tsTryParseIndexSignature(node)
    if (idx) {
      return idx
    }
    this.parsePropertyName(node)
    if (
      !node.computed &&
      node.key.type === "Identifier" &&
      (node.key.name === "get" || node.key.name === "set") &&
      this.__ts_tsTokenCanFollowModifier()
    ) {
      node.kind = node.key.name
      this.parsePropertyName(node)
    }
    return this.__ts_tsParsePropertyOrMethodSignature(node, !!node.readonly)
  }
  pp.__ts_tsParseList = function __ts_tsParseList(kind, parseElement) {
    const result = []
    while (!this.__ts_tsIsListTerminator(kind)) {
      result.push(parseElement())
    }
    return result
  }
  pp.__ts_tsParseObjectTypeMembers =
    function __ts_tsParseObjectTypeMembers() {
      this.expect(tokTypes.braceL)
      const members = this.__ts_tsParseList(
        "TypeMembers",
        this.__ts_tsParseTypeMember.bind(this)
      )
      this.expect(tokTypes.braceR)
      return members
    }
  pp.__ts_tsParseInterfaceDeclaration =
    function __ts_tsParseInterfaceDeclaration(node, properties = {}) {
      if (this.__ts_hasFollowingLineBreak()) return null
      this.expectContextual("interface")
      if (properties.declare) node.declare = true
      if (tokenIsIdentifier(this.type)) {
        node.id = this.parseIdent(true)
        this.checkLValSimple(node.id, acornScope_BIND_TS_INTERFACE)
      } else {
        node.id = null
        this.raise(this.start, MissingInterfaceName)
      }
      node.typeParameters = this.__ts_tsTryParseTypeParameters(
        this.__ts_tsParseInOutModifiers.bind(this)
      )
      if (this.eat(tokTypes._extends)) {
        node.extends = this.__ts_tsParseHeritageClause("extends")
      }
      const body = this.startNode()
      body.body = this.__ts_tsParseInterfaceBody()
      node.body = this.finishNode(body, "TSInterfaceBody")
      return this.finishNode(node, "TSInterfaceDeclaration")
    }
  pp.__ts_tsParseInterfaceBody = function __ts_tsParseInterfaceBody() {
    this.expect(tokTypes.braceL)
    let members = this.__ts_tsInType(() =>
      this.__ts_tsParseList(
        "TypeMembers",
        this.__ts_tsParseTypeMember.bind(this)
      )
    )
    this.expect(tokTypes.braceR)
    return members
  }
  pp.__ts_tsParseAbstractDeclaration =
    function __ts_tsParseAbstractDeclaration(node) {
      if (this.__ts_match(tokTypes._class)) {
        node.abstract = true
        return this.parseClass(node, true)
      } else if (this.isContextual("interface")) {
        if (!this.__ts_hasFollowingLineBreak()) {
          node.abstract = true
          return this.__ts_tsParseInterfaceDeclaration(node)
        }
      } else {
        this.unexpected(node.start)
      }
    }
  pp.__ts_tsIsDeclarationStart = function __ts_tsIsDeclarationStart() {
    return tokenIsTSDeclarationStart(this.value) && this.isContextual(this.value)
  }
  pp.__ts_tsParseExpressionStatement =
    function __ts_tsParseExpressionStatement(node, expr) {
      switch (expr.name) {
        case "declare": {
          const declaration = this.__ts_tsTryParseDeclare(node)
          if (declaration) {
            declaration.declare = true
            return declaration
          }
          break
        }
        case "global":
          if (this.__ts_match(tokTypes.braceL)) {
            this.enterScope(TS_SCOPE_TS_MODULE)
            const mod = node
            mod.global = true
            mod.id = expr
            mod.body = this.__ts_tsParseModuleBlock()
            this.vanilla_exitScope()
            return this.finishNode(mod, "TSModuleDeclaration")
          }
          break
        default:
          return this.__ts_tsParseDeclaration(
            node,
            expr.name /* next */,
            false
          )
      }
    }
  pp.__ts_tsParseModuleReference = function __ts_tsParseModuleReference() {
    return this.__ts_tsIsExternalModuleReference()
      ? this.__ts_tsParseExternalModuleReference()
      : this.__ts_tsParseEntityName(/* allowReservedWords */ false)
  }
  pp.__ts_tsInAmbientContext = function __ts_tsInAmbientContext(cb) {
    const oldIsAmbientContext = this.__ts_isAmbientContext
    this.__ts_isAmbientContext = true
    try {
      return cb()
    } finally {
      this.__ts_isAmbientContext = oldIsAmbientContext
    }
  }
  pp.__ts_tsCheckLineTerminator = function __ts_tsCheckLineTerminator(next) {
    if (next) {
      if (this.__ts_hasFollowingLineBreak()) return false
      this.next()
      return true
    }
    return !this.__ts_isLineTerminator()
  }
  pp.__ts_tsParseModuleOrNamespaceDeclaration =
    function __ts_tsParseModuleOrNamespaceDeclaration(node, nested = false) {
      node.id = this.parseIdent(true)
      if (!nested) {
        this.checkLValSimple(node.id, acornScope_BIND_TS_NAMESPACE)
      }
      if (this.eat(tokTypes.dot)) {
        const inner = this.startNode()
        this.__ts_tsParseModuleOrNamespaceDeclaration(inner, true)
        node.body = inner
      } else {
        this.enterScope(TS_SCOPE_TS_MODULE)
        node.body = this.__ts_tsParseModuleBlock()
        this.vanilla_exitScope()
      }
      return this.finishNode(node, "TSModuleDeclaration")
    }
  pp.__ts_tsParseTypeAliasDeclaration =
    function __ts_tsParseTypeAliasDeclaration(node) {
      node.id = this.parseIdent(true)
      this.checkLValSimple(node.id, acornScope_BIND_TS_TYPE)
      node.typeAnnotation = this.__ts_tsInType(() => {
        node.typeParameters = this.__ts_tsTryParseTypeParameters(
          this.__ts_tsParseInOutModifiers.bind(this)
        )
        this.expect(tokTypes.eq)
        if (
          this.isContextual("interface") &&
          this.__ts_lookahead().type !== tokTypes.dot
        ) {
          const node2 = this.startNode()
          this.next()
          return this.finishNode(node2, "TSIntrinsicKeyword")
        }
        return this.__ts_tsParseType()
      })
      this.semicolon()
      return this.finishNode(node, "TSTypeAliasDeclaration")
    }
  pp.__ts_tsParseDeclaration = function __ts_tsParseDeclaration(
    node,
    value,
    next
  ) {
    switch (value) {
      case "abstract":
        if (
          this.__ts_tsCheckLineTerminator(next) &&
          (this.__ts_match(tokTypes._class) || tokenIsIdentifier(this.type))
        ) {
          return this.__ts_tsParseAbstractDeclaration(node)
        }
        break
      case "module":
        if (this.__ts_tsCheckLineTerminator(next)) {
          if (this.__ts_match(tokTypes.string)) {
            return this.__ts_tsParseAmbientExternalModuleDeclaration(node)
          } else if (tokenIsIdentifier(this.type)) {
            return this.__ts_tsParseModuleOrNamespaceDeclaration(node)
          }
        }
        break
      case "namespace":
        if (
          this.__ts_tsCheckLineTerminator(next) &&
          tokenIsIdentifier(this.type)
        ) {
          return this.__ts_tsParseModuleOrNamespaceDeclaration(node)
        }
        break
      case "type":
        if (
          this.__ts_tsCheckLineTerminator(next) &&
          tokenIsIdentifier(this.type)
        ) {
          return this.__ts_tsParseTypeAliasDeclaration(node)
        }
        break
    }
  }
  pp.__ts_tsTryParseExportDeclaration =
    function __ts_tsTryParseExportDeclaration() {
      return this.__ts_tsParseDeclaration(
        this.startNode(),
        this.value /* next */,
        true
      )
    }
  pp.__ts_tsParseImportEqualsDeclaration =
    function __ts_tsParseImportEqualsDeclaration(node, isExport) {
      node.isExport = isExport || false
      node.id = this.parseIdent()
      this.checkLValSimple(node.id, acornScope_BIND_LEXICAL)
      this.vanilla_expect(tokTypes.eq)
      const moduleReference = this.__ts_tsParseModuleReference()
      if (
        node.importKind === "type" &&
        moduleReference.type !== "TSExternalModuleReference"
      ) {
        this.raise(moduleReference.start, ImportAliasHasImportType)
      }
      node.moduleReference = moduleReference
      this.vanilla_semicolon()
      return this.finishNode(node, "TSImportEqualsDeclaration")
    }
  pp.__ts_typeCastToParameter = function __ts_typeCastToParameter(node) {
    let _node$typeAnnotation$
    node.expression.typeAnnotation = node.typeAnnotation
    this.__ts_resetEndLocation(
      node.expression,
      node.typeAnnotation.end,
      (_node$typeAnnotation$ = node.typeAnnotation.loc) === null ||
        _node$typeAnnotation$ === undefined
        ? undefined
        : _node$typeAnnotation$.end
    )
    return node.expression
  }
  pp.__ts_reportReservedArrowTypeParam =
    function __ts_reportReservedArrowTypeParam(node) {
      let _node$extra
      if (
        node.params.length === 1 &&
        !(
          (_node$extra = node.extra) !== null &&
          _node$extra !== undefined &&
          _node$extra.trailingComma
        ) &&
        this.options.disallowAmbiguousJSXLike
      ) {
        this.raise(node.start, ReservedArrowTypeParam)
      }
    }
  pp.__ts_parsePostMemberNameModifiers =
    function __ts_parsePostMemberNameModifiers(methodOrProp) {
      const optional = this.eat(tokTypes.question)
      if (optional) methodOrProp.optional = true
      if (methodOrProp.readonly && this.__ts_match(tokTypes.parenL)) {
        this.raise(methodOrProp.start, ClassMethodHasReadonly)
      }
      if (methodOrProp.declare && this.__ts_match(tokTypes.parenL)) {
        this.raise(methodOrProp.start, ClassMethodHasDeclare)
      }
    }
  pp.__ts_parseConditional = function __ts_parseConditional(
    expr,
    startPos,
    startLoc,
    forInit,
    refDestructuringErrors
  ) {
    if (this.eat(tokTypes.question)) {
      let node = this.startNodeAt(startPos, startLoc)
      node.test = expr
      node.consequent = this.parseMaybeAssign()
      this.expect(tokTypes.colon)
      node.alternate = this.parseMaybeAssign(forInit)
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  }
  pp.__ts_parseClassPropertyAnnotation =
    function __ts_parseClassPropertyAnnotation(node) {
      if (!node.optional) {
        if (this.value === "!" && this.eat(tokTypes.prefix)) {
          node.definite = true
        } else if (this.eat(tokTypes.question)) {
          node.optional = true
        }
      }
      const type = this.__ts_tsTryParseTypeAnnotation()
      if (type) node.typeAnnotation = type
    }
  pp.__ts_isClassMethod = function __ts_isClassMethod() {
    return this.__ts_match(tokTypes.relational)
  }
  pp.__ts_isAssignable = function __ts_isAssignable(node, isBinding) {
    switch (node.type) {
      case "TSTypeCastExpression":
        return this.__ts_isAssignable(node.expression, isBinding)
      case "TSParameterProperty":
        return true
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        return true
      case "ObjectExpression": {
        const last = node.properties.length - 1
        return node.properties.every((prop, i) => {
          return (
            prop.type !== "ObjectMethod" &&
            (i === last || prop.type !== "SpreadElement") &&
            this.__ts_isAssignable(prop)
          )
        })
      }
      case "Property":
      case "ObjectProperty":
        return this.__ts_isAssignable(node.value)
      case "SpreadElement":
        return this.__ts_isAssignable(node.argument)
      case "ArrayExpression":
        return node.elements.every(
          (element) => element === null || this.__ts_isAssignable(element)
        )
      case "AssignmentExpression":
        return node.operator === "="
      case "ParenthesizedExpression":
        return this.__ts_isAssignable(node.expression)
      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding
      default:
        return false
    }
  }
  pp.__ts_toAssignableParenthesizedExpression =
    function __ts_toAssignableParenthesizedExpression(
      node,
      isBinding,
      refDestructuringErrors
    ) {
      switch (node.expression.type) {
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSNonNullExpression":
        case "TSTypeAssertion":
        case "ParenthesizedExpression":
          return this.toAssignable(
            node.expression,
            isBinding,
            refDestructuringErrors
          )
        default:
          return this.vanilla_toAssignable(node,
            isBinding,
            refDestructuringErrors
          )
      }
    }
  pp.__ts_parseTaggedTemplateExpression =
    function __ts_parseTaggedTemplateExpression(
      base,
      startPos,
      startLoc,
      optionalChainMember
    ) {
      const node = this.startNodeAt(startPos, startLoc)
      node.tag = base
      node.quasi = this.parseTemplate({
        isTagged: true,
      })
      if (optionalChainMember) {
        this.raise(
          startPos,
          "Tagged Template Literals are not allowed in optionalChain."
        )
      }
      return this.finishNode(node, "TaggedTemplateExpression")
    }
  pp.__ts_parseClassFunctionParams =
    function __ts_parseClassFunctionParams() {
      const typeParameters = this.__ts_tsTryParseTypeParameters()
      let params = this.parseBindingList(
        tokTypes.parenR,
        false,
        this.__ts_ecmaVersion() >= 8,
        true
      )
      if (typeParameters) params.typeParameters = typeParameters
      return params
    }
  pp.__ts_parseTypeOnlyImportExportSpecifier =
    function __ts_parseTypeOnlyImportExportSpecifier(
      node,
      isImport,
      isInTypeOnlyImportExport
    ) {
      const leftOfAsKey = isImport ? "imported" : "local"
      const rightOfAsKey = isImport ? "local" : "exported"
      let leftOfAs = node[leftOfAsKey]
      let rightOfAs
      let hasTypeSpecifier = false
      let canParseAsKeyword = true
      const loc = leftOfAs.start
      if (this.isContextual("as")) {
        const firstAs = this.parseIdent(true)
        if (this.isContextual("as")) {
          const secondAs = this.parseIdent(true)
          if (tokenIsKeywordOrIdentifier(this.type)) {
            hasTypeSpecifier = true
            leftOfAs = firstAs
            rightOfAs = isImport
              ? this.parseIdent(true)
              : this.parseModuleExportName()
            canParseAsKeyword = false
          } else {
            rightOfAs = secondAs
            canParseAsKeyword = false
          }
        } else if (tokenIsKeywordOrIdentifier(this.type)) {
          canParseAsKeyword = false
          rightOfAs = isImport
            ? this.parseIdent(true)
            : this.parseModuleExportName()
        } else {
          hasTypeSpecifier = true
          leftOfAs = firstAs
        }
      } else if (tokenIsKeywordOrIdentifier(this.type)) {
        hasTypeSpecifier = true
        if (isImport) {
          leftOfAs = this.vanilla_parseIdent(true)
          if (!this.isContextual("as")) {
            this.checkUnreserved(leftOfAs)
          }
        } else {
          leftOfAs = this.parseModuleExportName()
        }
      }
      if (hasTypeSpecifier && isInTypeOnlyImportExport) {
        this.raise(
          loc,
          isImport
            ? TypeModifierIsUsedInTypeImports
            : TypeModifierIsUsedInTypeExports
        )
      }
      node[leftOfAsKey] = leftOfAs
      node[rightOfAsKey] = rightOfAs
      const kindKey = isImport ? "importKind" : "exportKind"
      node[kindKey] = hasTypeSpecifier ? "type" : "value"
      if (canParseAsKeyword && this.eatContextual("as")) {
        node[rightOfAsKey] = isImport
          ? this.parseIdent(true)
          : this.parseModuleExportName()
      }
      if (!node[rightOfAsKey]) {
        node[rightOfAsKey] = this.copyNode(node[leftOfAsKey])
      }
      if (isImport) {
        this.checkLValSimple(node[rightOfAsKey], acornScope_BIND_LEXICAL)
      }
    }
  pp.__ts_raiseCommonCheck = function __ts_raiseCommonCheck(
    pos,
    message,
    recoverable
  ) {
    switch (message) {
      case "Comma is not permitted after the rest element": {
        if (
          this.__ts_isAmbientContext &&
          this.__ts_match(tokTypes.comma) &&
          this.__ts_lookaheadCharCode() === 41
        ) {
          this.next()
          return
        } else {
          return this.vanilla_raise(pos, message)
        }
      }
    }
    if (this.__ts__inTryParse) {
      throw { pos, message }
    }
    return recoverable
      ? this.vanilla_raiseRecoverable(pos, message)
      : this.vanilla_raise(pos, message)
  }
  pp.__ts_hasImport = function __ts_hasImport(name, allowShadow) {
    const len = this.__ts_importsStack.length
    if (this.__ts_importsStack[len - 1].indexOf(name) > -1) {
      return true
    }
    if (!allowShadow && len > 1) {
      for (let i = 0; i < len - 1; i++) {
        if (this.__ts_importsStack[i].indexOf(name) > -1) return true
      }
    }
    return false
  }
  pp.__ts_maybeExportDefined = function __ts_maybeExportDefined(scope, name) {
    if (this.inModule && scope.flags & acornScope_SCOPE_TOP) {
      delete this.undefinedExports[name]
    }
  }
  pp.__ts_takeDecorators = function __ts_takeDecorators(node) {
    const decorators =
      this.__ts_decoratorStack[this.__ts_decoratorStack.length - 1]
    if (decorators.length) {
      node.decorators = decorators
      this.resetStartLocationFromNode(node, decorators[0])
      this.__ts_decoratorStack[this.__ts_decoratorStack.length - 1] = []
    }
  }
  pp.__ts_parseDecorators = function __ts_parseDecorators(allowExport) {
    const currentContextDecorators =
      this.__ts_decoratorStack[this.__ts_decoratorStack.length - 1]
    while (this.type === tokTypes2.at) {
      const decorator = this.__ts_parseDecorator()
      currentContextDecorators.push(decorator)
    }
    if (this.type === tokTypes._export) {
      if (!allowExport) {
        this.unexpected()
      }
    } else if (!this.__ts_canHaveLeadingDecorator()) {
      this.raise(this.start, UnexpectedLeadingDecorator)
    }
  }
  pp.__ts_parseDecorator = function __ts_parseDecorator() {
    const node = this.startNode()
    this.next()
    this.__ts_decoratorStack.push([])
    const startPos = this.start
    const startLoc = this.startLoc
    let expr
    if (this.type === tokTypes.parenL) {
      const startPos2 = this.start
      const startLoc2 = this.startLoc
      this.next()
      expr = this.parseExpression()
      this.expect(tokTypes.parenR)
      if (this.options.preserveParens) {
        let par = this.startNodeAt(startPos2, startLoc2)
        par.expression = expr
        expr = this.finishNode(par, "ParenthesizedExpression")
      }
    } else {
      expr = this.parseIdent(false)
      while (this.eat(tokTypes.dot)) {
        const node2 = this.startNodeAt(startPos, startLoc)
        node2.object = expr
        node2.property = this.type === tokTypes.privateId ? this.parsePrivateIdent() : this.parseIdent(true)
        node2.computed = false
        expr = this.finishNode(node2, "MemberExpression")
      }
    }
    node.expression = this.__ts_parseMaybeDecoratorArguments(expr)
    this.__ts_decoratorStack.pop()
    return this.finishNode(node, "Decorator")
  }
  pp.__ts_parseMaybeDecoratorArguments =
    function __ts_parseMaybeDecoratorArguments(expr) {
      if (this.eat(tokTypes.parenL)) {
        const node = this.__ts_startNodeAtNode(expr)
        node.callee = expr
        node.arguments = this.parseExprList(tokTypes.parenR, false)
        return this.finishNode(node, "CallExpression")
      }
      return expr
    }
  pp.__ts_canHaveLeadingDecorator = function __ts_canHaveLeadingDecorator() {
    return this.__ts_match(tokTypes._class) || this.__ts_isAbstractClass()
  }
  pp.__ts_super_parseYield = function __ts_super_parseYield(forInit) {
    if (!this.__ts_jsxEnabled) {
      return this.vanilla_parseYield(forInit)
    }
    if (!this.yieldPos) {
      this.yieldPos = this.start
    }
    skipWhiteSpaceInLine.lastIndex = this.pos
    const nextTokenPos = skipWhiteSpaceInLine.test(this.input)
      ? skipWhiteSpaceInLine.lastIndex
      : this.pos
    if (
      this.input.charCodeAt(nextTokenPos) === 60 &&
      this.input.charCodeAt(nextTokenPos + 1) !== 60
    ) {
      this.next()
      let node = this.startNode()
      const expr = this.parseMaybeAssign(forInit)
      node.delegate = false
      node.argument = expr
      return this.finishNode(node, "YieldExpression")
    }
    return this.vanilla_parseYield(forInit)
  }
  pp.__ts_super_parseExprAtom = function __ts_super_parseExprAtom(
    refDestructuringErrors,
    forInit,
    forNew
  ) {
    if (!this.__ts_jsxEnabled) {
      return this.vanilla_parseExprAtom(refDestructuringErrors,
        forInit,
        forNew
      )
    }
    if (this.type === tokTypes2.jsxText) {
      return this.__ts_jsx_parseText()
    } else if (this.type === tokTypes2.jsxTagStart) {
      return this.__ts_jsx_parseElement()
    } else {
      return this.vanilla_parseExprAtom(refDestructuringErrors,
        forInit,
        forNew
      )
    }
  }
  pp.__ts_super_parseMaybeAssign = function __ts_super_parseMaybeAssign(
    forInit,
    refExpressionErrors,
    afterLeftParse
  ) {
    if (!this.__ts_jsxEnabled) {
      return this.vanilla_parseMaybeAssign(forInit,
        refExpressionErrors,
        afterLeftParse
      )
    }
    if (this.type === tokTypes.relational && this.value === "<") {
      this.finishToken(tokTypes2.jsxTagStart)
    }
    return this.vanilla_parseMaybeAssign(forInit,
      refExpressionErrors,
      afterLeftParse
    )
  }
  pp.__ts_super_jsx_parseElementName =
    function __ts_super_jsx_parseElementName() {
      if (!this.__ts_jsxEnabled) {
        return
      }
      if (this.type === tokTypes2.jsxTagEnd) return ""
      let startPos = this.start,
        startLoc = this.startLoc
      let node = this.__ts_jsx_parseNamespacedName()
      if (this.type === tokTypes.dot && node.type === "JSXNamespacedName") {
        this.unexpected()
      }
      while (this.eat(tokTypes.dot)) {
        let newNode = this.startNodeAt(startPos, startLoc)
        newNode.object = node
        newNode.property = this.__ts_jsx_parseIdentifier()
        node = this.finishNode(newNode, "JSXMemberExpression")
      }
      return node
    }
  pp.__ts_super_jsx_parseAttribute =
    function __ts_super_jsx_parseAttribute() {
      if (!this.__ts_jsxEnabled) {
        return
      }
      let node = this.startNode()
      if (this.eat(tokTypes.braceL)) {
        this.expect(tokTypes.ellipsis)
        node.argument = this.parseMaybeAssign()
        this.expect(tokTypes.braceR)
        return this.finishNode(node, "JSXSpreadAttribute")
      }
      node.name = this.__ts_jsx_parseNamespacedName()
      node.value = this.eat(tokTypes.eq)
        ? this.__ts_jsx_parseAttributeValue()
        : null
      return this.finishNode(node, "JSXAttribute")
    }
  pp.__ts_super_updateContext = function __ts_super_updateContext(prevType) {
    if (!this.__ts_jsxEnabled) {
      return this.vanilla_updateContext(prevType)
    }
    const { type } = this
    if (type === tokTypes.braceL) {
      let curContext = this.curContext()
      if (curContext === tokContexts3.tc_oTag)
        this.context.push(tokContexts.b_expr)
      else if (curContext === tokContexts3.tc_expr)
        this.context.push(tokContexts.b_tmpl)
      else this.vanilla_updateContext(prevType)
      this.exprAllowed = true
    } else if (type === tokTypes.slash && prevType === tokTypes2.jsxTagStart) {
      this.context.length -= 2
      this.context.push(tokContexts3.tc_cTag)
      this.exprAllowed = false
    } else {
      return this.vanilla_updateContext(prevType)
    }
  }
  pp.__ts_super_jsx_parseOpeningElementAt =
    function __ts_super_jsx_parseOpeningElementAt(startPos, startLoc) {
      if (!this.__ts_jsxEnabled) {
        return
      }
      let node = this.startNodeAt(startPos, startLoc)
      node.attributes = []
      let nodeName = this.__ts_super_jsx_parseElementName()
      if (nodeName) node.name = nodeName
      while (this.type !== tokTypes.slash && this.type !== tokTypes2.jsxTagEnd)
        node.attributes.push(this.__ts_super_jsx_parseAttribute())
      node.selfClosing = this.eat(tokTypes.slash)
      this.expect(tokTypes2.jsxTagEnd)
      return this.finishNode(
        node,
        nodeName ? "JSXOpeningElement" : "JSXOpeningFragment"
      )
    }
  pp.__ts_jsx_readToken = function __ts_jsx_readToken() {
    let out = "",
      chunkStart = this.pos
    for (; ;) {
      if (this.pos >= this.input.length)
        this.raise(this.start, "Unterminated JSX contents")
      let ch = this.input.charCodeAt(this.pos)
      switch (ch) {
        case 60:
        // '<'
        case 123:
          if (this.pos === this.start) {
            if (ch === 60) {
              ++this.pos
              return this.finishToken(tokTypes2.jsxTagStart)
            }
            return this.getTokenFromCode(ch)
          }
          out += this.input.slice(chunkStart, this.pos)
          return this.finishToken(tokTypes2.jsxText, out)
        case 38:
          out += this.input.slice(chunkStart, this.pos)
          out += this.__ts_jsx_readEntity()
          chunkStart = this.pos
          break
        case 62:
        // '>'
        case 125:
          this.raise(
            this.pos,
            "Unexpected token `" +
            this.input[this.pos] +
            "`. Did you mean `" +
            (ch === 62 ? "&gt;" : "&rbrace;") +
            "` or `{\"" +
            this.input[this.pos] +
            "\"}`?"
          )
        default:
          if (isNewLine(ch)) {
            out += this.input.slice(chunkStart, this.pos)
            out += this.__ts_jsx_readNewLine(true)
            chunkStart = this.pos
          } else {
            ++this.pos
          }
      }
    }
  }
  pp.__ts_jsx_readNewLine = function __ts_jsx_readNewLine(normalizeCRLF) {
    let ch = this.input.charCodeAt(this.pos)
    let out
    ++this.pos
    if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
      ++this.pos
      out = normalizeCRLF ? "\n" : "\r\n"
    } else {
      out = String.fromCharCode(ch)
    }
    if (this.options.locations) {
      ++this.curLine
      this.lineStart = this.pos
    }
    return out
  }
  pp.__ts_jsx_readString = function __ts_jsx_readString(quote) {
    let out = "",
      chunkStart = ++this.pos
    for (; ;) {
      if (this.pos >= this.input.length)
        this.raise(this.start, "Unterminated string constant")
      let ch = this.input.charCodeAt(this.pos)
      if (ch === quote) break
      if (ch === 38) {
        out += this.input.slice(chunkStart, this.pos)
        out += this.__ts_jsx_readEntity()
        chunkStart = this.pos
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.pos)
        out += this.__ts_jsx_readNewLine(false)
        chunkStart = this.pos
      } else {
        ++this.pos
      }
    }
    out += this.input.slice(chunkStart, this.pos++)
    return this.finishToken(tokTypes.string, out)
  }
  pp.__ts_jsx_readEntity = function __ts_jsx_readEntity() {
    let str = "",
      count = 0,
      entity
    let ch = this.input[this.pos]
    if (ch !== "&") this.raise(this.pos, "Entity must start with an ampersand")
    let startPos = ++this.pos
    while (this.pos < this.input.length && count++ < 10) {
      ch = this.input[this.pos++]
      if (ch === ";") {
        if (str[0] === "#") {
          if (str[1] === "x") {
            str = str.substr(2)
            if (hexNumber.test(str))
              entity = String.fromCharCode(parseInt(str, 16))
          } else {
            str = str.substr(1)
            if (decimalNumber.test(str))
              entity = String.fromCharCode(parseInt(str, 10))
          }
        } else {
          entity = entities_default[str]
        }
        break
      }
      str += ch
    }
    if (!entity) {
      this.pos = startPos
      return "&"
    }
    return entity
  }
  pp.__ts_jsx_readWord = function __ts_jsx_readWord() {
    let ch,
      start = this.pos
    do {
      ch = this.input.charCodeAt(++this.pos)
    } while (isIdentifierChar(ch) || ch === 45)
    return this.finishToken(tokTypes2.jsxName, this.input.slice(start, this.pos))
  }
  pp.__ts_jsx_parseIdentifier = function __ts_jsx_parseIdentifier() {
    let node = this.startNode()
    if (this.type === tokTypes2.jsxName) node.name = this.value
    else if (this.type.keyword) node.name = this.type.keyword
    else this.unexpected()
    this.next()
    return this.finishNode(node, "JSXIdentifier")
  }
  pp.__ts_jsx_parseNamespacedName = function __ts_jsx_parseNamespacedName() {
    let startPos = this.start,
      startLoc = this.startLoc
    let name = this.__ts_jsx_parseIdentifier()
    if (!this.eat(tokTypes.colon)) return name
    let node = this.startNodeAt(startPos, startLoc)
    node.namespace = name
    node.name = this.__ts_jsx_parseIdentifier()
    return this.finishNode(node, "JSXNamespacedName")
  }
  pp.__ts_jsx_parseAttributeValue = function __ts_jsx_parseAttributeValue() {
    if (this.type === tokTypes.relational && this.value === "<") {
      this.finishToken(tokTypes2.jsxTagStart)
    }
    switch (this.type) {
      case tokTypes.braceL:
        let node = this.__ts_jsx_parseExpressionContainer(false)
        if (node.expression.type === "JSXEmptyExpression")
          this.raise(
            node.start,
            "JSX attributes must only be assigned a non-empty expression"
          )
        return node
      case tokTypes2.jsxTagStart:
      case tokTypes.string:
        return this.parseExprAtom()
      default:
        this.raise(
          this.start,
          "JSX value should be either an expression or a quoted JSX text"
        )
    }
  }
  pp.__ts_jsx_parseEmptyExpression =
    function __ts_jsx_parseEmptyExpression() {
      let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc)
      return this.finishNodeAt(
        node,
        "JSXEmptyExpression",
        this.start,
        this.startLoc
      )
    }
  pp.__ts_jsx_parseExpressionContainer =
    function __ts_jsx_parseExpressionContainer(allowSpread) {
      let node = this.startNode()
      this.next()
      if (allowSpread && this.type === tokTypes.ellipsis) {
        this.next()
        node.expression = this.parseExpression()
        this.expect(tokTypes.braceR)
        return this.finishNode(node, "JSXSpreadChild")
      }
      node.expression =
        this.type === tokTypes.braceR
          ? this.__ts_jsx_parseEmptyExpression()
          : this.parseExpression()
      this.expect(tokTypes.braceR)
      return this.finishNode(node, "JSXExpressionContainer")
    }
  pp.__ts_jsx_parseClosingElementAt = function __ts_jsx_parseClosingElementAt(
    startPos,
    startLoc
  ) {
    let node = this.startNodeAt(startPos, startLoc)
    let nodeName = this.__ts_super_jsx_parseElementName()
    if (nodeName) node.name = nodeName
    this.expect(tokTypes2.jsxTagEnd)
    return this.finishNode(
      node,
      nodeName ? "JSXClosingElement" : "JSXClosingFragment"
    )
  }
  pp.__ts_jsx_parseElementAt = function __ts_jsx_parseElementAt(
    startPos,
    startLoc
  ) {
    let node = this.startNodeAt(startPos, startLoc)
    let children = []
    let openingElement = this.__ts_jsx_parseOpeningElementAt(
      startPos,
      startLoc
    )
    let closingElement = null
    if (!openingElement.selfClosing) {
      contents: for (; ;) {
        switch (this.type) {
          case tokTypes2.jsxTagStart:
            startPos = this.start
            startLoc = this.startLoc
            this.next()
            if (this.eat(tokTypes.slash)) {
              closingElement = this.__ts_jsx_parseClosingElementAt(
                startPos,
                startLoc
              )
              break contents
            }
            children.push(this.__ts_jsx_parseElementAt(startPos, startLoc))
            break
          case tokTypes2.jsxText:
            children.push(this.parseExprAtom())
            break
          case tokTypes.braceL:
            children.push(this.__ts_jsx_parseExpressionContainer(true))
            break
          default:
            this.unexpected()
        }
      }
      if (
        getQualifiedJSXName(closingElement.name) !==
        getQualifiedJSXName(openingElement.name)
      ) {
        this.raise(
          closingElement.start,
          "Expected corresponding JSX closing tag for <" +
          getQualifiedJSXName(openingElement.name) +
          ">"
        )
      }
    }
    let fragmentOrElement = openingElement.name ? "Element" : "Fragment"
    node["opening" + fragmentOrElement] = openingElement
    node["closing" + fragmentOrElement] = closingElement
    node.children = children
    if (this.type === tokTypes.relational && this.value === "<") {
      this.raise(
        this.start,
        "Adjacent JSX elements must be wrapped in an enclosing tag"
      )
    }
    return this.finishNode(node, "JSX" + fragmentOrElement)
  }
  pp.__ts_jsx_parseText = function __ts_jsx_parseText() {
    let node = this.parseLiteral(this.value)
    node.type = "JSXText"
    return node
  }
  pp.__ts_jsx_parseElement = function __ts_jsx_parseElement() {
    let startPos = this.start,
      startLoc = this.startLoc
    this.next()
    return this.__ts_jsx_parseElementAt(startPos, startLoc)
  }
}
enableExt()
