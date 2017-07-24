function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }
    var helper = (new GPAlignListCollectorTo('assigned_to', 'u_incidents', 'incident', 'number', 'sys_id'));
    helper.initOnChange(control, oldValue, newValue, isLoading);
    helper.showOptions();
}