/**
 * @filterCondition: None
 * @whenToRun: After Insert, Update
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignIncidentsToRequest({request: current.u_ion_nomination}).updateRequestIncidentsFromM2MIncidents();
})(current, previous);