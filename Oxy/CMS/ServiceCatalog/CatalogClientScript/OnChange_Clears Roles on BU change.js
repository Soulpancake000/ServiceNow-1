/**
 * @Name: Clears Roles on BU change
 * @AppliesTo: Variable Set
 * @UIType: Both
 * @Type: OnChange
 * @VariableSet: ATG Locations
 * @VariableName: business_unit
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue == '') {
        return;
    }
    g_form.clearValue('role');
    if (!window) {
        g_form.setValue("location_test_list", "");
        var gListLocationTest = g_list.get('location_test_list');
        gListLocationTest.reset();
        gListLocationTest.setQuery('sys_id=NORESULTS');
    }
}