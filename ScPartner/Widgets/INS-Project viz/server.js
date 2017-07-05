(function projectVizServer() {
    var setPaginationToGr = function (gr, delta) {
        var start = (data.pagination.current_page - 1) * parseInt(data.pagination.items_in_pages / 2),
            end = (data.pagination.current_page) * parseInt(data.pagination.items_in_pages / 2);
        console.log('start ' + start);
        console.log('end + delta ' + (end + delta));
        gr.chooseWindow(start, end + delta);
        return gr;
    };

    var getPaginationDelta = function (totalRecords) {
        var itemsInPage = data.pagination.items_in_pages / 2;
        var delta = itemsInPage - (totalRecords - (data.pagination.current_page - 1) * itemsInPage);
        if (delta >= itemsInPage) {
            delta = itemsInPage;
        } else if (delta < 0) {
            delta = 0;
        }
        return delta;
    };

    var mapTspStateFromPhase = function (phase) {
        var state = {};
        switch (phase.display_value) {
            case 'Engage':
                state = {value: '4', display_value: 'Engage'};
                break;
            case 'Discover':
                state = {value: '5', display_value: 'Discover'};
                break;
            case 'Align and Confirm':
                state = {value: '6', display_value: 'Align and Confirm'};
                break;
            case 'Promote':
                state = {value: '7', display_value: 'Promote'};
                break;
            case 'Realize':
                state = {value: '8', display_value: 'Realize'};
                break;
            case 'Closure':
                state = {value: '9', display_value: 'Closure'};
                break;
        }
        return state;
    };

    /**
     *  Initial Values
     */
    data.projects = [];
    data.states = [
        {
            label: {value: '1', display_value: 'New'},
            value: {value: '1', display_value: '1'}
        }, {
            label: {value: '2', display_value: 'Int. Qual.'},
            value: {value: '2', display_value: '2'}
        }, {
            label: {value: '3', display_value: 'Ext. Qual.'},
            value: {value: '3', display_value: '3'}
        }, {
            label: {value: 'Kickoff', display_value: 'Engage'},
            value: {value: '4', display_value: '4'}
        }, {
            label: {value: 'Discover', display_value: 'Discover'},
            value: {value: '5', display_value: '5'}
        }, {
            label: {value: 'Align and Confirm', display_value: 'Align & Confirm'},
            value: {value: '6', display_value: '6'}
        },
        {
            label: {value: 'Promote', display_value: 'Promote'},
            value: {value: '7', display_value: '7'}
        }, {
            label: {value: 'Realize', display_value: 'Realize'},
            value: {value: '8', display_value: '8'}
        }, {
            label: {value: 'Closure', display_value: 'Closure'},
            value: {value: '9', display_value: '9'}
        }
    ];
    data.sortingFields = [
        {
            value: 'state',
            label: 'State'
        },
        {
            value: 'opened_at',
            label: 'Opened At'
        },
        {
            value: 'number',
            label: 'Number'
        },
        {
            value: 'short_description',
            label: 'Short Description'
        },
        {
            value: 'assigned_to',
            label: 'Assigned To'
        }
    ];
    var unsorted_projects = [],
        tsp_sort_by = 'opened_at',
        ion_sort_by = 'opened_at',
        ion_states = ['1', '2', '3'],
        tsp_phases = [
            'Kickoff',
            'Discover',
            'Align and Confirm',
            'Promote',
            'Realize',
            'Closure'
        ];

    data.pagination = {
        items_in_pages: 20,
        current_page: 1,
        max_size: 10,
        total_items: {
            ion: 0,
            tsp: 0,
            total: 0
        }
    };

    /** Service Dispatch **/
    if (input) {
        if (input.action === 'get') {
            if (input.filter_state) {
                data.filter_state = input.filter_state;
                if (data.filter_state.value.value >= 4) {
                    tsp_phases = [data.filter_state.label.value];
                    ion_states = [];
                } else {
                    ion_states = [data.filter_state.value.value];
                    tsp_phases = [];
                }
            }
            if (input.sortingField) {
                tsp_sort_by = input.sortingField.value === 'state' ? 'phase' : 'state';
                ion_sort_by = input.sortingField.value;
            }
            if (input.pagination) {
                data.pagination = input.pagination;
            }
        }
    }

    var ionGr = new GlideRecord('x_snc_ion_nomination');
    ionGr.addQuery('state', 'IN', ion_states);
    ionGr.query();

    var tspGr = new GlideRecord('tsp1_project');
    tspGr.addQuery('phase', 'IN', tsp_phases);
    tspGr.query();

    data.pagination.total_items.ion = ionGr.getRowCount();
    data.pagination.total_items.tsp = tspGr.getRowCount();
    data.pagination.total_items.total = data.pagination.total_items.tsp + data.pagination.total_items.ion;

    var ion_delta = getPaginationDelta(data.pagination.total_items.ion);
    var tsp_delta = getPaginationDelta(data.pagination.total_items.tsp);

    console.log('ion_delta ' + ion_delta);
    console.log('tsp_delta ' + tsp_delta);

    ionGr = setPaginationToGr(ionGr, tsp_delta);
    tspGr = setPaginationToGr(tspGr, ion_delta);

    ionGr.query();
    while (ionGr.next()) {
        var ionRec = $sp.getFieldsObject(ionGr, 'state,opened_at,number,short_description,assigned_to');
        unsorted_projects.push(ionRec);
    }

    tspGr.query();
    while (tspGr.next()) {
        var tspRec = $sp.getFieldsObject(tspGr, 'state,phase,opened_at,number,short_description,assigned_to');
        tspRec.state = mapTspStateFromPhase(tspRec.phase);
        unsorted_projects.push(tspRec);
    }

    data.projects = unsorted_projects.sort(function (a, b) {
        var a_value = a[ion_sort_by].value === undefined ? a[tsp_sort_by].value : a[ion_sort_by].value;
        var b_value = b[ion_sort_by].value === undefined ? b[tsp_sort_by].value : b[ion_sort_by].value;
        return a_value > b_value ? -1 : (a_value < b_value ? 1 : 0);
    });
})();