(function projectVizServer() {
    /* Initial Values */
    data.projects = [];
    var unsorted_projects = [],
        ionStates = ['1', '2', '3'],
        tspPhases = ['Engage', 'Discover', 'Align and Confirm', 'Promote', 'Realize', 'Closure'];
    if (input && input.action === "set_filter") {
        data.filter_state = input.state;
        if (input.state.value.value >= 4) {
            tspPhases = [input.state.label.display];
            ionStates = [];
        } else {
            ionStates = [input.state.value.value];
            tspPhases = [];
        }
    }

    var ionGr = new GlideRecord('x_snc_ion_nomination');
    ionGr.orderByDesc('opened_at');
    ionGr.addQuery('state', 'IN', ionStates);
    ionGr.setLimit(10);
    ionGr.query();
    while (ionGr.next()) {
        var ionRec = toObject(ionGr);
        unsorted_projects.push(ionRec);
    }


    var tspGr = new GlideRecord('tsp1_project');
    tspGr.orderByDesc('opened_at');
    tspGr.addQuery('phase', 'IN', tspPhases);
    tspGr.setLimit(10);
    tspGr.query();
    while (tspGr.next()) {
        var tspRec = toObject(tspGr);
        switch (tspRec.phase.display) {
            case 'Engage':
                tspRec.state = {value: '4', display: 'Engage'};
                break;
            case 'Discover':
                tspRec.state = {value: '5', display: 'Discover'};
                break;
            case 'Align and Confirm':
                tspRec.state = {value: '6', display: 'Align & Confirm'};
                break;
            case 'Promote':
                tspRec.state = {value: '7', display: 'Promote'};
                break;
            case 'Realize':
                tspRec.state = {value: '8', display: 'Realize'};
                break;
            case 'Closure':
                tspRec.state = {value: '9', display: 'Closure'};
                break;
        }
        unsorted_projects.push(tspRec);
    }
    data.projects = unsorted_projects.sort(function (a, b) {
        return a.opened_at.value > b.opened_at.value ? -1 : (a.opened_at.value < b.opened_at.value ? 1 : 0);
    });

    function toObject(recordToPackage) {
        var packageToSend = {};
        for (var property in recordToPackage) {
            try {
                packageToSend[property] = {
                    display: recordToPackage[property].getDisplayValue(),
                    value: recordToPackage.getValue(property)
                };
            } catch (err) {
            }
        }
        return packageToSend;
    }
})();