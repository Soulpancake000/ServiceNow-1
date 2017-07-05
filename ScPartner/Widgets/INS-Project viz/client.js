function projectVizClient(spUtil, $scope, $filter) {
    var c = this;
    c.progressBarState = function (row) {
        var project = c.data.projects[row.$parent.$index];
        var cl = {
            first: row.$first,
            active: row.state.value.value == project.state.value,
            next: row.state.value.value == (project.state.value + 1),
            visited: row.state.value.value < project.state.value,
            previous: row.state.value.value == (project.state.value - 1)
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
        return {
            'width': length + '%'
        };
    };

    c.updateData = function (action, fn) {
        fn = fn === undefined ? function () {} : fn;
        c.server.get({
            action: action,
            filter_state: c.filter_state,
            sortingField: c.data.sortingField,
            pagination: c.data.pagination
        }).then(function (response) {
            c.filter_state = response.data.filter_state;
            c.data.projects = response.data.projects;
            fn(response);
        });
    };

    c.setFilter = function (state) {
        c.filter_state = state;
        c.updateData('get');
    };

    c.sortProjects = function () {
        c.updateData('get');
    };

    c.pageChanged = function () {
        c.updateData('get');
    };
}