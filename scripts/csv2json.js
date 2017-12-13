// source: https://github.com/martindrapeau/csvjson-app/blob/master/js/csvjson/csv2json.js
(function () {
  var errorDetectingSeparator = "Could not detect the separator.",
    errorEmpty = "Please upload a file or type in something.",
    errorEmptyHeader = "Could not detect header. Ensure first row cotains your column headers.",
    separators = [",", ";", "\t"]
  
  function detectSeparator(csv) {
    var counts = {},
      sepMax
    separators.forEach(function (sep) {
      var re = new RegExp(sep, 'g')
      counts[sep] = (csv.match(re) || []).length
      sepMax = !sepMax || counts[sep] > counts[sepMax] ? sep : sepMax
    })
    return sepMax ? sepMax : undefined
  }

  // source: http://stackoverflow.com/a/1293163/2343
  function CSVtoArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",")
    var objPattern = new RegExp((
      // Delimiters
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // 有引號 ("") 的字串
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields
      "([^\\" + strDelimiter + "\\r\\n]*))"
    ), "gi")

    var aryData = [[]], aryMatches = null
    while (aryMatches = objPattern.exec(strData)) {
      var strMatchedDelimiter = aryMatches[1]   // 取得分隔符
      // 檢查分隔符是否有長度 (每列開頭) + 是否不是該分隔符 + 最後一列不是空的 (只有換行)
      // 如果為 ture 代表是某列之開頭，所以需為陣列新增一列
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter && aryMatches[0] !== "\r\n")
        aryData.push([])
        
      // 如果有引號的字串就使用引號，如沒有使用引號的字串則檢查是否為空欄位
      var strMatchedValue = aryMatches[2] ? 
        aryMatches[2].trim().replace(/\"\"/g, "\"") : 
          aryMatches[2] == "" ? aryMatches[2] : aryMatches[3]

      if (aryMatches[0] !== "\r\n")
        aryData[aryData.length - 1].push(strMatchedValue)
    }
    return (aryData)
  }

  /**
   * options:
   *  - transpose (轉置):  optional / true
   *  - hash:             optional / true
   *  - parseNumbers:     optional / true
   *  - separator (分隔):  optional / "," / ";" / "  " (Tab)
   */
  function convert(csv, options) {
    options || (options = {})
    if (csv.length == 0) throw errorEmpty

    var separator = options.separator || detectSeparator(csv)
    if (!separator) throw errorDetectingSeparator

    var ary = CSVtoArray(csv, separator)
    if (!ary) throw errorEmpty

    if (options.transpose) ary = zip(ary)

    var keys = ary.shift()
    if (keys.length == 0) throw errorEmptyHeader
    keys = keys.map(function (key) {
      return key.trim().trim('"')
    })

    var json = options.hash ? {} : []
    for (var i = 0; i < ary.length; i++) {
      var row = {}, hashKey
      for (var k = 0; k < keys.length; k++) {
        var value = ary[i][k].trim().trim('"')
        if (options.hash && k == 0)
          hashKey = value
        else {
          var number = value === "" ? NaN : value - 0
          row[keys[k]] = isNaN(number) || !options.parseNumbers ? value : number
        }
      }
      if (options.hash) json[hashKey] = row
      else json.push(row)
    }
    return json
  }
  
  this.csv2json = convert
}).call(this)

function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i]
    })
  })
}

// source: http://epeli.github.io/underscore.string/
String.prototype.trim = function (characters) {
  characters = defaultToWhiteSpace(characters)
  return this.replace(new RegExp(`^${characters}+|${characters}+$`, 'g'), "")
}