/**
 * @name:       Updates Opportunity On Account Changed
 * @UIType:     Desktop
 * @variable:   account
 * @type:       onChange
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue === '') {
        return;
    }
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('account', 'opportunity', 'sales_opportunity', 'name', 'sys_id');
    }
    window.GPAlignListCollectorTo.initOnChange(control, oldValue, newValue, isLoading);
    window.GPAlignListCollectorTo.fetchItems();
    window.GPAlignListCollectorTo.removeSelectedOptions();
    window.GPAlignListCollectorTo.showOptions();
}