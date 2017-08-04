(function () {
    clearsM2MTable();
    populateM2MTable();

    function clearsM2MTable() {
        // Omit the records that are already in m2m table
        var gOpportunityRequest = new GlideRecord('u_m2m_ion_nominations_incidents');
        gOpportunityRequest.setWorkflow(false);
        while (gOpportunityRequest.next()) {
            gOpportunityRequest.deleteRecord();
        }
    }

    function populateM2MTable() {
        var gAggCount = new GlideAggregate('x_snc_ion_nomination');
        gAggCount.addAggregate('COUNT');
        gAggCount.query();
        var totalRequests = gAggCount.next() ? gAggCount.getAggregate('COUNT') : 0;
        var batchSize = 100;
        var page = 0;
        do {
            var start = 0 + (page * batchSize);
            var end = batchSize + page++ * batchSize;

            var gInspireRequest = new GlideRecord('x_snc_ion_nomination');
            gInspireRequest.addNotNullQuery('u_incidents');
            gInspireRequest.chooseWindow(start, end);
            gInspireRequest.query();
            var requests = [];
            while (gInspireRequest.next()) {
                var requestSysId = gInspireRequest.getValue('sys_id');
                requests.push(gInspireRequest.getValue('number'));
                gInspireRequest.getValue('u_incidents').split(',').forEach(function (incSysId) {
                    var gOpportunityRequest = new GlideRecord('u_m2m_ion_nominations_incidents');
                    gOpportunityRequest.initialize();
                    gOpportunityRequest.setWorkflow(false);
                    gOpportunityRequest.u_incident = incSysId;
                    gOpportunityRequest.u_ion_nomination = requestSysId;
                    gOpportunityRequest.update();
                });
            }
            gs.print(end + ' requests processed of ' + totalRequests + ': ' + requests.join(','));
        } while (end < totalRequests);
    }
})();