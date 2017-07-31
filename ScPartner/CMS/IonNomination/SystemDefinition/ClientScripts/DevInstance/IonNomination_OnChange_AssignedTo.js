function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading) {
        g_form.setVisible('u_incidents', oldValue !== '');
        return;
    }

    g_form.setVisible('u_incidents', newValue !== '');
    g_form.hideFieldMsg('u_incidents', true);
    if (g_form.getValue('u_incidents')) {
        g_form.clearValue('u_incidents');
        if (newValue !== '') {
            g_form.showFieldMsg('u_incidents', 'Incidents Cleared', 'info');
        }
    }
}