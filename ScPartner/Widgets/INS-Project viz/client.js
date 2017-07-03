function projectVizClient($scope) {
    var c = this;
    c.data.states = [
        {
            label: {value: '1', display: 'New'},
            value: {value: '1', display: '1'}
        },
        {
            label: {value: '2', display: 'Int. Qual.'},
            value: {value: '2', display: '2'}
        },
        {
            label: {value: '3', display: 'Ext. Qual.'},
            value: {value: '3', display: '3'}
        },
        {
            label: {value: '4', display: 'Engage'},
            value: {value: '4', display: '4'}
        },
        {
            label: {value: '5', display: 'Discover'},
            value: {value: '5', display: '5'}
        },
        {
            label: {value: '6', display: 'Align & Confirm'},
            value: {value: '6', display: '6'}
        },

        {
            label: {value: '7', display: 'Promote'},
            value: {value: '7', display: '7'}
        },
        {
            label: {value: '8', display: 'Realize'},
            value: {value: '8', display: '8'}
        },
        {
            label: {value: '9', display: 'Closure'},
            value: {value: '9', display: '9'}
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
    }

}