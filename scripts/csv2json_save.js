var fileText, csvObjects, jsonText
var convertBtn = document.getElementById("convertBtn"),
    downloadBtn = document.getElementById("downloadBtn"),
    csvFileupload = document.getElementById("csvFileupload"),
    fileCharset = document.getElementById("charset"),
    fileTranspose = document.getElementById("transpose"),
    fileHash = document.getElementById("hash"),
    fileParseNumbers = document.getElementById("parseNumbers"),
    fileSeparator = document.getElementById("separator")
    inputCSV = document.getElementById("csv"),
    outputJSON = document.getElementById("json")

function getFile(files, charset) {
  var reader = new FileReader()
  if (charset) {
    reader.readAsText(files[0], charset)
  } else {
    reader.readAsText(files[0])
  }
  reader.onload = function(event) {
    fileText = event.target.result
    processData(fileText)
  }
  reader.onerror = function(err) {
    reject(err)
  }
}

function processData(csvText) {
  csvObjects = csv2json(csvText, {
    transpose: fileTranspose.checked,
    hash: fileHash.checked,
    parseNumbers: fileParseNumbers.checked,
    separator: fileSeparator.value
  })
  jsonText = JSON.stringify(csvObjects, null, 2)
  inputCSV.value = csvText
  outputJSON.value = jsonText
}

function saveJson(name) {
  var a = document.createElement("a")
  var data = jsonText
  var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data)
  a.href = url
  a.download = name
  a.click()
}

function uploadFile(files) {
  getFile(files, fileCharset)
  saveJson('data.json')
}

csvFileupload.onchange = function() {
  getFile(this.files, fileCharset)
}

convertBtn.onclick = function() {
  if (csvFileupload.value) {
    getFile(csvFileupload.files, fileCharset)
  } else {
    throw "Please upload CSV file"
  }
}

downloadBtn.onclick = function() {
  if (csvFileupload.value) {
    saveJson('data.json')
  } else {
    throw "Please upload CSV file"
  }
}