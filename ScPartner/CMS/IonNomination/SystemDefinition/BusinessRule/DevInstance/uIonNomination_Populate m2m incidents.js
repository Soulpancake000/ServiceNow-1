/**
 * @filterCondition: on Incidents Changes
 * @WhenToRun: Insert, Update, Delete
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignIncidentsToRequest({
        request: current.sys_id,
        previous_incidents: previous.u_incidents,
        incidents: current.u_incidents
    }).updateM2MIncidentsRequest();
})(current, previous);