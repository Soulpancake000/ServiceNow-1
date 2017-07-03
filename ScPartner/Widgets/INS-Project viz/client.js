function projectVizClient($scope) {
    var c = this;
    c.data.states = [
        {
            label: {value: '1', display_value: 'New'},
            value: {value: '1', display_value: '1'}
        },
        {
            label: {value: '2', display_value: 'Int. Qual.'},
            value: {value: '2', display_value: '2'}
        },
        {
            label: {value: '3', display_value: 'Ext. Qual.'},
            value: {value: '3', display_value: '3'}
        },
        {
            label: {value: '4', display_value: 'Engage'},
            value: {value: '4', display_value: '4'}
        },
        {
            label: {value: '5', display_value: 'Discover'},
            value: {value: '5', display_value: '5'}
        },
        {
            label: {value: '6', display_value: 'Align and Confirm'},
            value: {value: '6', display_value: '6'}
        },

        {
            label: {value: '7', display_value: 'Promote'},
            value: {value: '7', display_value: '7'}
        },
        {
            label: {value: '8', display_value: 'Realize'},
            value: {value: '8', display_value: '8'}
        },
        {
            label: {value: '9', display_value: 'Closure'},
            value: {value: '9', display_value: '9'}
        }];
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

    c.setFilter = function (state) {
        c.server.get({
            state: state,
            action: "set_filter"
        }).then(function (response) {
            c.filter_state = response.data.filter_state;
            c.data.projects = response.data.projects;
        });
    };

}