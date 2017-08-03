/**
 * @filterCondition: on Incidents Changes
 * @WhenToRun: After Insert, Update, Delete
 */
(function executeRule(current, previous /*null when async*/) {
    gs.addInfoMessage(current.operation() + '-' + current.u_incidents + '-' + previous.u_incidents);
    // validation to do nothing when business rule of m2m table is in place
    // if is triggered by nominations table then
    // update: currentI != previousI
    // delete: current = null && previousI = null
    // create: current = something && previous = something
    var alignIncidentsToRequests = new AlignIncidentsToRequest({
        request: current.sys_id,
        previous_incidents: previous.u_incidents,
        incidents: current.u_incidents
    });
    alignIncidentsToRequests.deleteM2MIncidents();
    alignIncidentsToRequests.updateM2MIncidentsRequest();
})(current, previous);