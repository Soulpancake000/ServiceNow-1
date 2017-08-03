/**
 * @descriptoin: Used in business rules to maintain Incidents integrity between M2M table and IonRequests
 */
var AlignIncidentsToRequest = Class.create();
AlignIncidentsToRequest.prototype = {
    initialize: function (options) {
        for (var att in options) {
            this[att] = options[att];
        }
    },

    updateM2MIncidentsRequest: function () {
        var request = this.request;
        this.incidents.split(',').forEach(function (sysIdInc) {
            var glideIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
            glideIncNom.initialize();
            glideIncNom.u_incident = sysIdInc;
            glideIncNom.u_ion_nomination = request;
            glideIncNom.insert();
        });
    },
    deleteM2MIncidents: function () {
        var glideIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
        glideIncNom.addEncodedQuery('u_ion_nomination=' + this.request);

        /**
         * It will remove only the incidents in the referenced field in Nomination Table.
         * Meaning that, if an incident was added outside the List reference field (in Incident Form)
         * or the Glide List (in the record producer) it won't be deleted.
         *  + '^' + 'u_incidentIN' + this.previous_incidents);
         */
        glideIncNom.deleteMultiple();
    },

    updateRequestIncidentsFromM2MIncidents: function () {
        var gIonNomination = new GlideRecord('u_ion_nomination');
        gIonNomination.addQuery('sys_id', this.request);
        gIonNomination.query();
        gIonNomination.next(); //should be only one record
        gIonNomination.u_incidents = this._getM2MIncidentsByRequest().join(',');
        gIonNomination.update('Updated because u_m2m_ion_nominations_incidents table changed');
    },


    _getM2MIncidentsByRequest: function () {
        var gIncidentNomination = new GlideRecord('u_m2m_ion_nominations_incidents');
        gIncidentNomination.addQuery('u_ion_nomination', this.request);
        gIncidentNomination.query();
        var incidents = [];
        while (gIncidentNomination.next())
            incidents.push(gIncidentNomination.getValue('u_incident'));
        return incidents;
    },

    removeRequestFromIonRequest: function (incidentToRemove) {
        var gIonNomination = new GlideRecord('u_ion_nomination');
        gIonNomination.addQuery('sys_id', this.request);
        gIonNomination.query();
        gIonNomination.next();
        var incidents = gIonNomination.getValue('u_incidents').split(',').filter(function (incident) {
            return incident != incidentToRemove;
        });
        gs.addInfoMessage(incidents.join(','));
        gIonNomination.u_incidents = incidents.join(',');
        gIonNomination.update();
    },
    type: 'AlignIncidentsToRequest'
};

/*
 Options:
 a) create other business rule before delete to update it too.
 b) change all to a workflow
 */