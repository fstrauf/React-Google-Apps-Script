import React, { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const ConfigScreen = () => {
  const [configProp, setConfigProp] = useState({
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
      setConfigProp(fetchedData);
    };

    fetchConfigData();
  }, []);

  const generateClientID = () => {
    // Generate a unique identifier for the clientID
    const uniqueID = 'ID_' + Date.now();
    setConfigProp((prevState) => ({ ...prevState, clientID: uniqueID }));
    return uniqueID;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfigProp((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedConfig = { ...configProp };

    if (!updatedConfig.clientID || updatedConfig.clientID === '') {
      updatedConfig.clientID = generateClientID();
    }

    console.log(
      '🚀 ~ file: ConfigScreen.jsx:39 ~ handleSubmit ~ updatedConfig:',
      updatedConfig
    );

    await serverFunctions.updateConfig(updatedConfig);
  };

  return (
    <form className='p-2 flex flex-col gap-4 text-sm' onSubmit={handleSubmit}>
      <h1 className="text-2xl my-5 text-center">Configuration</h1>

      <div className='flex flex-col'>
        <label>Client ID:</label>
        <p className='text-xs'>(we'll generate this)</p>
        <input
          type="text"
          name="clientID"
          value={configProp.clientID}
          readOnly
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-300"
        />
      </div>

      <div>
        <label>AppScript URL:</label>
        <p className='text-xs'>(This is the Deployment ID of your deployed Google Script)</p>
        <input
          type="text"
          name="appScriptURL"
          value={configProp.appScriptURL}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label>New Expenses Sheet:</label>
        <p className='text-xs'>(Name of the sheet with your new expenses)</p>
        <input
          type="text"
          name="newExpensesSheet"
          value={configProp.newExpensesSheet}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label>New Expenses Range:</label>
        <p className='text-xs'>(Range with just the descriptions of your new expenses)</p>
        <input
          type="text"
          name="newExpensesRange"
          value={configProp.newExpensesRange}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label>Categorised Expenses Sheet:</label>
        <p className='text-xs'>(Name of the sheet with your categorised expenses)</p>
        <input
          type="text"
          name="classifiedExpensesSheet"
          value={configProp.classifiedExpensesSheet}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label>Classified Expenses Range:</label>
        <p className='text-xs'>(Range with just the descriptions of your categorised expenses)</p>
        <input
          type="text"
          name="classifiedExpensesRange"
          value={configProp.classifiedExpensesRange}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button className="mt-5 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" type="submit">Submit</button>
    </form>
  );
};

export default ConfigScreen;
