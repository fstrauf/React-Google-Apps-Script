import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ getSheetData, runReplicate, checkForUpdates }) => {

  const [stateText, setStateText] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isChecking) {
      intervalId = setInterval(async () => {
        const updatetext = await checkForUpdates()
        console.log("🚀 ~ file: FormInput.tsx:15 ~ intervalId=setInterval ~ updatetext:", updatetext)
        setStateText(updatetext);
      }, 10000);
    }

    return () => clearInterval(intervalId);
  }, [checkForUpdates, isChecking]);

  const trainExpenses = async (event) => {
    event.preventDefault();

    const sheetData = await getSheetData('classified expenses', 'B2:B');
    setStateText('fetched sheet data')
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');
    console.log(
      '🚀 ~ file: FormInput.tsx:21 ~ handleSubmit ~ cleanedTrainedData:',
      cleanedSheetData
    );

    const res = await runReplicate(cleanedSheetData, 'saveTrainedData','trained_embeddings', 'AKfycby3MVHQKrMBzDVeWKxy77gdvuWhXa-m-LUMnvoqLHrcHcJg53FzEeDLd-GaXLSeA8zM');
    setStateText('data is being trained')
    setIsChecking(true);
    console.log('🚀 ~ file: FormInput.tsx:22 ~ handleSubmit ~ res:', res);

  };

  const classifyExpenses = async (event) => {
    event.preventDefault();

    const sheetData = await getSheetData('new expenses', 'A2:A');
    setStateText('fetched sheet data')
    const cleanedSheetData = sheetData.flat().filter((item) => item !== '');
    console.log(
      '🚀 ~ file: FormInput.tsx:21 ~ handleSubmit ~ cleanedTrainedData:',
      cleanedSheetData
    );

    const res = await runReplicate(cleanedSheetData,'classify','trained_embeddings', 'AKfycby3MVHQKrMBzDVeWKxy77gdvuWhXa-m-LUMnvoqLHrcHcJg53FzEeDLd-GaXLSeA8zM');
    setStateText('data is being classified')
    setIsChecking(true);

    console.log('🚀 ~ file: FormInput.tsx:22 ~ handleSubmit ~ res:', res);

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
