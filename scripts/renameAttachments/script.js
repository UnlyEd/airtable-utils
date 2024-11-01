/**
 * Renames attachments in a specified record based on a field containing the new file name.
 *
 * This script expects a table with an attachment field and a name field. It will rename
 * each attachment file in a record using the specified naming convention, appending an index
 * if there are multiple attachments.
 *
 * Inputs:
 * - `tableName`: The name of the Airtable table containing the record.
 * - `attachmentFieldName`: The name of the attachment field to rename.
 * - `nameFieldName`: The name of the field containing the base name for the new file names.
 * - `recordId`: The ID of the record that contains the attachments to rename.
 *
 * Expected behavior:
 * - Renames each file in the attachment field using the name in `nameFieldName` as a base.
 * - Appends a unique index if there are multiple attachments.
 * - Updates the attachment field in the record with the new file names.
 *
 * @author Ambroise Dhenain <dna.pc.pro@gmail.com>
 * @see https://github.com/UnlyEd/airtable-utils
 */

let tableName = "TODO_REPLACE_WITH_YOUR_ATTACHMENT_TABLE_NAME"; // Replace with your table name
let attachmentFieldName = "TODO_REPLACE_WITH_YOUR_ATTACHMENT_FIELD_NAME"; // Replace with your attachment field name
let fieldOfNewAttachmentName = 'TODO_REPLACE_WITH_YOUR_NEW_ATTACHMENT_NAME'; // Replace with the field containing the new file name

// Select the table and fetch the current record ID provided by the previous step
let table = base.getTable(tableName);
let recordId = await input.config().recordId;

// Check if the record ID is valid
if (recordId) {
  let record = await table.selectRecordAsync(recordId);

  if (record) {
    let attachments = record.getCellValue(attachmentFieldName);
    let newFileName = record.getCellValue(fieldOfNewAttachmentName);
    if (newFileName.includes('.')) {
      newFileName = newFileName.substring(0, newFileName.lastIndexOf('.'));
    }

    if (attachments && attachments.length > 0) {
      let updatedAttachments = [];
      const oldNames = [];

      // Rename each file
      for (let i = 0; i < attachments.length; i++) {
        let attachment = attachments[i];
        oldNames.push(attachment.filename);

        // Use the "nameFieldName" field for each file name, adding an index if necessary
        let newName = attachments.length > 1
          ? `${newFileName} (${i + 1})${getFileExtension(attachment.filename)}`
          : `${newFileName}${getFileExtension(attachment.filename)}`;

        // Add the renamed attachment to the updated list
        updatedAttachments.push({
          url: attachment.url,
          filename: newName
        });
      }

      // Update the record with the renamed attachments
      await table.updateRecordAsync(recordId, {
        [attachmentFieldName]: updatedAttachments
      });

      console.log('Renaming completed for the current record.', recordId, updatedAttachments, oldNames);
    } else {
      console.log(`No attachments found in the record "${recordId}".`, record);
    }
  } else {
    console.log(`Record with ID "${recordId}" not found in table "${tableName}".`);
  }
} else {
  console.log('Record ID not provided.');
}

/**
 * Utility function to get the file extension from a filename.
 *
 * @param {string} filename - The name of the file.
 * @returns {string} - The file extension (e.g., '.jpg').
 */
function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}
