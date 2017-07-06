function projectVizClient(spUtil, $scope, $filter) {
    var c = this;
    c.progressBarState = function (row) {
        var project = c.data.projects[row.$parent.$index];
        var cl = {
            first: row.$first,
            active: row.state.value.value === project.state.value,
            next: row.state.value.value === (project.state.value + 1),
            visited: row.state.value.value < project.state.value,
            previous: row.state.value.value === (project.state.value - 1)
        };
        cl.fa = cl.active;
        cl['fa-check'] = cl.active;
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

    c.updateData = function (action) {
        c.updatingData = true;
        c.server.get({
            action: action,
            filter_state: c.filter_state,
            sortingField: c.data.sortingField,
            pagination: c.data.pagination,
            sortDirection: c.data.sortDirection
        }).then(function (response) {
            c.filter_state = response.data.filter_state;
            c.data.projects = response.data.projects;
            c.data.pagination = response.data.pagination;
            c.updatingData = false;
        });
    };

    c.setFilter = function (state) {
        c.filter_state = c.filter_state && state.value.value === c.filter_state.value.value ? undefined : state;
        c.data.pagination.current_page = 1;
        c.updateData('get');
    };

    c.sortProjects = function () {
        c.updateData('get');
    };

    c.pageChanged = function () {
        c.updateData('get');
    };

    c.getProjectAdvancePercentage = function (project) {
        return parseInt(project.state.value / c.data.states.length * 100);
    };
    c.showProgressBar = function () {
        return window.innerWidth <= 800;
    };
    c.windowWidthStatus = c.showProgressBar();
    window.onresize = function (event) {
        if (c.showProgressBar() !== c.windowWidthStatus) {
            c.windowWidthStatus = c.showProgressBar();
            $scope.$apply();
        }
    };
}