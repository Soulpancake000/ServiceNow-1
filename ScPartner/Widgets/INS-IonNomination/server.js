(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var config = {
        opportunityTable: 'incident',
        requestTable: 'u_ion_nomination',
        pagination: {
            items_in_pages: 60,
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
    }, opportunities = {}, requests = {sysIds: []}, requestOpportunityMap = {};

    serviceDispatch();
    fetchData();

    //Assign values to `data`
    data.opportunities = opportunities;
    data.requests = requests;
    data.requestOpportunityMap = requestOpportunityMap;
    data.config = config;

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
        console.log(gr.getEncodedQuery());
        gr.query();
        while (gr.next()) {
            // console.log(toObject(gr));
            console.log(gr.getValue(config.sort.by));
            var gRecord = $sp.getFieldsObject(gr, config.attributes.opportunity.join(','));
            opportunities[gRecord.sys_id.value] = gRecord;
            requests.sysIds.push(gRecord.sys_id.value);
        }

        //Fetch Requests of opportunities
        var grReq = new GlideRecord(config.requestTable);
        //get requests that has at least one opportunity
        grReq.addEncodedQuery('u_incidentsLIKE' + requests.sysIds.join('^ORu_incidentsLIKE'));
        console.log(grReq.getEncodedQuery());
        grReq.query();
        while (grReq.next()) {
            //console.log(toObject(grReq));
            gRecord = $sp.getFieldsObject(grReq, config.attributes.request.join(','));
            requests[gRecord.sys_id.value] = gRecord;
            gRecord.u_incidents.value.split(',').forEach(function (oppSysId) {
                if (requestOpportunityMap[oppSysId]) {
                    requestOpportunityMap[oppSysId].push(gRecord.sys_id.value);
                } else {
                    requestOpportunityMap[oppSysId] = [gRecord.sys_id.value];
                }
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
        var start = (config.pagination.current_page - 1) * config.pagination.items_in_pages,
            end = (config.pagination.current_page) * config.pagination.items_in_pages;
        gr.chooseWindow(start, end);
        return gr;
    }

})();
function toObject(recordToPackage) {
    var packageToSend = {};
    for (var property in recordToPackage) {
        try {
            packageToSend[property] = {
                display: recordToPackage[property].getDisplayValue(),
                value: recordToPackage.getValue(property)
            };
        } catch (err) {

        }
    }
    return packageToSend;
}