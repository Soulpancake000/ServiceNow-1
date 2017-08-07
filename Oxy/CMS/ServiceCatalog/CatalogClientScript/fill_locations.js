function onChange(control, oldValue, newValue, isLoading, $scope) {
    if (window) {
        if (isLoading || newValue == '') {
            return;
        }
        //Creates checkboxes for location selection
        var ciSysID = $('sysparm_id').value;
        var role = g_form.getValue('role');

        var busUnit = g_form.getValue('business_unit') + '';
        if (typeof window.busUnitLoc == "undefined") {
            window.busUnitLoc = {};
        }
        if (typeof window.busUnitLoc[busUnit] == "undefined") {
            var gbu = new GlideAjax('getBusUnit');
            gbu.addParam('sysparm_name', 'getBusUnitLocations');
            gbu.addParam('sysparm_sysid', ciSysID);
            gbu.addParam('sysparm_bu', busUnit);
            gbu.addParam('sysparm_role', role);
            gbu.getXMLWait();
            var answer = gbu.getAnswer();
            var grpData = answer.split(';');
            __renderCheckBox(grpData, "BUlocations", "Select Business Unit Location", true);
            //window.busUnitLoc[busUnit] = htmlStr + '';
        }

        //if there is only one checkbox, it's marked as checked by default
        var inputs = document.getElementsByTagName("input");
        var count = 0;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox" && inputs[i].id == "BUlocations") {
                count += 1;
                if (count == 1 && !(inputs[i + 1].type == "checkbox" && inputs[i + 1].id == "BUlocations")) {
                    inputs[i].checked = true;
                }
            }
        }
    }
    if (!window) {
        if (isLoading || newValue == '') {
            return;
        }
        var ciSysID = parseQuery(location.search).sys_id;
        var role = g_form.getValue('role');
        var busUnit = g_form.getValue('business_unit') + '';
        setListCollectorQuery('location_test_list', 'u_business_unit=' + busUnit + '^u_role=' + role + '^u_catalog_item=' + ciSysID);
    }

    function setListCollectorQuery(ID, filterString) {
        var gListLocationTest = g_list.get(ID);
        gListLocationTest.reset();
        gListLocationTest.setQuery(filterString);
    }

    function parseQuery(qstr) {
        var query = {};
        var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }
}