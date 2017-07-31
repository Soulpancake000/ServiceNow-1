/**
 * @filterCondition: on Incidents Changes
 * @whenToRun: After Insert, Update, Delete
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    deletePreviousIncidents();
    saveIncidents();

    function saveIncidents() {
        var incidents = current.u_incidents.split(',');
        incidents.forEach(function (sysIdInc) {
            var glideIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
            glideIncNom.initialize();
            glideIncNom.u_incident = sysIdInc;
            glideIncNom.u_ion_nomination = current.sys_id;
            glideIncNom.update();
        });
    }

    /**
     * It will remove only the incidents in the referenced field in Nomination Table.
     * Meaning that, if an incident was added outside the List reference field (in Incident Form)
     * or the Glide List (in the record producer) it won't be deleted.
     */
    function deletePreviousIncidents() {
        var glideIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
        glideIncNom.addEncodedQuery('u_ion_nomination=' + current.sys_id + '^' + 'u_incidentIN' + previous.u_incidents);
        glideIncNom.deleteMultiple();
    }
})(current, previous);