/**
 * @name: Clear incidents/opportunity on request
 * @fieldName: Ion Nomination
 * @type: onChange
 * @description:
 */
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    g_form.clearValue('u_incident');
}