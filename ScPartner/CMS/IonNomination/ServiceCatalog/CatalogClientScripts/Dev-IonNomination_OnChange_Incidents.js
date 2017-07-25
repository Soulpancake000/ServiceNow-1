function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }

    var helper = (new GPAlignListCollectorTo('assigned_to', 'u_incidents', 'incident', 'number', 'sys_id'));
    if (window.gp_alignListCollector.firstLoad) {
        return;
    }
    helper.initOnChange(control, oldValue, newValue, isLoading);
    helper.showOptions();
    window.gp_alignListCollector.firstLoad = true;
}