/*
  Simple pseudocode for a JSON parser similar to open-source implementations.
  parseJSON(text):
    i = 0
    parseValue():
      skipWhitespace()
      if text[i] == '"' -> return parseString()
      if text[i] is digit or '-' -> return parseNumber()
      if text[i] == '{' -> return parseObject()
      if text[i] == '[' -> return parseArray()
      if text startsWith 'true' -> i+=4; return true
      if text startsWith 'false' -> i+=5; return false
      if text startsWith 'null' -> i+=4; return null
      otherwise throw error
    parseObject():
      obj = {}
      consume '{'
      skipWhitespace()
      if next char == '}' -> consume and return obj
      loop:
        key = parseString()
        skipWhitespace()
        expect ':'
        value = parseValue()
        obj[key] = value
        skipWhitespace()
        if next char == '}' -> break
        expect ','
      consume '}'
      return obj
    parseArray():
      arr = []
      consume '['
      skipWhitespace()
      if next char == ']' -> consume and return arr
      loop:
        value = parseValue()
        arr.push(value)
        skipWhitespace()
        if next char == ']' -> break
        expect ','
      consume ']'
      return arr
    parseString(), parseNumber() handle escapes and digits
*/
