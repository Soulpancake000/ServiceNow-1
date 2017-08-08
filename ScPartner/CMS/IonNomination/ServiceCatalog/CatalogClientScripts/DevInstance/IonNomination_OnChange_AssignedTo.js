/**
 * @name        Updates Incidents On Assigned Changed
 * @UiType      onChange
 * @Variable    assigned_to
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue === '') {
        return;
    }
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('assigned_to', 'u_incidents', 'incident', 'number', 'sys_id');
    }
    window.GPAlignListCollectorTo.initOnChange(control, oldValue, newValue, isLoading);
    window.GPAlignListCollectorTo.fetchItems();
    window.GPAlignListCollectorTo.removeSelectedOptions();
    window.GPAlignListCollectorTo.showOptions();
}