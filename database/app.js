// Reading the file using default
//cmd :  node app.js
// fs npm package
const paramTrue = "x"
const paramFalse = ""
const fs = require("fs");
csv = fs.readFileSync("2024_data.csv")

// Convert the data to String and
// split it in an array
var arraytmp = csv.toString().split("\r");
var array =[]
for(let i=0; i<arraytmp.length; i++)
{
    array.push(arraytmp[i].replace("\n",""))
}


// All the rows of the CSV will be
// converted to JSON objects which
// will be added to result in an array


let result = [];

// The array[0] contains all the
// header columns so we store them
// in headers array
let headers = array[0].split(";")

// Since headers are separated, we
// need to traverse remaining n-1 rows.
for (let i = 1; i < array.length; i++) {
    let obj = {}

// Create an empty object to later add
// values of the current row to it
// Declare string str as current array
// value to change the delimiter and
// store the generated string in a new
// string s
    let str = array[i]
    let s = ''

// By Default, we get the comma separated
// values of a cell in quotes " " so we
// use flag to keep track of quotes and
// split the string accordingly
// If we encounter opening quote (")
// then we keep commas as it is otherwise
// we replace them with pipe |
// We keep adding the characters we
// traverse to a String s
    let flag = 0
    for (let ch of str) {
        if (ch === "'" && flag === 0) {
            flag = 1

        }
        else if (ch === "'" && flag == 1) flag = 0
        if (ch === ';' && flag === 0) ch = '|'
        if (ch !== "'") s += ch


    }


// Split the string using pipe delimiter |
// and store the values in a properties array
    let propertiestmp = s.split("|")

    let properties = []
    for (let a=0; a<propertiestmp.length;a++)
    {
        let parse = propertiestmp[a]

        if(a===0)
        {
            parse = parseInt(propertiestmp[a])
        }
        if(a===1 || a===2 || a===4)
        {

            parse = propertiestmp[a]
        }

        if(a===3 && propertiestmp[a]!=="")
        {

            parse = true
        }

        properties.push(parse)
    }

// For each header, if the value contains
// multiple comma separated data, then we
// store it in the form of array otherwise
// directly the value is stored
    for (let j in headers) {
        obj[headers[j]] = properties[j]
    }


// Add the generated object to our
// result array
    result.push(obj)
}
console.log(result)

// Convert the resultant array to json and
// generate the JSON output file.
let json = JSON.stringify(result);
fs.writeFileSync('data.json', json);