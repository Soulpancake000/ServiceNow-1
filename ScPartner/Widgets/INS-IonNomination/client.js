function () {
    var c = this;
    c.pageChanged = function () {
        console.log(c.data.serverConfig.pagination);
        c.updateData('get');
    };

    c.updateData = function (action) {
        c.updatingData = true;
        c.server.get({
            action: action,
            filter_state: c.filter_state,
            order_by: c.data.order_by,
            sort_direction: c.data.sort_direction,
            pagination: c.data.serverConfig.pagination
        }).then(function (response) {
            console.log(response.data);
            c.filter_state = response.data.filter_state;
            c.data.opportunities = response.data.opportunities;
            c.data.serverConfig = response.data.serverConfig;
            c.updatingData = false;
        });
    };
}