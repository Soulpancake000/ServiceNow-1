/**
 * @name:       Updates Opportunity On Account Changed
 * @UIType:     Desktop
 * @variable:   account
 * @type:       onChange
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }
    //UI Script GPAlignListCollectorTo
    var helper = (new GPAlignListCollectorTo('account', 'opportunity', 'sales_opportunity', 'name', 'sys_id'));
    if (window.gp_alignListCollector.firstLoad) {
        return;
    }
    helper.initOnChange(control, oldValue, newValue, isLoading);
    helper.showOptions();
    window.gp_alignListCollector.firstLoad = true;
}

