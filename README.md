<a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" align="right" height="20" alt="Unly logo" title="Unly logo" /></a>

Airtable utilities
===

This repo is mostly about Airtable utilities to centralise formulas and such.

## Apps (blocks)

- `List all fields of all tables <Scripting>`: List all tables and all fields of the current base. (recommended for all your bases, really useful!)

## Scripts (automations)

Those are generic scripts meant to be re-used by anyone.

- `vLookup3d`: This script can be used to resolve a value from a "range" table, based on a value in a "source" table and update a field in the "destination" table.

## Formulas:

Those are generic formulas meant to be re-used by anyone.

- `count-selected-items`: Count the items in a multiple select or multiple collaborator field
    - `TODO_REPLACE_WITH_YOUR_STRING_PREFIX`: Prefix (string)
    - `TODO_REPLACE_WITH_YOUR_ROLLUP_FIELD`: Rollup field to use (string)
        **Rollup field needs to use `& ''` to be converted to string, before concatenation happens**
- `count-selected-items`: Count the items in a multiple select or multiple collaborator field
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `count-unique-relationship-records`: Count the number of unique linked records
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `currency-integer-to-dollar-number`
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (integer) (decimals aren't supported)
- `currency-integer-to-dollar-string`
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (integer) (decimals aren't supported)
- `currency-integer-to-euro-string`
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (integer) (decimals aren't supported)
- `currency-string-to-dollar`
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `currency-string-to-euro` **⚠️ (Doesn't work, WIP, use `currency-integer-to-euro-string` as an alternative)**
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `find-attachment-filename`: Find the filename from an Attachment field (not its url)
- `find-attachment-url`: Find the url of an Attachment field
    - `TODO_REPLACE_WITH_YOUR_ATTACHMENT_FIELD_NAME`: Attachment column name you want to process (string)
    - Updated on 2020 October 24 to handle filenames that contains parenthesis a bit better
- `find-word-at-position`: Find any word based on its position
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
    - `TODO_REPLACE_WITH_DESIRED_POSITION`: Position you're seeking (integer)
- `has-duplicated-text`: Checks whether text field contains duplicated text value 
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
    - `TODO_REPLACE_WITH_DUPLICATED_TEXT_TO_FIND`: Text you want to check for duplicates (string)
- `has-many-selected-items`: Count the items in a multiple select or multiple collaborator field and returns whether there are more than 1 match
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `rollup-extract-attachment-url`: Extract the url from a Rollup Attachment field (rollup fields on attachment return an array, this formula returns the asset's url)
- `slug`: Slugify a string by removing all special chars to make sure it's URL-compliant and doesn't contain any non-ascii chars
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `slug-compact`: Identical to `slug`, but one-liner (for those who prefer it)
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)

## Examples

Those are more-or-less generic examples meant to be re-used by anyone.

- `prefix-label-lang-from-rollup`: Shows how to concatenate a prefix with a rollup field (this isn't a Rollup field, but uses one)
- `rollup-ref`: Mixes both Rollup with slug to build a string using a prefix (rollup) and slugify another column
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `rollup-ref-labelFR`: Identical to `rollup-ref` with hardcoded column name `labelFR` for my own convenience
- `select-labelFR-or-labelEN`: Shows how to use either `labelFR` or `labelEN` based on whether the first one is empty

## Resources

Interesting resources and inspirations:
- [7 fantastic time-saving Airtable substitution formulas](https://blog.airtable.com/time-saving-substitution-formulas/)
- [The top 10 time-saving Airtable date formulas](https://blog.airtable.com/the-top-10-time-saving-airtable-date-formulas/)
- [Formula field reference](https://support.airtable.com/hc/en-us/articles/203255215)
- [Formatting numbers using regular expressions (currency)](https://community.airtable.com/t/formatting-numbers-using-regular-expressions/42876)
- [Number and Currency ‘Pretty-Print’ Routines (currency)](https://community.airtable.com/t/number-and-currency-pretty-print-routines/10807)

---

# License

[MIT](LICENSE)

---

# Vulnerability disclosure

[See our policy](https://github.com/UnlyEd/Unly).

---

# Contributors and maintainers

This project is being maintained by:
- [Unly] Ambroise Dhenain ([Vadorequest](https://github.com/vadorequest)) **(active)**

---

# **[ABOUT UNLY]** <a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" height="40" align="right" alt="Unly logo" title="Unly logo" /></a>

> [Unly](https://unly.org) is a socially responsible company, fighting inequality and facilitating access to higher education.
> Unly is committed to making education more inclusive, through responsible funding for students.

We provide technological solutions to help students find the necessary funding for their studies.

We proudly participate in many TechForGood initiatives. To support and learn more about our actions to make education accessible, visit :
- https://twitter.com/UnlyEd
- https://www.facebook.com/UnlyEd/
- https://www.linkedin.com/company/unly
- [Interested to work with us?](https://jobs.zenploy.io/unly/about)

Tech tips and tricks from our CTO on our [Medium page](https://medium.com/unly-org/tech/home)!

#TECHFORGOOD #EDUCATIONFORALL
