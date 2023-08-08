import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  getSheetData,
  runReplicate,
  checkForUpdates,
  serverFunctions,
}) => {
  const [stateText, setStateText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [configInfo, setConfigInfo] = useState({
    clientID: '',
    appScriptURL: '',
    newExpensesRange: '',
    newExpensesSheet: '',
    classifiedExpensesRange: '',
    classifiedExpensesSheet: '',
  });

  useEffect(() => {
    const fetchConfigData = async () => {
      const fetchedData = await serverFunctions.getConfig();
      setConfigInfo(fetchedData);
    };

    fetchConfigData();

    let intervalId;
    if (isChecking) {
      intervalId = setInterval(async () => {
        const updatetext = await checkForUpdates();
        setStateText(updatetext);
      }, 10000);
    }

    return () => clearInterval(intervalId);
  }, [checkForUpdates, isChecking]);

  const trainExpenses = async (event) => {
    event.preventDefault();

    const configData = await serverFunctions.getConfig();
    console.log(
      '🚀 ~ file: FormInput.tsx:25 ~ trainExpenses ~ configData:',
      configData
    );

    if (
      !configData?.classifiedExpensesSheet ||
      !configData?.classifiedExpensesRange
    ) {
      setStateText('Please configure first');
      return null;
    }

    const sheetData = await getSheetData(
      configData?.classifiedExpensesSheet,
      configData?.classifiedExpensesRange
    );
    setStateText('fetched sheet data');
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');

    const res = await runReplicate(
      cleanedSheetData,
      'saveTrainedData',
      configData?.clientID,
      configData?.appScriptURL
    );
    console.log('🚀 ~ file: FormInput.tsx:37 ~ trainExpenses ~ res:', res);
    setStateText('data is being trained');
    setIsChecking(true);
  };

  const classifyExpenses = async (event) => {
    event.preventDefault();

    const configData = await serverFunctions.getConfig();
    // console.log("🚀 ~ file: FormInput.tsx:26 ~ trainExpenses ~ fetchedData:", fetchedData)
    if (
      !configData?.classifiedExpensesSheet ||
      !configData?.classifiedExpensesRange
    ) {
      setStateText('Please configure first');
      return null;
    }

    const fetchedData = await serverFunctions.getConfig();
    console.log(
      '🚀 ~ file: FormInput.tsx:26 ~ trainExpenses ~ fetchedData:',
      fetchedData
    );

    const sheetData = await getSheetData(
      configData?.newExpensesSheet,
      configData?.newExpensesRange
    );
    setStateText('fetched sheet data');
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');

    const res = await runReplicate(
      cleanedSheetData,
      'classify',
      configData?.clientID,
      configData?.appScriptURL
    );
    console.log('🚀 ~ file: FormInput.tsx:61 ~ classifyExpenses ~ res:', res);
    setStateText('data is being classified');
    setIsChecking(true);
  };

  return (
    <div className="flex flex-col gap-5 w-full mx-auto items-center">
      <div className="flex flex-col gap-3">
        <h2 className="font-bold">Step 1.: Training.</h2>
        <p className="text-xs">
          Add your categorised expenses to a sheet, so we can train our model
          with them (you will probably only need this every month or so).
        </p>
        <p className="text-xs font-bold">Trainging From:</p>
        <p className="text-xs font-light">
          {configInfo?.classifiedExpensesSheet} -{' '}
          {configInfo?.classifiedExpensesRange}
        </p>
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded"
          type="button"
          onClick={trainExpenses}
        >
          Train Expenses
        </button>
        <h2 className="font-bold">Step 2.: Categorising.</h2>
        <p className="text-xs">
          Once trained, categorise new incoming expenses.
        </p>
        <p className="text-xs font-bold">Categorising: </p>
        <p className="text-xs font-light">
          {configInfo?.newExpensesSheet} - {configInfo?.newExpensesRange}
        </p>

        <button
          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
          type="button"
          onClick={classifyExpenses}
        >
          Categorise Expenses
        </button>
      </div>
      <div>{stateText}</div>
    </div>
  );
};

export default FormInput;

FormInput.propTypes = {
  submitNewSheet: PropTypes.func,
};
