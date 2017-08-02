var AlignIncidentsToRequest = Class.create();
AlignIncidentsToRequest.prototype = {
    request: null,
    initialize: function (options) {
        for (var att in options)
            this[att] = options[att];
    },

    updateRequestIncidentsFromM2MIncidents: function () {
        this._getM2MIncidentsByRequest();
        this._updateIonRequest(this.request);
    },

    updateM2MIncidentsFromRequestIncidents: function () {
        this.deleteM2MIncidents(previous.u_incidents);
        this.updateM2MIncidentsRequest(current.u_incidents.split(','));
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

    _getM2MIncidentsByRequest: function () {
        var gIncidentNomination = new GlideRecord('u_m2m_ion_nominations_incidents');
        gIncidentNomination.addQuery('u_ion_nomination', this.request);
        gIncidentNomination.query();
        this.incidents = [];
        while (gIncidentNomination.next())
            this.incidents.push(gIncidentNomination.getValue('u_incident'));
    },

    _updateIonRequest: function () {
        var gIonNomination = new GlideRecord('u_ion_nomination');
        gIonNomination.addQuery('sys_id', this.request);
        gIonNomination.query();
        gIonNomination.next(); //should be only one record
        gIonNomination.u_incidents = this.incidents.join(',');
        gIonNomination.update('Updated because u_m2m_ion_nominations_incidents table changed');
    },

    type: 'AlignIncidentsToRequest'
};