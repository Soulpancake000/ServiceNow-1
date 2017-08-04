/**
 * @descriptoin: Used in business rules to maintain Incidents integrity between M2M table and IonRequests
 */
var AlignIncidentsToRequest = Class.create();
AlignIncidentsToRequest.prototype = {
    initialize: function (options) {
        for (var att in options) {
            if (!this.hasOwnProperty(att)) {
                this[att] = options[att];
            }
        }
    },

    updateM2MIncidentsRequest: function () {
        gs.addInfoMessage('Populate m2m incidents from Ion');
        // Delete M2M records that aren't in IonRequest
        var gIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
        gIncNom.setWorkflow(false);
        gIncNom.addEncodedQuery('u_ion_nomination=' + this.request + '^u_incidentNOT IN' + this.incidents);
        gIncNom.query();
        //@TEST: Verify it will delete the correct ones, meaning that the M2M BR has already finished
        // and the incident has already removed from M2M table
        while (gIncNom.next()) {
            gs.addInfoMessage('it will delete ' + gIncNom.getDisplayValue('u_incident'));
            gIncNom.deleteRecord();
        }

        // Insert the missing incidents in M2M
        var request = this.request;
        var previous_incidents = this.previous_incidents;
        this.incidents.split(',').forEach(function (sysIdInc) {
            //if the record is new, insert it in M2M
            if (previous_incidents.indexOf(sysIdInc) === -1 || previous_incidents.indexOf(sysIdInc) === undefined) {
                gs.addInfoMessage('it will insert ' + sysIdInc + ' ' + this.getIncidentNumber(sysIdInc));
                var glideIncNom = new GlideRecord('u_m2m_ion_nominations_incidents');
                glideIncNom.initialize();
                glideIncNom.setWorkflow(false);
                glideIncNom.u_incident = sysIdInc;
                glideIncNom.u_ion_nomination = request;
                glideIncNom.insert();
            }
        });
    },

    getIonRequestNumber: function (id) {
        var gr = new GlideRecord('u_ion_nomination');
        gr.addQuery('sys_id', id);
        gr.query();
        gr.next();
        return gr.getValue('number') + ' id:' + id;
    },
    getM2MRequestNumber: function (id) {
        var gr = new GlideRecord('u_m2m_ion_nominations_incidents');
        gr.addQuery('sys_id', id);
        gr.query();
        gr.next();
        return gr.getValue('number') + ' id:' + id;
    },

    getIncidentNumber: function (id) {
        var gr = new GlideRecord('incident');
        gr.addEncodedQuery('sys_id=' + id);
        gr.query();
        gr.next();
        return gr.getValue('number') + ' id:' + id;
    },

    /**
     * Reference Qualifier: javascript: new AlignIncidentsToRequest({request: current.u_ion_nomination}).getIncidentM2MIonNomRefQual()
     * @param ionNominationId
     * @returns {string}
     */
    getIncidentM2MIonNomRefQual: function () {
        var gIon = new GlideRecord('u_ion_nomination');
        gIon.get(this.request);

        var refQualifier = this.request ?
            'assigned_to=' + gIon.getValue('assigned_to') + '^sys_idNOT IN' + this._getM2MIncidentsByRequest().join(',') :
            'assigned_to=NORESULTS';
        gs.addErrorMessage('XXXX' + refQualifier);

        return refQualifier;
    },

    updateRequestIncidentsFromM2MIncidents: function () {
        gs.addInfoMessage('UPDATE/CREATE M2M  ');
        var gIonNomination = new GlideRecord('u_ion_nomination');
        gIonNomination.setWorkflow(false);
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
        gs.addInfoMessage('DELETE M2M  ');
        var gIonNomination = new GlideRecord('u_ion_nomination');
        gIonNomination.setWorkflow(false);
        gIonNomination.addQuery('sys_id', this.request);
        gIonNomination.query();
        gIonNomination.next();
        var incidents = gIonNomination.getValue('u_incidents').split(',').filter(function (incident) {
            return incident != incidentToRemove;
        });
        gIonNomination.u_incidents = incidents.join(',');
        gIonNomination.update();
    },
    type: 'AlignIncidentsToRequest'
};