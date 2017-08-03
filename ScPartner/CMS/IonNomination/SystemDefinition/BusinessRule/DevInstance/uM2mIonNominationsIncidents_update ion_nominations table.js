/**
 * @filterCondition: None
 * @whenToRun: After Insert, Update
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    gs.addErrorMessage(current.operation() + '-' + current.u_ion_nomination + '-' + previous.u_ion_nomination + '-' + current.u_incident + '-' + previous.u_incident);
    var alignIncidentsToRequest = new AlignIncidentsToRequest({request: current.u_ion_nomination});
    alignIncidentsToRequest.updateRequestIncidentsFromM2MIncidents();
})(current, previous);