/**
 * @Name: Clears Location On Load
 * @AppliesTo: Variable Set
 * @UIType: Both
 * @Type: OnLoad
 * @VariableSet: ATG Locations
 */
function onLoad() {
    if (!window) {
        var gListLocationTest = g_list.get('location_test_list');
        g_form.setValue("location_test_list", "");
        gListLocationTest.reset();
        gListLocationTest.setQuery('sys_id=NORESULTS');
    }
}