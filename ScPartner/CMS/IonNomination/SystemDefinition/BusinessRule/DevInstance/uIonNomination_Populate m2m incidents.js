/**
 * @filterCondition: on Incidents Changes
 * @WhenToRun: Insert, Update, Delete
 */
(function executeRule(current, previous /*null when async*/) {
    // gs.addInfoMessage('Populate m2m incidents from Ion ' + current.number  + ' ' + current.operation() + '-' + current.u_incidents + '-' + previous.u_incidents);
    if (current.operation() === 'update' && current.u_incidents === previous.u_incidents) {
        return
    }
    var alignIncidentsToRequests = new AlignIncidentsToRequest({
        request: current.sys_id,
        previous_incidents: previous.u_incidents,
        incidents: current.u_incidents
    });
    // alignIncidentsToRequests.deleteM2MIncidents();
    alignIncidentsToRequests.updateM2MIncidentsRequest();
})(current, previous);