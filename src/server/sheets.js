function getSecret() {

    let token = ScriptApp.getOAuthToken();

    var url ='https://secretmanager.googleapis.com/v1/projects/579095970614/secrets/replicate_API_KEY/versions/2:access'
    var headers = {
        'Authorization': 'Bearer ' + token
    };

    var response = UrlFetchApp.fetch(url, { headers: headers });
    var secretData = JSON.parse(response.getContentText());
    var decodedSecret = Utilities.newBlob(Utilities.base64Decode(secretData.payload.data)).getDataAsString().replace(/\\n/g, '\n');

    return decodedSecret;  // This is your API key.
}

const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

var scriptProperties = PropertiesService.getScriptProperties();

// const props = PropertiesService.getScriptProperties().getProperties();

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const getSheetData = (sheetName, range) => {
  var trainedExpenseSheet =
    SpreadsheetApp.getActive().getSheetByName(sheetName);
  var range = trainedExpenseSheet.getRange(range);
  var values = range.getValues();
  return values;
};

export const addSheet = (sheetTitle) => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = (sheetIndex) => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = (sheetName) => {
  SpreadsheetApp.getActive().getSheetByName(sheetName).activate();
  return getSheetsData();
};

export const doPost = (e) => {
  var message = JSON.parse(e.postData.contents);

  const data = message?.data || {}
  const status = message?.status || ''

  if (status === 'saveTrainedData') {
    scriptProperties.setProperty('stateText', 'training completed');
  }
  
  if (status === 'classify') {
    scriptProperties.setProperty('stateText', 'classification completed');
  }

  var newExpensesSheet =
    SpreadsheetApp.getActive().getSheetByName('new expenses');
  var classifiedExpensesSheet = SpreadsheetApp.getActive().getSheetByName(
    'classified expenses'
  );

  // Loop through the data
  for (var i = 0; i < data.length; i++) {
    // Find the categoryIndex in column A of the 'classified expenses' sheet
    var textFinder = classifiedExpensesSheet.createTextFinder(
      (data[i].categoryIndex + 1).toString()
    );
    var cell = textFinder.findNext();

    // If categoryIndex is found, get the corresponding values from column B and C
    if (cell) {
      var row = cell.getRow();
      // var valueB = classifiedExpensesSheet.getRange(row, 2).getValue(); // 2 is column B
      var valueC = classifiedExpensesSheet.getRange(row, 3).getValue(); // 3 is column C

      // Append the values to column B and C of the 'new expenses' sheet
      newExpensesSheet.getRange(i + 2, 2).setValue(valueC);
      // newExpensesSheet.getRange(i + 2, 3).setValue(valueC);
    }
  }
};

// In your Google Apps Script
export const checkForUpdates = () => {
  return scriptProperties.getProperty('stateText');
};

export const doGet = (e) => {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(['get test']);
};

export const createPrediction = (training_data, apiMode, customerName, sheetApi) => {
  scriptProperties.setProperty('stateText', 'training still running (this can take a couple of minutes)');
  var apiKey = getSecret();
  var url = 'https://api.replicate.com/v1/predictions';
  var data = {
    version: 'b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305',
    input: {
      text_batch: JSON.stringify(training_data),
    },
    // webhook: `https://125f-2406-2d40-40de-8200-216e-7992-fafd-a11e.ngrok-free.app/${apiMode}?customerName=${customerName}&sheetApi=${sheetApi}`,
    webhook: `https://pythonhandler-yxxxtrqkpa-ts.a.run.app/${apiMode}?customerName=${customerName}&sheetApi=${sheetApi}`,
    webhook_events_filter: ['completed'],
  };
  var options = {
    method: 'post',
    headers: {
      Authorization: 'Token ' + apiKey,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(data),
  };

  var response = UrlFetchApp.fetch(url, options);
  return response.getContentText();
};

export const updateConfig = (props) => {
  const spreadsheet = SpreadsheetApp.getActive();
  let configSheet = spreadsheet.getSheetByName('_config');

  // If the _config sheet doesn't exist, create it
  if (!configSheet) {
    configSheet = spreadsheet.insertSheet('_config');
  }

  if (configSheet.getLastRow() >= 3) {
    configSheet.getRange(3, 1, configSheet.getLastRow() - 2, 2).clear();
}

  // Add a warning message to the first row
  configSheet.getRange(1, 1).setValue("Don't touch");

  // Predefined order for the keys
  const orderedKeys = [
    'clientID',
    'appScriptURL',
    'newExpensesRange',
    'newExpensesSheet',
    'classifiedExpensesRange',
    'classifiedExpensesSheet'
  ];

  for (let i = 0; i < orderedKeys.length; i++) {
    const key = orderedKeys[i];
    const value = props[key];

    configSheet.getRange(i + 3, 1).setValue(key);  // Write the key to column A
    configSheet.getRange(i + 3, 2).setValue(value);  // Write the value to column B
  }

  return props;
};

export const getConfig = () => {
  const configSheet = SpreadsheetApp.getActive().getSheetByName('_config');
  if (!configSheet) {
    return {}; // Return an empty object if the _config sheet doesn't exist
  }

  const range = configSheet.getRange(3, 1, 6, 2); // Assuming you have 6 configuration properties
  const values = range.getValues();

  const configData = {};
  values.forEach(row => {
    const key = row[0];
    const value = row[1];
    configData[key] = value;
  });

  return configData;
};



