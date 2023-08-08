import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ getSheetData, runReplicate, checkForUpdates, serverFunctions }) => {

  const [stateText, setStateText] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isChecking) {
      intervalId = setInterval(async () => {
        const updatetext = await checkForUpdates()
        setStateText(updatetext);
      }, 10000);
    }

    return () => clearInterval(intervalId);
  }, [checkForUpdates, isChecking]);

  const trainExpenses = async (event) => {
    event.preventDefault();

    const configData = await serverFunctions.getConfig();
    console.log("🚀 ~ file: FormInput.tsx:25 ~ trainExpenses ~ configData:", configData)
    // console.log("🚀 ~ file: FormInput.tsx:26 ~ trainExpenses ~ fetchedData:", fetchedData)
    if(!configData?.classifiedExpensesSheet || !configData?.classifiedExpensesRange){
      setStateText('Please configure first')
      return null
    }

    const sheetData = await getSheetData(configData?.classifiedExpensesSheet, configData?.classifiedExpensesRange);
    setStateText('fetched sheet data')
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');

    const res = await runReplicate(cleanedSheetData, 'saveTrainedData',configData?.clientID, configData?.appScriptURL);
    console.log("🚀 ~ file: FormInput.tsx:37 ~ trainExpenses ~ res:", res)
    setStateText('data is being trained')
    setIsChecking(true);

  };

  const classifyExpenses = async (event) => {
    event.preventDefault();

    const configData = await serverFunctions.getConfig();
    // console.log("🚀 ~ file: FormInput.tsx:26 ~ trainExpenses ~ fetchedData:", fetchedData)
    if(!configData?.classifiedExpensesSheet || !configData?.classifiedExpensesRange){
      setStateText('Please configure first')
      return null
    }

    const fetchedData = await serverFunctions.getConfig();
    console.log("🚀 ~ file: FormInput.tsx:26 ~ trainExpenses ~ fetchedData:", fetchedData)

    const sheetData = await getSheetData(configData?.newExpensesSheet, configData?.newExpensesRange);
    setStateText('fetched sheet data')
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');

    const res = await runReplicate(cleanedSheetData,'classify',configData?.clientID, configData?.appScriptURL);
    console.log("🚀 ~ file: FormInput.tsx:61 ~ classifyExpenses ~ res:", res)
    setStateText('data is being classified')
    setIsChecking(true);
  };

  return (
    <div className="flex flex-col gap-5 w-full mx-auto items-center">
      <div className="flex gap-3">
        {' '}
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded"
          type="button"
          onClick={trainExpenses}
        >
          Train Expenses
        </button>
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded"
          type="button"
          onClick={classifyExpenses}
        >
          Classify Expenses
        </button>
      </div>
      <div>
        {stateText}
      </div>
   </div>
  );
};

export default FormInput;

FormInput.propTypes = {
  submitNewSheet: PropTypes.func,
};
