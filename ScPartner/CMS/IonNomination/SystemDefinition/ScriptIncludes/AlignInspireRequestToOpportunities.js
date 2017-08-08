/**
 * @name: AlignOpportunitiesToRequestHelper
 * @ClientCallable: No
 * @AccessibleFrom: All Scopes
 * @Descriptoin: Used to maintain opportunities sync between M2M table and IonRequests
 */
var AlignOpportunitiesToRequestHelper = Class.create();
AlignOpportunitiesToRequestHelper.prototype = {
    initialize: function (options) {
        for (var att in options) {
            if (!this.hasOwnProperty(att)) {
                this[att] = options[att];
            }
        }
    },

    updateM2MOpportunitiesRequest: function () {
        //Delete M2M records that aren't in InspireRequest
        // We are not using deleteMultiple() because we don't want that Glide trigger the business rules on delete.
        // For that reason, we are setting setWorkflow(false)
        var gOpportunityRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
        gOpportunityRequest.setWorkflow(false);
        gOpportunityRequest.addEncodedQuery('u_inspire_requests=' + this.request + '^u_opportunityNOT IN' + this.opportunities);
        gOpportunityRequest.query();
        while (gOpportunityRequest.next()) {
            gOpportunityRequest.deleteRecord();
        }

        // Insert the missing incidents in M2M table
        var request = this.request;
        var previous_opportunities = this.previous_opportunities;
        this.opportunities.split(',').forEach(function (oppSysId) {
            //if the record is new, insert it in M2M
            if (previous_opportunities.indexOf(oppSysId) === -1 || previous_opportunities.indexOf(oppSysId) === undefined) {
                var gOpportunityRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
                gOpportunityRequest.initialize();
                gOpportunityRequest.setWorkflow(false);
                gOpportunityRequest.u_opportunity = oppSysId;
                gOpportunityRequest.u_inspire_requests = request;
                gOpportunityRequest.insert();
            }
        });
    },

    getOpportunityNumber: function (id) {
        var gr = new GlideRecord('sales_opportunity');
        gr.addEncodedQuery('sys_id=' + id);
        gr.query();
        gr.next();
        return gr.getValue('number') + ' id:' + id;
    },

    /**
     * Reference Qualifier: javascript: new AlignOpportunitiesToRequestHelper({request: current.u_inspire_requests, opportunity: current.u_opportunity}).getOppReferenceQualOfM2MOppReq()
     * Return only the opportunities:
     *  - aligned to the InspireRequest selected
     *  - and not selected already in the InspireRequest record
     *  - and the previous opportunity selected
     * @param ionNominationId
     * @returns {string}
     */
    getOppReferenceQualOfM2MOppReq: function () {
        var gInspireRequest = new GlideRecord('x_snc_ion_nomination');
        gInspireRequest.get(this.request);
        return !this.request ? 'account=NORESULTS' :
            //- aligned to the InspireRequest selected
            'account=' + gInspireRequest.getValue('account') +
            //- that are not selected already in the InspireRequest record
            '^sys_idNOT IN' + this._getM2MOpportunitiesAlignedToRequest().join(',') +
            '^ORsys_id=' + this.opportunity;
    },

    updateInspireRequestOpportunities: function () {
        var gInspireRequest = new GlideRecord('x_snc_ion_nomination');
        gInspireRequest.setWorkflow(false);
        gInspireRequest.addQuery('sys_id', this.request);
        gInspireRequest.query();
        gInspireRequest.next(); //should be only one record
        gInspireRequest.opportunity = this._getM2MOpportunitiesAlignedToRequest().join(',');
        gInspireRequest.update('Updated because u_m2m_opportunitie_inspire_requ table changed');
    },

    _getM2MOpportunitiesAlignedToRequest: function () {
        var gOpportunityRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
        gOpportunityRequest.addQuery('u_inspire_requests', this.request);
        gOpportunityRequest.query();
        var opportunities = [];
        while (gOpportunityRequest.next())
            opportunities.push(gOpportunityRequest.getValue('u_opportunity'));
        return opportunities;
    },

    /**
     * Remove an opportunity from a InspireRequest record
     * @param opportunityToRemove
     */
    removeOpportunityFromInspireRequest: function (opportunityToRemove) {
        var gInspireRequest = new GlideRecord('x_snc_ion_nomination');
        gInspireRequest.setWorkflow(false);
        gInspireRequest.addQuery('sys_id', this.request);
        gInspireRequest.query();
        gInspireRequest.next();
        gInspireRequest.opportunity = gInspireRequest.getValue('opportunity').split(',')
            .filter(function (opportunity) {
                return opportunity != opportunityToRemove;
            }).join(',');
        gInspireRequest.update();
    },
    type: 'AlignOpportunitiesToRequestHelper'
};