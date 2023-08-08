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
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl my-5">Configuration</h1>

      <div>
        <label>Client ID:</label>
        <input
          type="text"
          name="clientID"
          value={configProp.clientID}
          readOnly
        />
      </div>

      <div>
        <label>AppScript URL:</label>
        <input
          type="text"
          name="appScriptURL"
          value={configProp.appScriptURL}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>New Expenses Sheet:</label>
        <input
          type="text"
          name="newExpensesSheet"
          value={configProp.newExpensesSheet}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>New Expenses Range:</label>
        <input
          type="text"
          name="newExpensesRange"
          value={configProp.newExpensesRange}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Classified Expenses Sheet:</label>
        <input
          type="text"
          name="classifiedExpensesSheet"
          value={configProp.classifiedExpensesSheet}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Classified Expenses Range:</label>
        <input
          type="text"
          name="classifiedExpensesRange"
          value={configProp.classifiedExpensesRange}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ConfigScreen;
