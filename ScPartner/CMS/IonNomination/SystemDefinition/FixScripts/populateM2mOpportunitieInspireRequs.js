(function () {
    truncate();
    populate();

    function truncate() {
        // Omit the records that are already in m2m table
        var gInspireRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
        gInspireRequest.setWorkflow(false);
        while (gInspireRequest.next()) {
            gInspireRequest.deleteRecord();
        }
    }

    function populate() {
        var gAggCount = new GlideAggregate('x_snc_ion_nomination');
        gAggCount.addAggregate('COUNT');
        gAggCount.query();
        var totalRequests = gAggCount.next() ? gAggCount.getAggregate('COUNT') : 0;
        var batchSize = 100;
        var page = 0;
        do {
            var start = 0 + (page * batchSize);
            var end = batchSize + (page++ * batchSize);

            var gRequest = new GlideRecord('x_snc_ion_nomination');
            gRequest.addNotNullQuery('opportunity');
            gRequest.chooseWindow(start, end);
            gRequest.query();
            var requests = [];
            while (gRequest.next()) {
                var requestSysId = gRequest.getValue('sys_id');
                requests.push(gRequest.getValue('number'));
                gRequest.getValue('opportunity').split(',').forEach(function (incSysId) {
                    var gM2mRecord = new GlideRecord('u_m2m_opportunitie_inspire_requ');
                    gM2mRecord.initialize();
                    gM2mRecord.setWorkflow(false);
                    gM2mRecord.u_opportunity = incSysId;
                    gM2mRecord.u_inspire_requests = requestSysId;
                    gM2mRecord.update();
                });
            }
            gs.print(end + ' requests processed of ' + totalRequests + ': ' + requests.join(','));
        } while (end < totalRequests);
    }
})();