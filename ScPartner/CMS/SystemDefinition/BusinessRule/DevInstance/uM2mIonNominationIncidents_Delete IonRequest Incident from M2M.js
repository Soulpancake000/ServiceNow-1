/**
 * @filterCondition: None
 * @whenToRun: Before Delete
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignIncidentsToRequest({request: current.u_ion_nomination}).removeRequestFromIonRequest(previous.u_incident);
})(current, previous);