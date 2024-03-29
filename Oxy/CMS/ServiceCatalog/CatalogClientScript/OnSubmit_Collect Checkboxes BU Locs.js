/**
 * @Name: onSubmit Collect Checkboxes BU Locs
 * @AppliesTo: Variable Set
 * @UIType: Both
 * @Type: OnSubmit
 * @VariableSet: ATG Locations
 */
function onSubmit() {
    if (window) {
        var chkBoxGroups = '';
        var LocationNames = '';
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox" && inputs[i].id == "BUlocations") {
                if (inputs[i].checked) {
                    chkBoxGroups += inputs[i].value + ',';
                    LocationNames += inputs[i].name + ',';
                }
            }
        }
        if (chkBoxGroups != '') {
            chkBoxGroups = chkBoxGroups.substring(0, chkBoxGroups.length - 1);
            LocationNames = LocationNames.substring(0, LocationNames.length - 1);
        }
        else {
            //Abort the submission
            g_form.submitted = false;
            alert("You must select at least one location");
            return false;
        }

        g_form.setValue('location_values', chkBoxGroups);
        g_form.setValue('location_names', LocationNames);
    }
    if (!window) {
        var locationUnits = g_form.getValue('location_test_list');
        var locationUnitsDisplay = g_form.getDisplayValue('location_test_list');
        g_form.setValue("location_test_list", "");
        g_list.get('location_test_list').reset();

        g_form.setValue('location_values', locationUnits);
        g_form.setValue('location_names', locationUnitsDisplay);
    }
}