// Reserved word lists for various dialects of the language

const ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"
const ecma6Keywords = " extends class super const export import"
const oopKeywords = " implements interface package private protected public static"

export const reservedWords = {
  3: "abstract boolean byte char double final float goto int long native short synchronized throws transient volatile enum export import" + oopKeywords,
  5: "enum" + ecma6Keywords,
  6: "enum",
  strict: "yield let" + oopKeywords,
  strictBind: "eval arguments"
}

// And the keywords

export const keywords = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + ecma6Keywords
}

export const keywordRelationalOperator = /^in(stanceof)?$/

// ## Character categories

// eslint-disable-next-line prefer-regex-literals
const nonASCIIidentifierStart = new RegExp("\\p{ID_Start}", "u")
// eslint-disable-next-line prefer-regex-literals
const nonASCIIidentifier = new RegExp("\\p{ID_Continue}", "u")

// Test whether a given character code starts an identifier.

export function isIdentifierStart(code, astral) {
  // eslint-disable-next-line no-self-compare
  if (code !== code || (astral === false && code > 0xffff)) return false
  if (code < 65) return code === 36
  if (code < 91) return true
  if (code < 97) return code === 95
  if (code < 123) return true
  return nonASCIIidentifierStart.test(String.fromCodePoint(code))
}

// Test whether a given character is part of an identifier.

export function isIdentifierChar(code, astral) {
  // eslint-disable-next-line no-self-compare
  if (code !== code || (astral === false && code > 0xffff)) return false
  if (code < 48) return code === 36
  if (code < 58) return true
  if (code < 65) return false
  if (code < 91) return true
  if (code < 97) return code === 95
  if (code < 123) return true
  return nonASCIIidentifier.test(String.fromCodePoint(code))
}
