/**
 * @Name: Clear opportunity on request
 * @fieldName: Inspire Requests
 * @type: onChange
 * @description:
 */
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    g_form.clearValue('u_opportunity');
}