for (const table of base.tables) {
    output.markdown(`# ${table.name} (${table.id}) [*Lien*](${table.url})`);
    output.markdown(`###### ${table.description}`);
    output.table(table.fields);
}
