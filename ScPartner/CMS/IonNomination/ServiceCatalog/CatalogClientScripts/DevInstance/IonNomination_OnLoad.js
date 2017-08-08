function onLoad() {
    //Type appropriate comment here, and begin script below
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('assigned_to', 'u_incidents', 'incident', 'number', 'sys_id');
    }
    window.GPAlignListCollectorTo.hideSearch();
}