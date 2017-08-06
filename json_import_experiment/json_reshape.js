//REQUIREMENTS
// (!) JSON fed in as named object literal, as in "jsObj" in:
// const jsObj = {"horrible": {"smell": 2, "taste": 4, "sound": 3},
//                "unpleasant": {"smell": 1, "taste": 2, "sound": 5}};
// In other words, add a const ___ = at the start and a semicolon
// at the end

// (!) true and false values out-coded as 1 and 0

// (!) null values outcoded as "NA"
//
///////////////////////////////////////////////////////////////////
//LAYOUT OPTIONS
// 1. Array of objects with named variables
//   [{"id": 1, "var1": 6, "var2": 1, "var3": "Immediate"},
//    {"id": 2, "var1": 9, "var2": 1, "var3": "Delayed"},
//    {"id": 3, "var1": 2, "var2": 0, "var3": "Immediate"}]

// 2. Object with column names object and values object
//   {"col_names": ["id", "smell", "taste", "sound", "action"],
//    "row_values": [[1, 6, 1, "Immediate"],
//                   [2, 9, 1, "Delayed"],
//                   [3, 2, 0, "Immediate"]]}

// 3. Object with keys valued as object containing var names and values
//   {"horrible": {"smell": 2, "taste": 4, "sound": 3, "Action": "Immediate"},
//    "unpleasant": {"smell": 1, "taste": 2, "sound": 5, "Action": "Delayed"}}

//4. Array of objects with each key valued as object with var names and values
//   [{"horrible": {"smell": 2, "taste": 4, "sound": 3, "Action": "Immediate"},
//    {"unpleasant": {"smell": 1, "taste": 2, "sound": 5, "Action": "Delayed"}]

//5. CSV The Heck with It!
//  "id","smell","taste","Action"
//  "horrible",6,1,"Immediate"
//  "unpleasant",2,9,1,"Delayed"

//6. R source

//7. Python script. This generates a dict of lists

///////////////////////////////////////////////////////////////////

// reshape(from, to)
//  convert to nested arrays, with [i][0] holding id, and an array of column names
//  don't worry about memory or performance

function jsonReshape(jsonIn, layoutIn, layoutOut){
  // Convert input to layout #1
  if (layoutIn == 3) {
    const json_Standard = jsonStandardize3(jsonIn);
  }
  else if (layoutIn == 1) {
    const json_Standard = jsonIn;
  }
  
  // Convert to layout = layoutOut
  if (layoutOut == 1) {
    printAsJson1(jsonStandardize3(jsonIn));
  }
  if (layoutOut == 6) {
    console.log(printR(jsonStandardize3(jsonIn)));
  }
  if (layoutOut == 7) {
    console.log(printPython(jsonStandardize3(jsonIn)));
  }
  return true;
}

function jsonStandardize3(json) {
  let result_jsonStandardize3 = [];
  const target = json; //change to shallow copy
  const ids = Object.keys(target);//this will be first variable
  result_jsonStandardize3.push(ids.map(function(k) {
    let obj = {};
    obj.uniqueId = k;
    for (let v in target[k]){
      obj[v] = target[k][v];
    }
    return obj;
  }));
  return result_jsonStandardize3;
}

function printAsJson1(stndrd){
  download("output.json", JSON.stringify(stndrd));
  return true;
}

function printR(json_lo1){
  //Make this:
  //matty <- data.frame(id = character(3), max1 = numeric(3), max2 = numeric(3))
  //matty$id <- c("horrible", "terrible", "hopeless")
  //matty$max1 <- c(1000, 997, 765)
  //matty$max2 <- c(1000, 997, 765)
  const dfName = "mosteller_youtz";
  const types = {"number": "numeric","string":"character", "boolean":"logical"};
  result_printR = "setwd(" + wd + ")\n";
  result_printR += dfName + " <- data.frame(";
  result_printR += Object.keys(json_lo1[0]).map(function(k) { return  k + " = "  + types[typeof(json_lo1[0][k])] + "(" + json_lo1.length + ")" }).join(", ") + ")\n";
  result_printR += Object.keys(json_lo1[0]).map(function(v) { return dfName + "$" + v + " <- c(" + json_lo1.map(function(r) { if (types[typeof(r[v])] == "character") { return "'" + r[v] + "'"; } else { return r[v];} }).join(", ") + ")\n" });
  return result_printR;
  //TODO don't base type on just first value
}

function printPython(json_lo1){
  const dictName = "mosteller_youtz";
  const types = {"number": {"pythonic_types": ["int", "float"], conversion: function(val){ return(val !== null || val !== null) ? val : "NaN"; }},
  "string": {"pythonic_types": ["string"], conversion: function(val){ return (val !== null) ? "'" + val + "'" : ''; }},
  "boolean": {"pythonic_types":["logical"], "conversion": function(val){ return val === true ? "True" : "False"; }}};
  result_printPython = dictName + " = {" + Object.keys(json_lo1[0]).map(function(k) { return "'" + k + "'" + ": [" + json_lo1.map(function(v){ return types[typeof(v[k])].conversion(v[k]); }) + "]"; }).join(", ") ; + "}\n";
  result_printPython += "import pickle\n";
  result_printPython += 'pickle.dump( mosteller_youtz, open( "mosteller_youtz.pickle", "wb" ) )\n';
  //ms = pickle.load( open( "mosteller_youtz.pickle", "rb" ) )"
  //this worked in console: Object.keys(mosteller_youtz2[0]).map(function(k) { return k + ": [" + mosteller_youtz2.map(function(v){ return types[typeof(v[k])].conversion(v[k]); }) + "]"; }).join(", ") ;
  return result_printPython;
  //TODO don't base type on just first value
}

function printAsJson6(stndrd){
  download("output.R", printR(stndrd));
  return true;
}

function download(filename, text) {
  let element = document.createElement('a');
	element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

//from SO answer by:
