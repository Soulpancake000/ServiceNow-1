(function () {
    enableBusinessRule('u_ion_nomination', false);
    enableBusinessRule('u_m2m_ion_nominations_incidents', false);
    clearsM2MTable();
    populateM2MTable();
    enableBusinessRule('u_ion_nomination', true);
    enableBusinessRule('u_m2m_ion_nominations_incidents', true);

    function enableBusinessRule(table, active) {
        var gBusinessRule = new GlideRecord('sys_script');
        gBusinessRule.addEncodedQuery('collection=' + table);
        gBusinessRule.query();
        while (gBusinessRule.next()) {
            gBusinessRule.active = active;
            gBusinessRule.update();
        }
    }

    function clearsM2MTable() {
        // Omit the records that are already in m2m table
        var gM2mRecord = new GlideRecord('u_m2m_ion_nominations_incidents');
        gM2mRecord.deleteMultiple();
    }

    function populateM2MTable() {
        var gAggCount = new GlideAggregate('u_ion_nomination');
        gAggCount.addAggregate('COUNT');
        gAggCount.query();
        var totalRequests = gAggCount.next() ? gAggCount.getAggregate('COUNT') : 0;
        var batchSize = 100;
        var page = 0;
        do {
            var start = 0 + (page * batchSize);
            var end = batchSize + (page++ * batchSize);

            var gRequest = new GlideRecord('u_ion_nomination');
            gRequest.addNotNullQuery('u_incidents');
            gRequest.chooseWindow(start, end);
            gRequest.query();
            var requests = [];
            while (gRequest.next()) {
                var requestSysId = gRequest.getValue('sys_id');
                requests.push(gRequest.getValue('number'));
                gRequest.getValue('u_incidents').split(',').forEach(function (incSysId) {
                    var gM2mRecord = new GlideRecord('u_m2m_ion_nominations_incidents');
                    gM2mRecord.initialize();
                    gM2mRecord.u_incident = incSysId;
                    gM2mRecord.u_ion_nomination = requestSysId;
                    gM2mRecord.update();
                });
            }
            gs.print(end + ' requests processed of ' + totalRequests + ': ' + requests.join(','));
        } while (end < totalRequests);
    }
})();