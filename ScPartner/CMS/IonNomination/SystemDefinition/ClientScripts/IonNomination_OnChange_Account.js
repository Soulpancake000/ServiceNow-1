/**
 * Client Script
 * Clear Opportunities on Account Change.
 * Clears and display the Opportunities field based on the Account field
 * @table x_snc_ion_nomination
 * @uiType All
 * @type onChange
 * @fieldName Account
 */
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading) {
        g_form.setVisible('u_opportunity', oldValue !== '');
        return;
    }

    g_form.setVisible('u_opportunity', newValue !== '');
    g_form.hideFieldMsg('u_opportunity', true);
    if (g_form.getValue('u_opportunity')) {
        g_form.clearValue('u_opportunity');
        if (newValue !== '') {
            g_form.showFieldMsg('u_opportunity', 'Cleared', 'info');
        }
    }
}