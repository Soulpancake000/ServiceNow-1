/**
 * @filterCondition: on Incidents Changes
 * @WhenToRun: Insert, Update, Delete
 */
(function executeRule(current, previous /*null when async*/) {
    gs.addInfoMessage(current.operation());
    var alignIncidentsToRequests = new AlignIncidentsToRequest({
        request: current.sys_id,
        previous_incidents: previous.u_incidents,
        incidents: current.u_incidents
    });
    alignIncidentsToRequests.deleteM2MIncidents();
    alignIncidentsToRequests.updateM2MIncidentsRequest();
})(current, previous);