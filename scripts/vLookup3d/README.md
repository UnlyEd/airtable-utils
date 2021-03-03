# vLookup3d

## Trigger

![image](https://user-images.githubusercontent.com/3807458/109720016-cd5c4d80-7ba9-11eb-94e3-d6b73bf6e82c.png)

Watch ALL fields, or manually select all fields to watch.
Watching all is easier to setup, but will trigger the script more often.

## Actions

1. Run a script

### Script

[Script](./script.js)

#### Input variables

![image](https://user-images.githubusercontent.com/3807458/109731471-9a22ba00-7bbb-11eb-86d9-b68a8253a6dc.png)

## Example

The script contains default values and comments that refer to this use-case example.

The goal of the `vLookup3d` script in this example is to automatically:
- copy the value in `CriteriaOptions.value`
- into the user's record in `StudentScoring.foodDeprivationFrequency_value`
- based on the selected value in `StudentBudget.foodDeprivationFrequency`
- when any field in the `StudentBudget` is updated

The lookup will compare the selected value in `StudentBudget.foodDeprivationFrequency` with the range values in `CriteriaOptions` that belong to the `optionsGroupName='foodDeprivationFrequency'`.
Only one record (student) will be updated at a time when the automation runs.

The `StudentBudget` is the **source** table.
![image](https://user-images.githubusercontent.com/3807458/109876500-2becfe80-7c72-11eb-8d58-bbead4a946c9.png)

The `CriteriaOptions` is the **range** table.
![image](https://user-images.githubusercontent.com/3807458/109875991-7f128180-7c71-11eb-8b9c-731683811f39.png)

The `StudentScoring` is the **destination** table.
![image](https://user-images.githubusercontent.com/3807458/109876021-8a65ad00-7c71-11eb-8633-47a070c07467.png)
