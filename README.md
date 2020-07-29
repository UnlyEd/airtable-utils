<a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" align="right" height="20" alt="Unly logo" title="Unly logo" /></a>

Airtable utilities
===

This repo is mostly about Airtable utilities to centralise formulas and such.

Formulas:
- `count-selected-items`: Count the items in a multiple select or multiple collaborator field
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
- `count-unique-relationship-records`: Count the number of unique linked records
    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`: Column name you want to process (string)
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


    - `TODO_REPLACE_WITH_YOUR_COLUMN_NAME`


Interesting resources and inspirations:
- [https://blog.airtable.com/time-saving-substitution-formulas/](https://blog.airtable.com/time-saving-substitution-formulas/)

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
