(function projectVizServer() {
    //TODO: get this from choice list
    var States = [
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
        SortingFields = [
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
        FilterByState = {},
        SortDirection = 'Desc';
    var OrderBy = SortingFields[0];

    /** Service Dispatch**/
    serviceDispatch();
    var projects = getIonTsp1Projects();

    //Assign values to `data`
    data.projects = projects;
    data.states = States;
    data.sortingFields = SortingFields;
    data.orderBy = OrderBy;
    data.pagination = Pagination;
    data.sortDirection = SortDirection;
    data.filterState = FilterByState;

    function getIonTsp1Projects() {
        var gr = new GlideRecord('x_snc_ion_nom_to_tsp1'),
            projects = [];
        //Sort
        gr['orderBy' + SortDirection]('nom_' + OrderBy.value);
        gr['orderBy' + SortDirection]('tsp1_' + OrderBy.value);

        //Filter
        if (FilterByState !== {}) {
            gr.addQuery(FilterByState.type.value, FilterByState.label.value);
        } else {
            var nom_states = States.map(function (state) { if (state.type.value.indexOf('nom') > -1) return state.label.value; });
            var tsp1_phases = States.map(function (state) { if (state.type.value.indexOf('tsp1') > -1) return state.label.value; });
            gr.addQuery('nom_state', nom_states);
            gr.addQuery('tsp1_phase', tsp1_phases);
        }

        //Pagination
        gr = setPagination(gr);

        //Fetch
        gr.query();
        while (gr.next()) {
            var grRecord = $sp.getFieldsObject(gr, 'nom_state,nom_opened_at,nom_number,nom_short_description,nom_assigned_to,nom_sys_id,tsp1_state,tsp1_phase,tsp1_opened_at,tsp1_number,tsp1_short_description,tsp1_assigned_to,tsp1_sys_id');
            var project = castProject(grRecord);
            projects.push(project);
        }

        return projects;
    }

    function castProject(grRecord) {
        var prefix = grRecord.tsp1_number.value ? 'tsp1' : 'nom';
        var project = {
            state: grRecord[prefix + '_state'],
            opened_at: grRecord[prefix + '_opened_at'],
            number: grRecord[prefix + '_number'],
            short_description: grRecord[prefix + '_short_description'],
            assigned_to: grRecord[prefix + '_assigned_to'],
            sys_id: grRecord[prefix + '_sys_id'],
            project_type: {value: prefix}
        };

        if (grRecord.tsp1_number.value) {
            project.phase = grRecord.tsp1_phase;
            project.state = mapTspStateFromPhase(project.phase);
        }
        return project;
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
                FilterByState = input.filterState;
                OrderBy = input.orderBy;
                SortDirection = input.sortDirection;
                Pagination = input.pagination;
            }
        }
    }
})();