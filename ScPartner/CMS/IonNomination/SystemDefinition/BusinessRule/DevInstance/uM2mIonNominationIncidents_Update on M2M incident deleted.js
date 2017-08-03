/**
 * @filterCondition: None
 * @whenToRun: Before Delete
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    var alignIncidentsToRequest = new AlignIncidentsToRequest({request: current.u_ion_nomination});
    // gs.addInfoMessage('DELETE M2M ' + current.operation() + ' DELETING! -'
    //     + alignIncidentsToRequest.getIonRequestNumber(current.u_ion_nomination)
    //     + '-' + alignIncidentsToRequest.getIonRequestNumber(previous.u_ion_nomination)
    //     + '-' + alignIncidentsToRequest.getIncidentNumber(current.u_incident)
    //     + '-' + alignIncidentsToRequest.getIncidentNumber(previous.u_incident));
    alignIncidentsToRequest.removeRequestFromIonRequest(previous.u_incident);
})(current, previous);