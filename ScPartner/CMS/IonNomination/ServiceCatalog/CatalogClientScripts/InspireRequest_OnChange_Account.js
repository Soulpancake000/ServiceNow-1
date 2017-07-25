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
    //UI Script - GPAlignListCollectorTo
    var helper = new GPAlignListCollectorTo('account', 'opportunity', 'sales_opportunity', 'name', 'sys_id');
    helper.initOnChange(control, oldValue, newValue, isLoading);
    helper.fetchItems();
    helper.removeSelectedOptions();
    helper.showOptions();
}