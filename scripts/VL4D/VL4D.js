/**
 * VL4D - Vertical Lookup in 4 dimensions. (4 tables)
 *
 * TODO You should adapt this script to fit your own use case, by changing the "Configuration" section below.
 *
 * This script can be used to resolve a value from a "range" table, based on a value in a "source" table and update a field in the "destination" table.
 * Also, it resolves the source/destination record based on the trigger record, using a join.
 *
 * This script is similar to an Excel "VLOOKUP" function.
 * It is slightly different from the traditional VLOOKUP, because it can use up to 4 different tables (4-dimensions), instead of 2.
 * That's why we've named it "VL4D".
 *
 * Although you can use up to 4 dimensions, it's also possible to use the same table as "trigger", "source" and "destination".
 *
 * This script is usually used as an Automation, where something triggers the automation, which then runs the script itself.
 *
 * @see https://github.com/UnlyEd/airtable-utils/
 * @see https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1 Video example of Excel VLOOKUP
 */

// ------------------------------------------------ Configuration -----------------------------------------------

/**
 * Field names in the source table that will be used to lookup for a value.
 *
 * The fields configured below will be used as inputs, and their value will be used to lookup for a value in the range table.
 *
 * @example Will update the "referenceAccommodationRentCost" column (in the destination table),
 *  using "studentCityOfResidenceArea" value (in the source table)
 *  and looking up its associated "accommodationRentCost" value (in the range table).
 *  {
 *    sourceColumnNameToCompareWithRangeValue: 'studentCityOfResidenceArea',
 *    rangeColumnNameToFilterBy: null,
 *    rangeColumnNameWhereToLookupValue: 'accommodationRentCost',
 *    columnNameToUpdate: 'referenceAccommodationRentCost',
 *  }
 *
 * @property sourceColumnNameToCompareWithRangeValue - (Required) Name of the column within the Source table that'll be used to resolve the value to lookup.
 * @property rangeColumnValueToFilterBy - (Optional) This is an advanced feature to use when the range table contains several groups of values, and some of those values are identical across groups,
 *           in such case, using the filter to lookup only the values belonging to a specific group is necessary.
 *           If not set, will fallback to the sourceColumnNameToCompareWithRangeValue value, but will only be used if "rangeColumnNameToFilterBy" is set.
 * @property rangeColumnNameWhereToLookupValue - (Optional) Name of the column in the range table to compare to the sourceColumnNameToCompareWithRangeValue.
 *           If not set, then defaults to defaultRangeColumnNameWhereToLookupValue.
 * @property columnNameToUpdate - (Optional) Name of the column in the destination table to update with the resolved value.
 *           If not set, then defaults to a dynamic name based on the sourceColumnNameToCompareWithRangeValue.
 */
const sourceColumnNamesToLookup = [
  {
    sourceColumnNameToCompareWithRangeValue: 'shareOfSelfFinancedAccommodationRentCost',
  },
];

/**
 * Table where the Airtable trigger originates from.
 *
 * @example The column "cityOfResidenceArea" in "StudentProfile" table is updated and triggers an Airtable automation that runs this script.
 *  In this case, "StudentProfile" is the triggerTableName.
 */
const triggerTableName = 'StudentProfile';

/**
 * Table containing the fields for which we need to resolve the associated value, though a vLookup.
 *
 * This table can be the same as the triggerTableName, but they can also be different tables.
 *
 * @example The column "cityOfResidenceArea" in "StudentProfile" table is updated and triggers an Airtable automation that runs this script.
 *  We look at the value in the column "studentCityOfResidenceArea" in the "StudentImportanceScoring" table, and we use this value as comparison value for the vLookup.
 *  In this case, "StudentImportanceScoring" is the sourceTableName.
 */
const sourceTableName = 'StudentProfile';

/**
 * Join column used to match the trigger record with a source record.
 *
 * Optional, only necessary if the trigger and the source tables aren't identical.
 *
 * Must be the name of the column within the source table that references the source record.
 * Must not reference a relationship, but the value of the trigger record's ref directly. (e.g: 'bruna-meneses-18')
 */
const triggerRecordToSourceRecordJoinColumn = null;

/**
 * Table containing the value being looked for.
 *
 * @example The column "cityOfResidenceArea" in "StudentProfile" table is updated and triggers an Airtable automation that runs this script.
 *  We look at the value in the column "studentCityOfResidenceArea" in the "StudentImportanceScoring" table, and we use this value as comparison value for the vLookup.
 *  The value we're looking for is located in the "ReferenceBudgetByAreaOfResidence" table, in any of its column (the column name to use can be configured per-input).
 *  In this case, the table "ReferenceBudgetByAreaOfResidence" is the table containing all possible values for the "cityOfResidenceArea" column.
 */
const rangeTableName = 'CriteriaOptions';

/**
 * Column name compared to "sourceColumnNameToCompareWithRangeValue", used to find the associated value.
 *
 * @example The column "foodDeprivationFrequency" in "StudentProfile" table is updated and we want to find the value associated with the selected choice.
 *  In this case, the column "labelFR" in the table "CriteriaOptions" is the column containing all possible values for the selected "foodDeprivationFrequency" choice.
 *  We will compare all the "labelFR" values with the "foodDeprivationFrequency" choice to resolve which choice has been selected, and its associated value.
 */
const rangeColumnNameToCompareWithSourceValue = 'labelFR'; // E.g: labelFR

/**
 * Column name used to filter the values in the range table.
 *
 * This ensures we don't compare the values using a different list of options, even if several options in the range table have an identical value in the "rangeColumnNameToCompareWithSourceValue".
 * Important, because the range table might contain different groups of values that aren't related to each other.
 */
const rangeColumnNameToFilterBy = 'optionsGroupName'; // E.g: optionsGroupName

/**
 * Default column name in the range table where to lookup for the value from the source record.
 *
 * Can be overridden through "rangeColumnNameWhereToLookupValue" for each input.
 * The default value is useful when all inputs use the same column to resolve the lookup value.
 * The custom value is useful when some inputs use a different column to resolve the lookup value.
 */
const defaultRangeColumnNameWhereToLookupValue = 'value'; // E.g: value

/**
 * Name of the field that contains the value associated with the selected choice.
 * It's the value we're really interested about, and the one that'll be stored in "fieldNameToUpdate".
 */
const defaultDestinationColumnNameSuffix = '_value'; // E.g: _value || Value

/**
 * Name of the table that will store the resolved value.
 *
 * @example The field "foodDeprivationFrequency" in "StudentProfile" table is updated and we want to find the value associated with the selected choice.
 *  The resolved value will be stored in the column "foodDeprivationFrequency_Score" of the "StudentScoring" table.
 */
const destinationTableName = 'StudentImportanceScoring';

/**
 * Join column used to match the trigger record with a destination record.
 *
 * Optional, only necessary if the trigger and the destination tables aren't identical.
 *
 * Must be the name of the column within the destination table that references the destination record.
 * Must not reference a relationship, but the value of the trigger record's ref directly. (e.g: 'bruna-meneses-18')
 */
const triggerRecordToDestinationRecordJoinColumn = 'studentRef';

/**
 * For testing purpose, as fallback value when "inputConfig.triggerRecordId" is not set.
 *
 * Must be a valid ID from the "sourceTableName" table.
 * You can use a formula field with "RECORD_ID()" to know the internal Airtable record ids.
 *
 * XXX This is to improve DX, because Airtable automation developer experience is shitty, and they don't allow to run automation that are based on Inputs from the UI.
 *  (or at least, not always, and the current behavior is confusing as of March 2021)
 *  So, to test an automation from the UI, one needs to remove all configured Inputs to run the script manually.
 *  And then, when the script works properly, re-configure all Inputs.
 *  And do this every time.
 *  The alternative is to run the scripts through automation, but it's harder to debug that way (small editor, not possible to run code directly from editor, etc.)
 */
const testTriggerRecordId = 'recsFucDeugbcD0aw'; // 'bruna-meneses-18'

// ----------------------------------------------------------------------------------
// -------------------- Script (end of script's configuration) ----------------------
// ----------------------------------------------------------------------------------

/**
 * Finds a (left) record within the right table columns.
 *
 * Makes a join between records and compares the trigger record id with the join column value.
 *
 * @param record
 * @param rightTableRecords
 * @param rightJoinColumn
 * @return {*}
 */
const findRecordUsingRightJoin = (record, rightTableRecords, rightJoinColumn) => {
  for (let sourceRecordAbstract of rightTableRecords.records) {
    const sourceRecordRelatedTriggerRecordName = sourceRecordAbstract.getCellValue(rightJoinColumn);

    if (sourceRecordRelatedTriggerRecordName === record.name) {
      return rightTableRecords.getRecord(sourceRecordAbstract.id);
    }
  }
};

/**
 * Contains the patch that will be applied once all the source column to lookup have been resolved.
 *
 * @example If "fieldsMapping" contains a single object where "columnNameToUpdate" = 'foodDeprivationFrequency_Value', it will generate an object such as:
 *  { foodDeprivationFrequency_value: $valueInCriteriaOptions }
 */
const destinationRecordPatch = {};

/**
 * Resolve the updated record from the Airtable "input.config" API.
 *
 * "inputConfig.triggerRecordId" will always be set when the script is executed through an Airtable automation, but it won't when we execute it manually (during script testing).
 * This will show a red warning on Airtable until you configure a proper "Input variable" for the automation.
 */
const inputConfig = input.config();
const triggerRecordId = inputConfig.triggerRecordId || testTriggerRecordId; // Fallback to hardcoded test record id for better DX

// Table name containing the all records of the trigger table, used to retrieve the record that triggered the automation
const triggerTable = base.getTable(triggerTableName);
const triggerTableRecords = await triggerTable.selectRecordsAsync();

// Resolve the record that caused the automation to trigger (updated record in the trigger table)
// Shape is always { id: string; name: string }, where "name" correspond to the Airtable first column ("ref", in our case)
const triggerRecord = triggerTableRecords.getRecord(triggerRecordId);
console.log(`Record that triggered the automation (in "${triggerTableName}" table):`, triggerRecord);

// Table name containing values on which you want to run the lookup
const sourceTable = base.getTable(sourceTableName);
const sourceTableRecords = await sourceTable.selectRecordsAsync();
const sourceRecord = triggerTableName !== sourceTableName ? findRecordUsingRightJoin(triggerRecord, sourceTableRecords, triggerRecordToSourceRecordJoinColumn) : triggerRecord;

if (!sourceRecord) {
  throw new Error(`Couldn't find a match for the trigger record (in "${triggerTableName}" table) within the source table (in "${sourceTableName}" table), using "triggerRecord.name=${triggerRecord.name}" and "${triggerRecordToSourceRecordJoinColumn}" as join column. This most likely means there is no related record in the source table linked to the trigger record.`);
} else {
  console.log(`Source record (in "${sourceTableName}" table) found based on trigger record, using "${triggerRecordToSourceRecordJoinColumn}" as join column within the source table.`, sourceRecord);
}

// Table containing range records to search in
const rangeTable = base.getTable(rangeTableName);
const rangeTableRecords = await rangeTable.selectRecordsAsync();

// Destination table that will be updated
const destinationTable = base.getTable(destinationTableName);
const destinationTableRecords = await destinationTable.selectRecordsAsync();
// @ts-ignore Depending on the config, Airtable might warn about this condition be always evaluated to false/true and we don't want those noisy warnings
const destinationRecord = triggerTableName !== destinationTableName ? findRecordUsingRightJoin(triggerRecord, destinationTableRecords, triggerRecordToDestinationRecordJoinColumn) : triggerRecord;

if (!destinationRecord) {
  throw new Error(`Couldn't find a match for the trigger record (in "${triggerTableName}" table) within the destination table (in "${destinationTableName}" table), using "triggerRecord.name=${triggerRecord.name}" and "${triggerRecordToDestinationRecordJoinColumn}" as join column. This most likely means there is no related record in the destination table linked to the trigger record.`);
} else {
  console.log(`Destination record (in "${destinationTableName}" table) found based on trigger record, using "${triggerRecordToDestinationRecordJoinColumn}" as join column within the destination table.`, destinationRecord);
}

console.log(`Record id that will be updated in the destination table (${destinationTableName}): { id: "${destinationRecord.id}", name: "${destinationRecord.name}" }`);

for (let [i, fieldConfig] of sourceColumnNamesToLookup.entries()) {

  // Column name containing the value to compare, for which we want to lookup the associated value
  const sourceColumnNameToCompareWithRangeValue = fieldConfig.sourceColumnNameToCompareWithRangeValue;
  if (!sourceColumnNameToCompareWithRangeValue) {
    throw new Error(`The value "sourceColumnNameToCompareWithRangeValue" is not defined, although it is required. Please define it in "sourceColumnNamesToLookup".`);
  }

  // Prefix for logs, makes it easier to understand what field the logs are for
  const logPrefix = `[${i + 1}/${sourceColumnNamesToLookup.length}] (${sourceColumnNameToCompareWithRangeValue}) -`;

  // Name of the column that will store the resolved value
  const columnNameToUpdate = fieldConfig.columnNameToUpdate || `${sourceColumnNameToCompareWithRangeValue}${defaultDestinationColumnNameSuffix}`;

  // If set, applies an additional filter to only consider a subset of the range table
  const rangeColumnValueToFilterBy = fieldConfig.rangeColumnValueToFilterBy || sourceColumnNameToCompareWithRangeValue;

  // Column name containing the value we're looking for
  const rangeColumnNameWhereToLookupValue = fieldConfig.rangeColumnNameWhereToLookupValue || defaultRangeColumnNameWhereToLookupValue;

  // Value to look for
  const rawValueToLookup = sourceRecord.getCellValue(sourceColumnNameToCompareWithRangeValue);
  let valueToLookup = Array.isArray(rawValueToLookup) && rawValueToLookup.length > 0 ? rawValueToLookup[0] : (rawValueToLookup.hasOwnProperty('name') ? rawValueToLookup.name : rawValueToLookup);

  // The value to look for might be nullish and that won't be possible to resolve a value in such case
  if (valueToLookup) {
    let isFound = false;
    const testedRangeValues = []; // Stores all the values in the range table that have been tested, for debugging purposes

    for (let rangeRecord of rangeTableRecords.records) {
      const rangeValueToCompare = rangeRecord.getCellValue(rangeColumnNameToCompareWithSourceValue);
      testedRangeValues.push(rangeValueToCompare);

      // Enable filtering if a column name to filter by has been defined
      const isFilteringEnabled = !!rangeColumnNameToFilterBy;
      let rangeRecordValueToFilterBy;
      if (rangeColumnNameToFilterBy) {
        rangeRecordValueToFilterBy = rangeRecord.getCellValue(rangeColumnNameToFilterBy);
      }

      // Apply filter if it has been set and if the value matches. Ignore filter if it is not enabled.
      if (!isFilteringEnabled || (rangeColumnNameToFilterBy && rangeRecordValueToFilterBy === rangeColumnValueToFilterBy)) {
        // Column name which is the range to search in
        if (rangeValueToCompare === valueToLookup) {
          // Column name which value should be returned
          let returnValue = rangeRecord.getCellValue(rangeColumnNameWhereToLookupValue);

          console.log(`${logPrefix} Preparing patch for record "${destinationRecord.name}" in table "${destinationTableName}". \n\nFound "${columnNameToUpdate}=${returnValue}" value to update, using the source record "${sourceRecord.name}" in table "${sourceTableName}"`);

          // Stores the value to return in a temporary patch object that'll contain all changes to apply to the destination record
          destinationRecordPatch[columnNameToUpdate] = returnValue;
          isFound = true;
          break; // Stops the loop once a result has been found for the value to lookup (optimisation)
        }
      }
    }

    if (!isFound) {
      throw new Error(`${logPrefix} Could not resolve a value for the source value "${valueToLookup}" of the "${sourceRecord.name}" record in table "${sourceTableName}". \n\nThis most likely means the value doesn't exist in the range table "${rangeTableName}" and should be added. (maybe it was removed?) \n\nThe value in the destination record "${destinationRecord.name}" in table "${destinationTableName}" has not been updated. \n\n Compared value "${valueToLookup}" with: \n"${testedRangeValues.join('"\n"')}"`);
    }
  } else {
    console.warn(`${logPrefix} The selected value "${valueToLookup}" doesn't hold any value. This usually means the selected value is the "default/unselected" choice. The vlookup operation failed for this field.`, 'rawValueToLookup:', rawValueToLookup);
  }
}

console.log(`Patching record "${destinationRecord.name}" in table "${destinationTableName}", with:`, destinationRecordPatch);

// Patches the destination record, once all its properties to update have been resolved
await destinationTable.updateRecordAsync(destinationRecord.id, destinationRecordPatch);
