#How to Use `json_reshape` Module

##Requirements
- JSON must be fed in as named object literal, as in `jsObj` in:
`const jsObj = {"horrible": {"smell": 2, "taste": 4, "sound": 3},
                "unpleasant": {"smell": 1, "taste": 2, "sound": 5}};`

In other words, just add a `const yourName =` at the start and a semicolon at the end.

- `true` and `false` values will be recoded as 1 and 0.

R uses `TRUE` and `FALSE`; Python `True` and `False`. Plus, 1/0 coding will be needed for model-building, anyway.

- Eventually, `null` values might be recoded as `"NA"`. For now, `null` is `null`.


##Options
When ES6 modules are supported, import module with: `import json_reshape as jr`

To go from one JSON layout to another, use function:

`jsonReshape(jsonIn, LayIn, LayOut)` 

where `jsonIn` is name of the JavaScript object containing your data, `LayIn` is the layout of `jsonIn`, and `layOut` is the intended layout of the output.

###Dataset Layouts
1. Array of objects where keys refer to variable names:
`[{"id": 1, "var1": 6, "var2": 1, "var3": "Immediate"},{"id": 2, "var1": 9, "var2": 1, "var3": "Delayed"},{"id": 3, "var1": 2, "var2": 0, "var3": "Immediate"}]`

2. Object with a column names object and a values object"
'{"col_names": ["id", "smell", "taste", "sound", "action"], "row_values": [[1, 6, 1, "Immediate"],[2, 9, 1, "Delayed"],[3, 2, 0, "Immediate"]]}`

3. Object with keys valued as object containing var names and values
`{"horrible": {"smell": 2, "taste": 4, "sound": 3, "Action": "Immediate"},"unpleasant": {"smell": 1, "taste": 2, "sound": 5, "Action": "Delayed"}}`

4. Array of objects with each key valued as object with var names and values
`[{"horrible": {"smell": 2, "taste": 4, "sound": 3, "Action": "Immediate"},{"unpleasant": {"smell": 1, "taste": 2, "sound": 5, "Action": "Delayed"}]`

5. CSV (The Heck with JSON!)
`"id","var1","var2","var3"
1,6,1,"Immediate"
2,9,1,"Delayed"`

6. R source (If R is the destination, why not go straight there?)
`json_import <- data.frame(id = numeric(2), smell = numeric(2), taste = numeric(2), action = character(2))`
`json_import$id <- c("horrible", "unpleasant")...`

7. Python script (dict of lists)

##Examples

Let's say our data looks like this:

`var myData = {"Always": {"Q1": 99.6, "Median": 99.7, "Q3": 99.8, "IQR": 0.3},"Almost always": {"Q1": 89.7, "Median": 91.7, "Q3": 95.2, "IQR": 5.5}, "Certain": {"Q1": 98.7, "Median": 99.6, "Q3": 99.8, "IQR": 1.1}, "Almost certain": {"Q1": 87.5, "Median": 90.2, "Q3": 95.0, "IQR": 7.5}, "Very frequent": {"Q1": 75.3, "Median": 82.6, "Q3": 89.7, "IQR": 14.5}, "Frequent": {"Q1": 60.0, "Median": 72.2, "Q3": 75.3, "IQR": 15.2}};`

If we want to work with this dataset as an R dataframe, then we can generate an R-friendly **CSV file** by using:

`jsonReshape(myData, 3, 5)`

The `3` indicates the layout of our input data and the `5` the desired format of our output, CSV in this case. The output looks like NOT YET READY:

Or we can generate an **R script** with commands to call up a dataframe containing our data:

`jsonReshape(myData, 3, 6)`

The output would be:

`setwd('/Users/matty/Documents/Toy-Datasets/json_import_experiment')
mosteller_youtz <- data.frame(uniqueId = character(6), Q1 = numeric(6), Median = numeric(6), Q3 = numeric(6), IQR = numeric(6))
mosteller_youtz$uniqueId <- c('Always', 'Almost always', 'Certain', 'Almost certain', 'Very frequent', 'Frequent')
mosteller_youtz$Q1 <- c(99.6, 89.7, 98.7, 87.5, 75.3, 67.2)
mosteller_youtz$Median <- c(99.7, 91.7, 99.6, 90.2, 82.6, 72.2)
...`

Suppose we still want JSON, but a different layout. Then we can use:

`jsonReshape(myData, 3, 1)`

Here, the output would be:

`[{"uniqueId":"Always","Q1":99.6,"Median":99.7,"Q3":99.8,"IQR":0.3},{"uniqueId":"Almost always","Q1":89.7,"Median":91.7,"Q3":95.2,"IQR":5.5},{"uniqueId":"Certain","Q1":98.7,"Median":99.6,"Q3":99.8,"IQR":1.1},{"uniqueId":"Almost certain","Q1":87.5,"Median":90.2,"Q3":95,"IQR":7.5},{"uniqueId":"Very frequent","Q1":75.3,"Median":82.6,"Q3":89.7,"IQR":14.5},{"uniqueId":"Frequent","Q1":60,"Median":72.2,"Q3":75.3,"IQR":15.2}]`

Finally, to generate the dataset as a **Python script**:

`jsonReshape(myData, 3, 7)`

This yields:

`myData = {'uniqueId': ['Always','Almost always','Certain','Almost certain','Very frequent','Frequent','Not infrequent','Infrequent','Very infrequent','Very high probability','High probability','Moderate probability','Low probability','Very low probability','Very likely','Likely','Unlikely','Very unlikely','Very probable','Probable','Improbable','Very improbable','Very often','Often','More often than not','As often as not','Less often than not','Not often','Not very often','Possible','Impossible','High chance','Better than even chance','Even chance','Less than even chance','Poor chance','Low chance','Liable to happen','Might happen','Usually','Unusually','Sometimes','Once in a while','Not unreasonable','Occasionally','Now and then','Seldom','Very seldom','Rarely','Very rarely','Almost never','Never'], 'Q1': [99.6,89.7,98.7,87.5,75.3,60,32.7,10.1,3.6,89.8,77.1,40.1,7.8,1.9,80.1,62.6,9.8,2.7,81.5,64.7,7.6,1.5,77.5,65,57.1,49.8,34.8,10.3,5.3,7.6,0.2,77.5,53.3,49.7,39.6,8.4,5,59.8,19.9,65.6,9.9,17.5,9.9,23.5,12.5,9.8,7.4,3.2,3.6,1.2,1.2,0.1],...}`

> Written with [StackEdit](https://stackedit.io/).