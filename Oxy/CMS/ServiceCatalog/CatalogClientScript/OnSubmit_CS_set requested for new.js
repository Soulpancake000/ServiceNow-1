/**
 * Passes the value for requested for into the shopping cart instead of the defauld value for opened by
 * @Name: CS_set requested for new
 * @AppliesTo: Variable Set
 * @UIType: Both
 * @Type: OnSubmit
 * @VariableSet: User Information w/o New User
 */
function onSubmit() {
    if (window) {
        var ga = new GlideAjax('OXYCartUtils');
        ga.addParam('sysparm_name', 'setRequestedFor');
        ga.addParam('sysparm_userid', g_user.userID);
        ga.addParam('sysparm_requested_for', g_form.getValue('requested_for'));
        ga.addParam('sysparm_manager', g_form.getValue('manager'));
        //ga.getXML(parseResponse);
        ga.getXMLWait();
        ga.getAnswer();
        g_form.setReadOnly('requested_for', true);
        g_form.setReadOnly('manager', true);
    }
}