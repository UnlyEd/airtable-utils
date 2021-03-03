/**
 * This script can be used to resolve a value from a "range" table, based on a value in a "source" table and update a field in the "destination" table.
 *
 * This script is similar to an Excel "VLOOKUP" function.
 * It is slightly different from the traditional VLOOKUP, because it can use up to 3 different tables (3-dimensions), instead of 2.
 * That's why we've named it "vLookup3d".
 *
 * Although you can use up to 3 dimensions (3 different tables), it's also possible to use the same table as "source" and "destination".
 *
 * This script is usually used as an Automation, when a field(s) is/are updated.
 *
 * @see https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1 Video example of Excel VLOOKUP
 */

/**
 * Field names in the source table that will be used to lookup for a value.
 *
 * The fields configured below will be used as inputs, and their value will be used to lookup for a value in the range table.
 *
 * Only the property "inputSourceColumnName" is required.
 * The property "rangeColumnNameToFilterBy" is optional and will defaut to the value of "inputSourceColumnName".
 *
 * @example { inputSourceColumnName: 'userType', rangeColumnNameToFilterBy: 'userTypes' }
 */
const sourceColumnNamesToLookup = [
  {
    inputSourceColumnName: 'foodDeprivationFrequency',
  },
];

/**
 * Table containing the fields for which we need to resolve the associated value.
 *
 * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
 *  In this case, "StudentBudget" is the sourceTableName.
 */
const sourceTableName = 'StudentBudget';

/**
 * Table containing all choices and values for the inputSourceColumnName.
 *
 * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
 *  In this case, the table "CriteriaOptions" is the table containing all possible values for the "foodDeprivationFrequency" field.
 */
const rangeTableName = 'CriteriaOptions';

/**
 * Column name compared to "inputSourceColumnName", used to find the associated value.
 *
 * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
 *  In this case, the column "labelFR" in the table "CriteriaOptions" is the column containing all possible values for the selected "foodDeprivationFrequency" choice.
 *  We will compare all the "labelFR" values with the "foodDeprivationFrequency" choice to resolve which choice has been selected, and its associated value.
 */
const rangeColumnNameToCompare = 'labelFR';

/**
 * Column name used to filter the values in the range table.
 *
 * This ensures we don't compare the values using a different list of options, even if several options in the range table have an identical value in the "rangeColumnNameToCompare".
 * Important, because the range table might contain different groups of values that aren't related to each other.
 */
const rangeColumnNameToFilterBy = 'groupName';

/**
 * Name of the field that contains the value associated with the selected choice.
 * It's the value we're really interested about, and the one that'll be stored in "fieldNameToUpdate".
 */
const fieldNameValueToLookup = 'value';

/**
 * Name of the table that will store the resolved value.
 *
 * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
 *  The resolved value will be stored in the column "foodDeprivationFrequency_Score" of the "StudentScoring" table.
 */
const destinationTableName = 'StudentScoring';

/**
 * Column name (in the "source" table) to use to join the source table with the destination table.
 */
const sourceTableJoinColumn = 'student';

/**
 * Column name (in the "destination" table) to use to join the source table with the destination table.
 *
 * If not specified, uses the same column name as the source table.
 */
const destinationTableJoinColumn = '' || sourceTableJoinColumn;

/**
 * For testing purpose, as fallback value when "inputConfig.updatedRecordIdFromSourceTable" is not set.
 *
 * Must be a valid ID from the "sourceTableName" table.
 * You can use a formula with "RECORD_ID()" to know the internal Airtable record ids.
 *
 * XXX This is to improve DX, because Airtable automation developer experience is shitty, and they don't allow to run automation that are based on Inputs from the UI.
 *  (or at least, not always, and the current behavior is confusing as of March 2021)
 *  So, to test an automation from the UI, one needs to remove all configured Inputs to run the script manually.
 *  And then, when the script works properly, re-configure all Inputs.
 *  And do this every time.
 *  The alternative is to run the scripts through automation, but it's harder to debug that way (small editor, not possible to run code directly from editor, etc.)
 */
const testRecordId = 'rec2GJVL3XqcFrT5c';

// ----------------------------------------------------------------------------------
// -------------------- Script (end of script's configuration) ----------------------
// ----------------------------------------------------------------------------------

/**
 * Contains the patch that will be applied once all the source column to lookup have been resolved.
 *
 * @example If "fieldsMapping" contains a single object where "fieldNameToUpdate" = 'foodDeprivationFrequency_Value', it will generate an object such as:
 *  { foodDeprivationFrequency_value: $valueInCriteriaOptions }
 */
const destinationRecordPatch = {};

/**
 * Resolve the updated record from the Airtable "input.config" API.
 *
 * "inputConfig.updatedRecordIdFromSourceTable" will always be set when the script is executed through an Airtable automation, but it won't when we execute it manually (during script testing).
 */
const inputConfig = input.config();
const updatedRecordIdFromSourceTable = inputConfig.updatedRecordIdFromSourceTable || testRecordId;

// Table name which contains values on which you want to run the vlookup
const sourceTable = base.getTable(sourceTableName);
const sourceTableRecords = await sourceTable.selectRecordsAsync();

// Table which contains range to search in
const lookupTable = base.getTable(rangeTableName);
const lookupRangeRecords = await lookupTable.selectRecordsAsync();

// Destination table that will be updated
const destinationTable = base.getTable(destinationTableName);
const destinationTableRecords = await destinationTable.selectRecordsAsync();

// Resolve the record that caused the automation to trigger (updated record in the source table)
const updatedRecordFromSourceTable = sourceTableRecords.getRecord(updatedRecordIdFromSourceTable);
console.log(`Updated record (trigger): "${updatedRecordFromSourceTable.id}" ("${updatedRecordFromSourceTable.name}")`);

// Find the updated record (shape: { name: string, id: string }) where "name" is actually the "ref"
const recordInSourceTable = updatedRecordFromSourceTable.getCellValue(sourceTableJoinColumn)[0];
const recordRefInSourceTable = recordInSourceTable.name;

/**
 * Airtable record of the record that will be updated.
 * Contains the id/name properties only.
 *
 * @example { id: string; name: string } where "name" contains the primary field value
 */
const destinationRecordToUpdate = destinationTableRecords.records.filter((recordInDestinationTable) => {
  const jointColumn = recordInDestinationTable.getCellValue(destinationTableJoinColumn)[0];
  return jointColumn.name === recordRefInSourceTable;
})[0];

console.log(`Record id that will be updated in the destination table: "${destinationRecordToUpdate.id}" ("${destinationRecordToUpdate.name}")`);

for (let [i, fieldConfig] of sourceColumnNamesToLookup.entries()) {

  /**
   * Column name containing the choice selected by the user, for which we want to lookup the associated value.
   *
   * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
   *  In this case, "foodDeprivationFrequency" is the inputSourceColumnName.
   */
  const inputSourceColumnName = fieldConfig.inputSourceColumnName;

  /**
   * Name of the column that will store the resolved value.
   *
   * Automatically resolved based on the "fieldNameValueToLookup".
   *
   * @example The field "foodDeprivationFrequency" in "StudentBudget" table is updated and we want to find the value associated with the selected choice.
   *  The resolved value will be stored in the column "foodDeprivationFrequency_Score" of the "StudentScoring" table.
   */
  const fieldNameToUpdate = `${fieldConfig.inputSourceColumnName}_${fieldNameValueToLookup}`;

  /**
   * Value of the groupName to use in the range table.
   *
   * If unspecified, uses the same value as the inputSourceColumnName.
   *
   * @example When comparing the "foodDeprivationFrequency" value in "StudentBudget" table, the value might be "Never".
   *  This "Never" value might be used by other groups too, and we must limit our lookup search to the records that are within the "foodDeprivationFrequency" group.
   */
  const groupNameValueInRangeTable = fieldConfig.groupNameValueInRangeTable || inputSourceColumnName;

  // Prefix for logs, makes it easier to understand what field the logs are for
  const logPrefix = `[${i + 1}/${sourceColumnNamesToLookup.length}] (${inputSourceColumnName}) -`;

  // Column name which has the values you want to look up
  const valueToLookup = updatedRecordFromSourceTable.getCellValue(inputSourceColumnName);

  // The selected choice might be null-ish and that won't be possible to resolve a value in such case
  if (valueToLookup) {
    let isFound = false; // TODO opti cut loop
    const testedRangeValues = []; // Stores all the values in the range table that have been tested, for debugging purposes

    for (let rangeRecord of lookupRangeRecords.records) {
      const rangeRecordGroupName = rangeRecord.getCellValue(rangeColumnNameToFilterBy);
      const rangeValueToCompare = rangeRecord.getCellValue(rangeColumnNameToCompare);
      testedRangeValues.push(rangeValueToCompare);

      // If the group name value matches the "groupNameValueInRangeTable" configured for this field
      // then it means we're comparing the value to another value of the same group
      // If not, we don't perform the comparison because we'd be comparing a value from one group with a record belonging to another group and that won't make sense
      if (rangeRecordGroupName === groupNameValueInRangeTable) {
        // Column name which is the range to search in
        if (rangeValueToCompare === valueToLookup.name) {
          // Column name which value should be returned
          let returnValue = rangeRecord.getCellValue(fieldNameValueToLookup);

          console.log(`${logPrefix} Preparing patch for record "${destinationRecordToUpdate.name}" in table "${destinationTableName}". \n\nFound "${fieldNameToUpdate}=${returnValue}" value to update, using the source record "${updatedRecordFromSourceTable.name}" in table "${sourceTableName}"`);

          // Stores the value to return in a temporary patch object that'll contain all changes to apply to the destination record
          destinationRecordPatch[fieldNameToUpdate] = returnValue;
          isFound = true;
        }
      }
    }

    if (!isFound) {
      throw new Error(`${logPrefix} Could not resolve a value for the source value "${valueToLookup.name}" of the "${updatedRecordFromSourceTable.name}" record in table "${sourceTableName}". \n\nThis most likely means the value doesn't exist in the range table "${rangeTableName}" and should be added. (maybe it was removed?) \n\nThe value in the destination record "${destinationRecordToUpdate.name}" in table "${destinationTableName}" has not been updated. \n\n Compared value "${valueToLookup.name}" with: \n"${testedRangeValues.join('"\n"')}"`);
    }
  } else {
    console.log(`${logPrefix} The selected value "${valueToLookup}" doesn't hold any value. This usually means the selected value is the "default/unselected" choice. The vlookup operation failed for this field.`);
  }
}

console.log(`Patching record "${destinationRecordToUpdate.name}" in table "${destinationTableName}", with: `, destinationRecordPatch);

// Patches the destination record, once all its properties to update have been resolved
await destinationTable.updateRecordAsync(destinationRecordToUpdate.id, destinationRecordPatch);
