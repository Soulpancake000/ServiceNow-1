function projectVizClient(spUtil, $scope, $filter) {
    //Controller
    var c = this;
    //Variables
    c.tManagerSelected = {sys_id: 'All', name: 'All'};
    c.geoLocationSelected = 'All';
    c.onHoldOptions = ['All', 'On Hold', 'Non Hold'];
    c.onHoldOptionSelected = 'All';
    c.EngagemenTypeValues = ['All', 'Innovation', 'Journey', 'Simulation', 'Transformation', 'Empty', 'Other'];
    c.EngagemenTypeSelected = 'All';
    c.StateValues = ['All', 'In Qualification', 'Pending Launch', 'Active', 'Completed'];
    c.StateSelected = 'All';
    //Functions
    //Progress Bar - Functions
    c.progressBarState = function (row) {
        var project = c.data.projects[row.$parent.$index];
        var cl = {
            first: row.$first,
            active: row.state.value.value === project.state.value,
            next: row.state.value.value === (project.state.value + 1),
            visited: row.state.value.value < project.state.value,
            previous: row.state.value.value === (project.state.value - 1)
        };

        if (cl.active && project.on_hold.value === '1') {
            cl.fa = true;
            cl.onHold = cl.active;
            cl['fa-pause'] = cl.active;
        } else if (cl.active && project.table === 'x_snc_ion_nomination' && project.state.value === '4') {
            cl.fa = true;
            cl.warning = true;
        }
        else {
            cl.fa = cl.active;
            cl['fa-check'] = cl.active;
        }
        return cl;
    };
    c.progressBarClass = function () {
        var rtn = {};
        rtn['col-sm-' + c.data.states.length] = true;
        return rtn;
    };
    c.progressBarLength = function () {
        var length = parseInt(100 / c.data.states.length);
        return {'width': length + '%'};
    };
    //Update Data
    c.updateData = function (action) {
        c.server.get({
            action: action,
            filter_state: c.filter_state,
            order_by: c.data.order_by,
            sort_direction: c.data.sort_direction,
            pagination: c.data.pagination,
            onHoldOptionSelected: c.onHoldOptionSelected,
            tManagerSelected: c.tManagerSelected,
            geoLocationSelected: c.geoLocationSelected,
            EngagemenTypeSelected: c.EngagemenTypeSelected,
            StateSelected: c.StateSelected,
            excludeProjects: c.data.excludeProjects
        }).then(function (response) {
            c.filter_state = response.data.filter_state;
            c.data.projects = response.data.projects;
            c.data.GeoLocations = response.data.GeoLocations;
            c.data.pagination = response.data.pagination;
            c.data.InspireProjects = response.data.InspireProjects;
            c.data.excludeProjects = response.data.excludeProjects;
        });
    };
    c.setFilter = function (state) {
        c.filter_state = c.filter_state && state.value.value === c.filter_state.value.value ? undefined : state;
        c.updateData('get');
    };
    c.sortProjects = function () {
        c.data.pagination.current_page = 1;
        c.updateData('get');
    };
    c.pageChanged = function () {
        c.updateData('get');
    };
    c.FilterBy = function () {
        c.data.pagination.current_page = 1;
        c.updateData('get');
    };
    window.onresize = function (event) {
        if (c.showProgressBar() !== c.windowWidthStatus) {
            c.windowWidthStatus = c.showProgressBar();
            $scope.$apply();
        }
    };
    c.getProjectAdvancePercentage = function (project) {
        return parseInt(project.state.value / c.data.states.length * 100);
    };
    c.showProgressBar = function () {
        return window.innerWidth <= 800;
    };
    c.preStateChanged = function () {
        if (c.StateSelected === 'In Qualification')
            c.EngagemenTypeSelected = 'All'
    };
    c.windowWidthStatus = c.showProgressBar();
}