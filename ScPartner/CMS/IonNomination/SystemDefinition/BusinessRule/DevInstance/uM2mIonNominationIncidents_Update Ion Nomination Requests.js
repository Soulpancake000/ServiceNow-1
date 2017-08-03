/**
 * @filterCondition: None
 * @whenToRun: After Insert, Update
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    var alignIncidentsToRequest = new AlignIncidentsToRequest({request: current.u_ion_nomination});

    // gs.addInfoMessage('UPDATE/CREATE M2M ' + current.operation() + '-'
    //     + alignIncidentsToRequest.getIonRequestNumber(current.u_ion_nomination) + '-'
    //     + alignIncidentsToRequest.getIonRequestNumber(previous.u_ion_nomination) + '-'
    //     + alignIncidentsToRequest.getIncidentNumber(current.u_incident) + '-'
    //     + alignIncidentsToRequest.getIncidentNumber(previous.u_incident));

    alignIncidentsToRequest.updateRequestIncidentsFromM2MIncidents();
})(current, previous);