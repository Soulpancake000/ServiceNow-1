/**
 * @name:       Updates Opportunity On Opportunity Changed
 * @UIType:     Desktop
 * @variable:   account
 * @type:       onChange
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('account', 'opportunity', 'sales_opportunity', 'name', 'sys_id');
    }
    if (window.GPAlignListCollectorTo.firstLoad) {
        return;
    }
    window.GPAlignListCollectorTo.initOnChange(control, oldValue, newValue, isLoading);
    window.GPAlignListCollectorTo.showOptions();
    window.GPAlignListCollectorTo.firstLoad = true;
}