(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var config = {
            opportunityTable: 'incident',
            requestTable: 'u_ion_nomination',
            pagination: {
                items_in_page: [10, 15, 50, 100],
                current_page: 1,
                max_size: 10,
                total_items: 0,
                items_per_page: 10
            },
            sortDirection: 'Desc',
            attributes: {
                opportunity: [
                    'assigned_to',
                    'category',
                    'short_description',
                    'number',
                    'sys_id',
                    'state',
                    'account'
                ],
                request: [
                    'sys_id',
                    'number',
                    'u_incidents',
                    'account'
                ]
            },
            sort: {
                by: 'number',
                direction: 'DESC'
            },
            filter: {value: ''}
        },
        opportunities = [],
        requestOpportunityMap = {opportunities: {}, requestsInOpp: {}},
        opportunitiesSysId = [];

    serviceDispatch();
    fetchData();

    //Assign values to `data`
    data.opportunities = opportunities;
    data.config = config;


    /*
     FUNCTIONS
     */
    function fetchData() {
        var gr = new GlideRecord(config.opportunityTable);
        //Sort
        gr.addEncodedQuery('ORDERBY' + config.sort.direction + config.sort.by);

        //Filter
        if (config.filter.value) {
            gr.addEncodedQuery('numberLIKE' + config.filter.value
                + '^ORshort_descriptionLIKE' + config.filter.value
                + '^ORaccountLIKE' + config.filter.value);
        }

        gr = setPagination(gr);

        //Fetch Opportunities
        gr.query();
        //if there is no records due to search
        if (!gr.hasNext()) {
            return;
        }

        var idx = 0;
        while (gr.next()) {
            var gRecord = $sp.getFieldsObject(gr, config.attributes.opportunity.join(','));
            //Initialize requests variable
            gRecord.requests = [];
            opportunities.push(gRecord);

            //Save in dictionary the index of the opportunity, it'll be used to map the requestsInOpp associated
            opportunitiesSysId.push(gRecord.sys_id.value);
            requestOpportunityMap.opportunities[gRecord.sys_id.value] = idx++;
        }

        //Fetch requests of opportunities
        var grReq = new GlideRecord(config.requestTable);
        grReq.addEncodedQuery('u_incidentsLIKE' + opportunitiesSysId.join('^ORu_incidentsLIKE'));
        grReq.query();
        while (grReq.next()) {
            gRecord = $sp.getFieldsObject(grReq, config.attributes.request.join(','));
            gRecord.u_incidents.value.split(',').forEach(function (oppSysId) {
                var oppIdx = requestOpportunityMap.opportunities[oppSysId];
                opportunities[oppIdx].requests.push(gRecord);
            });
        }
    }

    function serviceDispatch() {
        console.log(input);
        if (input) {
            if (input.action === 'get') {
                config = input.config;
            }
        }
    }

    function setPagination(gr) {
        gr.query();
        config.pagination.total_items = gr.getRowCount();
        var start = (config.pagination.current_page - 1) * config.pagination.items_per_page,
            end = (config.pagination.current_page) * config.pagination.items_per_page;
        gr.chooseWindow(start, end);
        return gr;
    }

})();