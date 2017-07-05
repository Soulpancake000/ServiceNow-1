(function projectVizServer() {
    /* Initial Values */
    data.projects = [];
    data.states = [
        {label: {value: '1', display_value: 'New'}, value: {value: '1', display_value: '1'}},
        {label: {value: '2', display_value: 'Int. Qual.'}, value: {value: '2', display_value: '2'}},
        {label: {value: '3', display_value: 'Ext. Qual.'}, value: {value: '3', display_value: '3'}},
        {label: {value: 'Kickoff', display_value: 'Engage'}, value: {value: '4', display_value: '4'}},
        {label: {value: 'Discover', display_value: 'Discover'}, value: {value: '5', display_value: '5'}},
        {
            label: {value: 'Align and Confirm', display_value: 'Align & Confirm'},
            value: {value: '6', display_value: '6'}
        },
        {label: {value: 'Promote', display_value: 'Promote'}, value: {value: '7', display_value: '7'}},
        {label: {value: 'Realize', display_value: 'Realize'}, value: {value: '8', display_value: '8'}},
        {label: {value: 'Closure', display_value: 'Closure'}, value: {value: '9', display_value: '9'}}
    ];
    data.sortingFields = [
        {value: 'state', label: 'State'},
        {value: 'opened_at', label: 'Opened At'},
        {value: 'number', label: 'Number'},
        {value: 'short_description', label: 'Short Description'},
        {value: 'assigned_to', label: 'Assigned To'}
    ];
    var unsorted_projects = [], tspSortBy = 'opened_at', ionSortBy = 'opened_at', ionStates = ['1', '2', '3'],
        tspPhases = ['Kickoff', 'Discover', 'Align and Confirm', 'Promote', 'Realize', 'Closure'];
    console.log(input);
    if (input) {
        if (input.action === 'get') {
            if (input.filter_state) {
                data.filter_state = input.filter_state;
                if (data.filter_state.value.value >= 4) {
                    tspPhases = [data.filter_state.label.value];
                    ionStates = [];
                } else {
                    ionStates = [data.filter_state.value.value];
                    tspPhases = [];
                }
            }
            if (input.sortingField) {
                tspSortBy = input.sortingField.value === 'state' ? 'phase' : 'state';
                ionSortBy = input.sortingField.value;
            }
        }
    }

    var ionGr = new GlideRecord('x_snc_ion_nomination');
    ionGr.orderByDesc(ionSortBy);
    ionGr.addQuery('state', 'IN', ionStates);
    ionGr.setLimit(10);
    ionGr.query();
    while (ionGr.next()) {
        var ionRec = $sp.getFieldsObject(ionGr, 'state,opened_at,number,short_description,assigned_to');
        unsorted_projects.push(ionRec);
    }


    var tspGr = new GlideRecord('tsp1_project');
    tspGr.orderByDesc(tspSortBy);
    tspGr.addQuery('phase', 'IN', tspPhases);
    tspGr.setLimit(10);
    tspGr.query();
    while (tspGr.next()) {
        var tspRec = $sp.getFieldsObject(tspGr, 'state,phase,opened_at,number,short_description,assigned_to');
        switch (tspRec.phase.display_value) {
            case 'Engage':
                tspRec.state = {value: '4', display_value: 'Engage'};
                break;
            case 'Discover':
                tspRec.state = {value: '5', display_value: 'Discover'};
                break;
            case 'Align and Confirm':
                tspRec.state = {value: '6', display_value: 'Align and Confirm'};
                break;
            case 'Promote':
                tspRec.state = {value: '7', display_value: 'Promote'};
                break;
            case 'Realize':
                tspRec.state = {value: '8', display_value: 'Realize'};
                break;
            case 'Closure':
                tspRec.state = {value: '9', display_value: 'Closure'};
                break;
        }
        unsorted_projects.push(tspRec);
    }
    data.projects = unsorted_projects.sort(function (a, b) {
        var a_value = a[ionSortBy].value === undefined ? a[tspSortBy].value : a[ionSortBy].value;
        var b_value = b[ionSortBy].value === undefined ? b[tspSortBy].value : b[ionSortBy].value;
        return a_value > b_value ? -1 : (a_value < b_value ? 1 : 0);
    });
})();