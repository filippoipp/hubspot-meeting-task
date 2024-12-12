const Action = require('./models/Action'); 

const disallowedValues = [
  '[not provided]',
  'placeholder',
  '[[unknown]]',
  'not set',
  'not provided',
  'unknown',
  'undefined',
  'n/a'
];

const filterNullValuesFromObject = object =>
  Object
    .fromEntries(
      Object
        .entries(object)
        .filter(([_, v]) =>
          v !== null &&
          v !== '' &&
          typeof v !== 'undefined' &&
          (typeof v !== 'string' || !disallowedValues.includes(v.toLowerCase()) || !v.toLowerCase().includes('!$record'))));

const normalizePropertyName = key => key.toLowerCase().replace(/__c$/, '').replace(/^_+|_+$/g, '').replace(/_+/g, '_');

const goal = async actions => {
  if (!actions || actions.length === 0) {
    console.log('No actions to process');
    return;
  }

  try {
    const validActions = actions.map(action => {
      const processedAction = {
        ...action,
        actionDate: action.actionDate instanceof Date 
          ? action.actionDate 
          : new Date(action.actionDate)
      };

      for (const key of Object.keys(processedAction)) {
        if (processedAction[key] === undefined || processedAction[key] === null) {
          delete processedAction[key];
        }
      }

      return processedAction;
    });

    const result = await Action.insertMany(validActions, { 
      ordered: false,
      rawResult: true 
    });

    console.log(`Inserted ${result.insertedCount} actions out of ${validActions.length}`);

    if (result.writeErrors && result.writeErrors.length > 0) {
      console.error('Errors during insertion:', result.writeErrors);
    }

    return result;

  } catch (error) {
    console.error('Error processing actions:', error);

    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', Object.values(error.errors).map(e => e.message));
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      console.error('Duplicate key error - some actions might already exist');
    }

    throw error;
  }
};

module.exports = {
  filterNullValuesFromObject,
  normalizePropertyName,
  goal
};