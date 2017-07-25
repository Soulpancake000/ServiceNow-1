function onLoad() {
    //Type appropriate comment here, and begin script below
    if (typeof window.GPAlignListCollectorTo !== "object") {
        window.GPAlignListCollectorTo = new GPAlignListCollectorTo('account', 'opportunity', 'sales_opportunity', 'name', 'sys_id');
    }
    window.GPAlignListCollectorTo.hideSearch();
}