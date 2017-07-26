(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var config = {
        opportunityTable: 'incident',
        requestTable: 'u_ion_nomination',
        Pagination: {
            items_in_pages: 10,
            current_page: 1,
            max_size: 10,
            total_items: 0
        },
        sortDirection: 'Desc',
        attributes: {
            opportunity: [
                'assigned_to',
                'category',
                'short_description',
                'number',
                'sys_id',
                'state'
            ],
            request: []
        }
    };


    //fetch requests
    var opportunities = fetchOpportunities();

    //Assign values to `data`
    data.opportunities = opportunities;
    data.serverConfig = config;
    console.log(opportunities);

    function fetchOpportunities() {
        var gr = new GlideRecord(config.opportunitiesTable);
        gr = setPagination(gr);
        var items = [];
        //Fetch
        gr.query();
        while (gr.next()) {
            var grRecord = $sp.getFieldsObject(gr, config.attributes.opportunity.join(','));
            items.push(grRecord);
        }
        return items;
    }

    function serviceDispatch() {
        if (input) {
            if (input.action === 'get') {
                FilterByState = input.filter_state;
                OrderBy = input.order_by;
                sortDirection = input.sort_direction;
                Pagination = input.pagination;
            }
        }
    }

    function setPagination(gr) {
        gr.query();
        config.Pagination.total_items = gr.getRowCount();
        var start = (config.Pagination.current_page - 1) * config.Pagination.items_in_pages,
            end = (config.Pagination.current_page) * config.Pagination.items_in_pages;
        gr.chooseWindow(start, end);
        return gr;
    }

})();