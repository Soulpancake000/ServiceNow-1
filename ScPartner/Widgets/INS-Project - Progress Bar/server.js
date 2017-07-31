(function projectVizServer() {
    //TODO: get this from choice list
    var states = [
            {
                label: {value: '1', display_value: 'New'},
                value: {value: '1', display_value: '1'},
                type: {value: 'nom_state', display_value: 'nom_state'}
            }, {
                label: {value: '2', display_value: 'Int. Qual.'},
                value: {value: '2', display_value: '2'},
                type: {value: 'nom_state', display_value: 'nom_state'}
            }, {
                label: {value: '3', display_value: 'Ext. Qual.'},
                value: {value: '3', display_value: '3'},
                type: {value: 'nom_state', display_value: 'nom_state'}
            }, {
                label: {value: 'Kickoff', display_value: 'Engage'},
                value: {value: '4', display_value: '4'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }, {
                label: {value: 'Discover', display_value: 'Discover'},
                value: {value: '5', display_value: '5'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }, {
                label: {value: 'Align and Confirm', display_value: 'Align & Confirm'},
                value: {value: '6', display_value: '6'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }, {
                label: {value: 'Promote', display_value: 'Promote'},
                value: {value: '7', display_value: '7'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }, {
                label: {value: 'Realize', display_value: 'Realize'},
                value: {value: '8', display_value: '8'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }, {
                label: {value: 'Closure', display_value: 'Closure'},
                value: {value: '9', display_value: '9'},
                type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
            }
        ],
        //TODO: get this from choice list
        sortingFields = [
            {
                value: 'opened_at',
                label: 'Created'
            }, {
                value: 'state',
                label: 'State'
            }, {
                value: 'number',
                label: 'Number'
            }, {
                value: 'short_description',
                label: 'Short Description'
            }, {
                value: 'assigned_to',
                label: 'Owner'
            }
        ],
        Pagination = {
            items_in_pages: 10,
            current_page: 1,
            max_size: 10,
            total_items: 0
        },
        FilterByState,
        projectAttributes = [
            'nom_state',
            'nom_opened_at',
            'nom_number',
            'nom_short_description',
            'nom_assigned_to',
            'nom_sys_id',
            'tsp1_state',
            'tsp1_phase',
            'tsp1_opened_at',
            'tsp1_number',
            'tsp1_short_description',
            'tsp1_assigned_to',
            'tsp1_sys_id'
        ],
        sortDirection = 'Desc';
    var OrderBy = sortingFields[0];

    /** Service Dispatch**/
    serviceDispatch();
    var projects = getIonTsp1Projects();

    //Assign values to `data`
    data.projects = projects;
    data.states = states;
    data.sorting_fields = sortingFields;
    data.order_by = OrderBy;
    data.pagination = Pagination;
    data.sort_direction = sortDirection;
    data.filter_state = FilterByState;

    function getIonTsp1Projects() {
        var gr = new GlideRecord('x_snc_ion_nom_to_tsp1'),
            projects = [];
        //Sort
        var orderByQuery = 'ORDERBYDESC' + 'tsp1_' + OrderBy.value + '^ORDERBYDESC' + 'nom_' + OrderBy.value;
        gr.addEncodedQuery(orderByQuery);

        //Filter
        var query = null;
        if (FilterByState !== undefined) {
            query = FilterByState.type.value + '=' + FilterByState.label.value;
        } else {
            var nom_states = states.filter(function (state) { return (state.type.value.indexOf('nom') > -1); }).map(function (state) { return state.label.value; });
            var tsp1_phases = states.filter(function (state) { return (state.type.value.indexOf('tsp1') > -1); }).map(function (state) { return state.label.value; });
            query = 'nom_state=' + nom_states.join('^ORnom_state=') + '^ORtsp1_phase=' + tsp1_phases.join('^ORtsp1_phase=');
        }
        gr.addEncodedQuery(query);

        //Pagination
        gr = setPagination(gr);

        //Fetch
        gr.query();
        while (gr.next()) {
            var grRecord = $sp.getFieldsObject(gr, projectAttributes.join(','));
            var project = castProject(grRecord);
            projects.push(project);
        }

        return projects;
    }

    function castProject(grRecord) {
        var prefix = isTsp(grRecord) ? 'tsp1' : 'nom';
        var project = {
            state: grRecord[prefix + '_state'],
            opened_at: grRecord[prefix + '_opened_at'],
            number: grRecord[prefix + '_number'],
            short_description: grRecord[prefix + '_short_description'],
            assigned_to: grRecord[prefix + '_assigned_to'],
            sys_id: grRecord[prefix + '_sys_id'],
            project_type: {value: prefix}
        };

        if (isTsp(grRecord)) {
            project.phase = grRecord.tsp1_phase;
            project.state = mapTspStateFromPhase(project.phase);
        }
        return project;
    }

    function isTsp(grRecord) {
        return grRecord.tsp1_number.value !== null;
    }

    function setPagination(gr) {
        gr.query();
        Pagination.total_items = gr.getRowCount();
        var start = (Pagination.current_page - 1) * Pagination.items_in_pages,
            end = (Pagination.current_page) * Pagination.items_in_pages;
        gr.chooseWindow(start, end);
        return gr;
    }

    function mapTspStateFromPhase(phase) {
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
    }

    function serviceDispatch() {
        if (input) {
            if (input.action === 'get') {
                FilterByState = input.filter_state;
                OrderBy = input.order_by;
                sortDirection = input.sort_direction;
                Pagination = input.pagination;
            }
        }
    }
})();