function () {
    var c = this;
    c.updateData = function (action) {
        c.updatingData = true;
        c.server.get({
            action: action,
            config: c.data.config
        }).then(function (response) {
            console.log(response.data);
            c.data.opportunities = response.data.opportunities;
            c.data.requets = response.data.requets;
            c.data.config = response.data.config;
            c.updatingData = false;
        });
    };
    c.sort = function (field) {
        c.data.config.sort.by = field;
        c.data.config.sort.direction = c.data.config.sort.direction === 'DESC' ? '' : 'DESC';
        c.updateData('get');
    }
}