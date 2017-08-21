(function projectVizServer() {
    //variables
    var states = [
        {
            label: {value: '1', display_value: 'New'},
            value: {value: '1', display_value: '1'},
            type: {value: 'nom_state', display_value: 'nom_state'}
        },
        {
            label: {value: '2', display_value: 'Int. Qual.'},
            value: {value: '2', display_value: '2'},
            type: {value: 'nom_state', display_value: 'nom_state'}
        },
        {
            label: {value: '3', display_value: 'Ext. Qual.'},
            value: {value: '3', display_value: '3'},
            type: {value: 'nom_state', display_value: 'nom_state'}
        },
        {
            label: {value: 'Kickoff', display_value: 'Engage'},
            value: {value: '4', display_value: '4'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        },
        {
            label: {value: 'Discover', display_value: 'Discover'},
            value: {value: '5', display_value: '5'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        },
        {
            label: {value: 'Align and Confirm', display_value: 'Align & Confirm'},
            value: {value: '6', display_value: '6'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        },
        {
            label: {value: 'Promote', display_value: 'Promote'},
            value: {value: '7', display_value: '7'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        },
        {
            label: {value: 'Realize', display_value: 'Realize'},
            value: {value: '8', display_value: '8'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        },
        {
            label: {value: 'Closure', display_value: 'Closure'},
            value: {value: '9', display_value: '9'},
            type: {value: 'tsp1_phase', display_value: 'tsp1_phase'}
        }]
    var sortingFields = [
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
    ]
    var Pagination = {
        items_in_pages: 10,
        current_page: 1,
        max_size: 10,
        total_items: 0
    };
    var projectAttributes = [
        'nom_state',
        'nom_opened_at',
        'nom_number',
        'nom_short_description',
        'nom_assigned_to',
        'nom_sys_id',
        'nom_u_on_hold',
        'nom_engagement_type',
        'nom_inspire_account',
        'nom_type',

        'tsp1_project_manager',
        'tsp1_short_description',
        'tsp1_state',
        'tsp1_phase',
        'tsp1_opened_at',
        'tsp1_number',
        'tsp1_short_description',
        'tsp1_assigned_to',
        'tsp1_sys_id',
        'tsp1_u_engagement_type',
        'tsp1_u_inspire_account',
        'tps1_u_inspire_account.number'

    ];
    var FilterByState;
    var sortDirection = 'Desc';
    var OrderBy = sortingFields[0];
    //filter variables
    var fTeamMember;
    var fGeoLocation;
    var fEngagementType;
    var fState;
    var fOnHold;
    //Service Dispatch
    serviceDispatch();
    var projects = getIonTsp1Projects();
    //Assign values to 'data'
    data.projects = projects;
    data.states = states;
    data.sorting_fields = sortingFields;
    data.order_by = OrderBy;
    data.pagination = Pagination;
    data.sort_direction = sortDirection;
    data.filter_state = FilterByState;
    data.onHoldSelected = fOnHold;
    data.tManagerSelected = fTeamMember;
    data.geoLocationSelected = fGeoLocation;
    data.EngagementTypeSelected = fEngagementType;
    data.StateSelected = fState;
    //Functions to Records
    function getIonTsp1Projects() {
        var gr = new GlideRecord('x_snc_ion_nom_to_tsp1')
        gr.addEncodedQuery(orderByQuery());
        gr.addEncodedQuery(filterByStates());
        gr = filterByParameters(gr);

        gr = setPagination(gr);

        gr.query();
        var allProjects = getObjsFromQuery(gr);
        return allProjects;
    }

    function orderByQuery() {
        var orderByQuery = 'ORDERBYDESC' + 'tsp1_' + OrderBy.value + '^ORDERBYDESC' + 'nom_' + OrderBy.value;
        return orderByQuery;
    }

    function setPagination(gr) {
        gr.query();
        Pagination.total_items = gr.getRowCount();
        var start = (Pagination.current_page - 1) * Pagination.items_in_pages,
            end = (Pagination.current_page) * Pagination.items_in_pages;
        gr.chooseWindow(start, end);
        return gr;
    }

    function setPaginationAfterQuery(projects) {
        Pagination.total_items = projects.length;
    }

    function getObjsFromQuery(gr) {
        var projects = [];
        while (gr.next()) {
            if (grRecord.type.display_value != 'BVA') {
                var grRecord = $sp.getFieldsObject(gr, projectAttributes.join(','));
                var project = castProject(grRecord);
                project.entroGeolOcationIfCon = fGeoLocation + '- -' + isNaN(project.geo).toString();
                if (fGeoLocation != 'None') {
                    if (project.geo == fGeoLocation)
                        projects.push(project);
                }
                else
                    projects.push(project);
            }
        }
        if (fGeoLocation != 'None')
            setPaginationAfterQuery(projects);

        return projects;
    }

    function castProject(grRecord) {
        var prefix = isTsp(grRecord) ? 'tsp1' : 'nom';
        var project = {
            state: grRecord[prefix + '_state'],
            opened_at: grRecord[prefix + '_opened_at'],
            number: grRecord[prefix + '_number'],
            short_description: grRecord[prefix + '_short_description'],
            sys_id: grRecord[prefix + '_sys_id'],
            inspire_account: grRecord[prefix + '_inspire_account'],
            engagement_type: grRecord[prefix + '_engagement_type'],
            project_manager: grRecord[prefix + '_project_manager'],
            project_type: {value: prefix}
        };
        project.on_hold = grRecord.nom_u_on_hold;
        project.type = grRecord.nom_type;

        if (isTsp(grRecord)) {
            project.phase = grRecord.tsp1_phase;
            project.state = mapTspStateFromPhase(project.phase);
            project.engagement_type = grRecord.tsp1_u_engagement_type;
            project.inspire_account = grRecord.tsp1_u_inspire_account;
            project.assigned_to = grRecord.tsp1_assigned_to;
            project.table = 'tsp1_project';
            project.assigned_to = grRecord.nom_assigned_to;
            project.general_state = grRecord.tsp1_state;

        } else {
            project.assigned_to = grRecord.nom_assigned_to;
            project.table = 'x_snc_ion_nomination';
            project.general_state = grRecord.nom_state;
        }
        project = getInfoInspireAccount(project);

        return project;
    }

    function isTsp(grRecord) {

        return grRecord.tsp1_number.value !== null;
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
                fOnHold = input.onHoldOptionSelected;
                fTeamMember = input.tManagerSelected;
                fGeoLocation = input.geoLocationSelected;

                fEngagementType = input.EngagemenTypeSelected;
                fState = input.StateSelected;

            }
        }
    }

    function getInfoInspireAccount(project) {
        var inspireNameFromProject = project.inspire_account.display_value.toString();
        var grInspire = new GlideRecord('x_snc_ion_inspire_account');
        grInspire.query();
        while (grInspire.next()) {
            if (grInspire.display_name.toString() == project.inspire_account.display_value.toString()) {
                project.inspire_account.number = grInspire.number.toString();
                project.senior_mgmt_update = grInspire.senior_mgmt_update.toString();
                if (grInspire.region.geo.name.toString() != "")
                    project.geo = grInspire.region.geo.name.toString();
                else
                    project.geo = 'No Region';
                project.updateDate = grInspire.sys_updated_on.toString();
            }

        }
        return project;
    }

    //Information
    function getInspireProjects() {
        var rec = new GlideRecord('sys_user');
        rec.addQuery('department.name', 'SC Inspire');
        rec.orderBy('first_name');
        rec.query();
        var res = [];
        res.push({sys_id: 'None', name: 'None'});
        while (rec.next()) {
            res.push({sys_id: rec.sys_id.toString(), name: rec.first_name.toString() + ' ' + rec.last_name.toString()});
            //res.push(rec);
        }
        return res;
    }

    data.InspireProjects = getInspireProjects();
    function getInspireAccounts() {
        var answer = [];
        var mem = new GlideRecord('x_snc_ion_inspire_account');
        mem.query();
        while (mem.next()) {
            answer.push(mem);
        }
        return answer;
    }

    data.InspireAccounts = getInspireAccounts();
    function getGeoLocationInfo() {
        var answer = [];
        var mem = new GlideRecord('sales_territory');
        mem.query();
        answer.push('None');
        while (mem.next()) {
            if (!existObjInArray(mem.geo.name, answer) && mem.geo.name != "")
                answer.push(mem.geo.name.toString());
        }
        answer.push('No Region');
        return answer;
    }

    function existObjInArray(obj, list) {
        var resut = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i] == obj) {
                resut = true;
            }
        }
        return resut;
    }

    data.GeoLocations = getGeoLocationInfo();
    function getTeamManagers() {
        var answer = [];
        var mem = new GlideRecord('sys_user_grmember');
        mem.addQuery('group.name', 'Inspire');
        mem.query();
        answer.push('None');

        while (mem.next()) {
            answer.push(mem.user.name.toString());
        }
        return answer;
    }

    data.TeamManagers = getTeamManagers();
    //Filters
    function filterByStates() {
        var query = null;
        if (FilterByState !== undefined) {
            query = FilterByState.type.value + '=' + FilterByState.label.value;
        } else {
            var nom_states = states.filter(function (state) {
                return (state.type.value.indexOf('nom') > -1);
            }).map(function (state) {
                return state.label.value;
            });
            var tsp1_phases = states.filter(function (state) {
                return (state.type.value.indexOf('tsp1') > -1);
            }).map(function (state) {
                return state.label.value;
            });
            query = 'nom_state=' + nom_states.join('^ORnom_state=') + '^ORtsp1_phase=' + tsp1_phases.join('^ORtsp1_phase=');
        }
        return query;
    }

    function filterByParameters(gr) {
        gr.addQuery('type', '!=', 'BVA');

        if (fOnHold !== 'All') {
            gr = filterOnHold(gr);
        }
        if (fTeamMember.name !== 'None') {
            gr = filterManager(gr);
        }
        if (fGeoLocation !== 'None') {
            gr = filterGeo(gr);
        }
        if (fEngagementType !== 'None') {
            gr = filterEngagementType(gr);
        }
        if (fState !== 'None') {
            gr = filterState(gr);

        }

        return gr;
    }

    function filterManager(gr) {
        gr.addQuery('nom_assigned_to.name', fTeamMember.name);

        return gr;
    }

    function filterGeo(gr) {
        if (fGeoLocation != 'No Region') {
            gr.addNotNullQuery('nom_inspire_account');
            gr.addNotNullQuery('nom_inspire_account.region');
            gr.addNotNullQuery('nom_inspire_account.region.geo')
                .addCondition('nom_inspire_account.region.geo.name', '=', fGeoLocation);
        }
        return gr;
    }

    function filterProjectsGeo(ProjectsArray) {
        var projResult = [];
        for (var i = 0; i < ProjectsArray; i++) {
            if (ProjectsArray[i].geo === fGeoLocation) {
                ProjectsArray[i].comparoGeo = ProjectsArray[i].geo + ' --- ' + fGeoLocation;
                projResult.push(ProjectsArray[i]);
            }
        }
        return projResult;
    }

    function filterOnHold(gr) {

        if (fOnHold == 'On Hold')
            gr.addQuery('nom_u_on_hold', 'true');
        if (fOnHold == 'Non Hold')
            gr.addQuery('nom_u_on_hold', 'false');

        return gr;
    }

    function filterEngagementType(gr) {
        if (fEngagementType != 'Other') {
            gr.addQuery('tsp1_u_engagement_type', fEngagementType);
        }
        else {
            var query = 'nom_engagement_typeNOT INInnovation,Journey,Simulation,Transformation';
            gr.addEncodedQuery(query);
        }
        return gr;
    }

    function filterState(gr) {
        if (fState === 'In Qualification') {
            var queryQuai = 'nom_state=1^ORnom_state=2^ORnom_state=3';
            gr.addEncodedQuery(queryQuai);
        }
        else if (fState === 'Pending Launch') {
            var queryPendingLaunch = 'nom_state=4^ORtsp1_state=1^tsp1_state=-5';
            gr.addEncodedQuery(queryPendingLaunch);
        }
        else if (fState === 'Active') {
            var queryActive = 'tsp1_state=2';
            gr.addEncodedQuery(queryActive);
        }
        else if (fState === 'Completed') {
            var queryCompleted = 'tsp1_state=3';
            gr.addEncodedQuery(queryCompleted);
        }
        return gr;
    }
})();