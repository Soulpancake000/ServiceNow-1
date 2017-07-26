(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var opportunitiesTable = 'u_incidents',
        requestTable = 'u_ion_nomination',
        Pagination = {
            items_in_pages: 10,
            current_page: 1,
            max_size: 10,
            total_items: 0
        },
        sortDirection = 'Desc',
        projectAttributes = [
            'assigned_to',
            'company',
            'description',
            'u_incidents',
            'number',
            'sys_id',
            'state'
        ];


    //fetch requests
    var gr = new GlideRecord(requestTable);
    var requests = fetchItems(gr);

    //Assign values to `data`
    data.requests = requests;
    console.log(requests);

    function fetchItems(gr) {
        gr = setPagination(gr);
        var items = [];
        //Fetch
        gr.query();
        while (gr.next()) {
            var grRecord = $sp.getFieldsObject(gr, projectAttributes.join(','));
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
        Pagination.total_items = gr.getRowCount();
        var start = (Pagination.current_page - 1) * Pagination.items_in_pages,
            end = (Pagination.current_page) * Pagination.items_in_pages;
        gr.chooseWindow(start, end);
        return gr;
    }

})();