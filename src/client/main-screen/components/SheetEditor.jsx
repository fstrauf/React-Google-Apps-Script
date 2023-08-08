import React from 'react';
import FormInput from './FormInput';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';

const SheetEditor = () => {
  const getSheetData = async (sheetName, range) => {
    let res = {};
    try {
      res = await serverFunctions.getSheetData(sheetName, range);
      // setSheetData(trainedData);
    } catch (error) {
      alert(error);
    }
    return res;
  };

  const runReplicate = async (trainedData, apiMode, customerName, sheetApi) => {
    console.log("🚀 ~ file: SheetEditor.jsx:20 ~ runReplicate ~ customerName:", customerName)
    let res;
    try {
      res = await serverFunctions.createPrediction(
        trainedData,
        apiMode,
        customerName,
        sheetApi
      );
    } catch (error) {
      alert(error);
      console.log(
        '🚀 ~ file: SheetEditor.jsx:40 ~ runReplicate ~ error:',
        error
      );
    }
    return res;
  };

  const checkForUpdates = () => {
    return serverFunctions.checkForUpdates();
  };

  return (
    <div className='p-2'>
      <h1 className="text-2xl my-5 text-center">Expense Sorter</h1>

      <FormInput
        getSheetData={getSheetData}
        runReplicate={runReplicate}
        checkForUpdates={checkForUpdates}
        serverFunctions={serverFunctions}
      />
    </div>
  );
};

export default SheetEditor;
