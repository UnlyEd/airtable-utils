for (const table of base.tables) {
    output.markdown(`# ${table.name} (${table.id})`);
    output.table(table.fields)
}
