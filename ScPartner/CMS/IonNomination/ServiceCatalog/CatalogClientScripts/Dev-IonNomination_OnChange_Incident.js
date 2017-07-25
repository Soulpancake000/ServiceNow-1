/**
 * @name        Updates Incidents On Incident Changed
 * @UiType      onChange
 * @Variable    u_incidents
 */
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('assigned_to', 'u_incidents', 'incident', 'number', 'sys_id');
    }
    if (window.GPAlignListCollectorTo.firstLoad) {
        return;
    }
    window.GPAlignListCollectorTo.initOnChange(control, oldValue, newValue, isLoading);
    window.GPAlignListCollectorTo.showOptions();
    window.GPAlignListCollectorTo.firstLoad = true;
}