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
        }];
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
    ];
    var Pagination = {
        items_in_pages: 10,
        current_page: 1,
        max_size: 10,
        total_items: 0
    };
    var projectAttributes = [
        //x_snc_ion_nomination table
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

        //tsp1_project table
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
        'tps1_u_inspire_account.number',

        //x_snc_ion_project_m2m_users_inspire_projects table
        'res_inspire_project',
        'res_sys_created_by',
        'res_sys_created_on',
        'res_sys_id',
        'res_sys_mod_count',
        'res_sys_tags',
        'res_sys_updated_by',
        'res_sys_updated_on',
        'res_user'
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

    serviceDispatch();

    data.projects = getIonTsp1Projects();
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
        var gr = new GlideRecord('x_snc_ion_nom_to_tsp1');
        gr.addEncodedQuery('nom_type!=bva');
        //@TEST gr.addEncodedQuery('ORDERBYnom_inspire_account^ORDERBYtsp1_u_inspire_account');
        gr.addEncodedQuery('ORDERBYDESC' + 'tsp1_' + OrderBy.value + '^ORDERBYDESC' + 'nom_' + OrderBy.value);
        filterByParameters(gr);
        setPagination(gr);
        console.log(gr.getEncodedQuery());
        gr.query();

        return getObjsFromQuery(gr);
    }

    function setPagination(gr) {
        gr.query();
        Pagination.total_items = gr.getRowCount();
        var start = (Pagination.current_page - 1) * Pagination.items_in_pages,
            end = (Pagination.current_page) * Pagination.items_in_pages;
        gr.chooseWindow(start, end);
    }

    function getObjsFromQuery(gr) {
        var projects = [];
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
            project.engagement_type = grRecord.nom_engagement_type;
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
    function filterByParameters(gr) {
        if (fOnHold && fOnHold !== 'All') {
            gr.addQuery('nom_u_on_hold', fOnHold === 'On Hold');
        }
        if (fTeamMember && fTeamMember.name !== 'None') {
            gr.addEncodedQuery('nom_assigned_to=' + fTeamMember.sys_id + '^ORres_user=' + fTeamMember.sys_id);
        }
        if (fGeoLocation && fGeoLocation !== 'None') {
            gr.addEncodedQuery(fGeoLocation === 'No Region' ? 'nom_inspire_account.regionISEMPTY' : 'nom_inspire_account.region.geo.name=' + fGeoLocation);
        }
        if (fEngagementType && fEngagementType !== 'None') {
            if (fEngagementType && fEngagementType !== 'All') {
                gr.addEncodedQuery(fEngagementType === 'Empty' ? 'tsp1_u_engagement_typeISEMPTY' : 'tsp1_u_engagement_type=' + fEngagementType);
            }
        }
        filterState(gr);
    }

    function filterState(gr) {
        var query = null;
        var defaultNomStates = states.filter(function (state) { return (state.type.value.indexOf('nom') > -1); }).map(function (state) { return state.label.value; }).join(',');
        var defaultTspPhases = states.filter(function (state) { return (state.type.value.indexOf('tsp1') > -1); }).map(function (state) { return state.label.value; }).join(',');
        if (fState === 'In Qualification') {
            //In Qualification – (x_snc_ion_nomination, state = New, Internal or External Qualification).
            query = 'nom_stateIN1,2,3';
        } else if (fState === 'Pending Launch') {
            //x_snc_ion_nomination.state = Accepted AND NO project (tsp1_project) exists OR project state is “Open” or “Pending”.
            query = 'tsp1_phaseIN' + defaultTspPhases + '^nom_state=4^tsp1_stateISEMPTY^ORtsp1_stateIN-5,1';
        } else if (fState === 'Active') {
            //Active = TSP_1 state = “Work in Progress”
            query = 'tsp1_phaseIN' + defaultTspPhases + '^tsp1_state=2';
        } else if (fState === 'Completed') {
            //Completed TSP_1 State = Closed Complete
            query = 'tsp1_phaseIN' + defaultTspPhases + '^tsp1_state=3';
        } else {
            //Default all tsp1 phases and nom states
            query = 'tsp1_phaseIN' + defaultTspPhases + '^ORnom_stateIN' + defaultNomStates;
        }

        if (FilterByState) {
            query += '^' + FilterByState.type.value + '=' + FilterByState.label.value;
        }
        gr.addEncodedQuery(query);
    }
})();