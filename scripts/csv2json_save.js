var fileText, csvObjects, jsonText
var csvToJsonBtn = document.getElementById("csvToJsonBtn"),
csvFileInput = document.getElementById("csvFileInput"),
fileCharset = document.getElementById("charset"),
fileTranspose = document.getElementById("transpose"),
fileHash = document.getElementById("hash"),
fileParseNumbers = document.getElementById("parseNumbers"),
fileSeparator = document.getElementById("separator")

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
  console.log(csvObjects)
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

csvFileInput.onchange = function() {
  getFile(this.files, fileCharset)
}

csvToJsonBtn.onclick = function() {
  if (csvFileInput.value) {
    uploadFile(csvFileInput.files)
  } else {
    throw "Please upload CSV file"
  }
}