// Get all records from ion requests
var ionRequestsTable = 'u_ion_nomination', m2mTable = 'u_m2m_ion_nominations_incidents';

// Omit the records that are already in m2m table
var gM2mRecord = new GlideRecord(m2mTable);
gM2mRecord.deleteMultiple();

// populate m2m table.
var gAggCount = new GlideAggregate(ionRequestsTable);
gAggCount.addAggregate('COUNT');
gAggCount.query();
var totalRequests = gAggCount.next() ? gAggCount.getAggregate('COUNT') : 0;
var batchSize = 100;
var page = 0;
do {
    var start = 0 + (page * batchSize);
    var end = batchSize + (page++ * batchSize);

    gRequest = new GlideRecord(ionRequestsTable);
    gRequest.addNotNullQuery('u_incidents');
    gRequest.chooseWindow(start, end);
    gRequest.query();
    var requests = [];
    while (gRequest.next()) {
        var requestSysId = gRequest.getValue('sys_id');
        requests.push(gRequest.getValue('number'));
        gRequest.getValue('u_incidents').split(',').forEach(function (incSysId) {
            var gM2mRecord = new GlideRecord(m2mTable);
            gM2mRecord.initialize();
            gM2mRecord.u_incident = incSysId;
            gM2mRecord.u_ion_nomination = requestSysId;
            gM2mRecord.update();
        });
    }
    gs.print(end + ' requests processed of ' + totalRequests + ': ' + requests.join(','));

} while (end < totalRequests);