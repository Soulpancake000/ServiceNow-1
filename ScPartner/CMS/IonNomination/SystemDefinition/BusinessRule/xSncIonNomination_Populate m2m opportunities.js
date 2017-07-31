/**
 * @filterCondition: on Opportunities Changes
 * @whenToRun: After Insert, Update, Delete
 * @order: 100
 */
(function executeRule(current, previous /*null when async*/) {
    deletePreviousOpportunities();
    saveOpportunities();

    function saveOpportunities() {
        current.opportunity.split(',').forEach(function (oppSysId) {
            var m2mOpportunityRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
            m2mOpportunityRequest.initialize();
            m2mOpportunityRequest.u_opportunity = oppSysId;
            m2mOpportunityRequest.u_inspire_requests = current.sys_id;
            m2mOpportunityRequest.insert();
        });
    }

    /**
     * It will remove only the opportunities in the referenced field in x_snc_ion_nomination Table.
     * Meaning that, if an opportunity was added outside the List reference field (in Opportunity Form)
     * or the Glide List (in the record producer) it won't be deleted.
     */
    function deletePreviousOpportunities() {
        var m2mOpportunityRequest = new GlideRecord('u_m2m_opportunitie_inspire_requ');
        m2mOpportunityRequest.addEncodedQuery('u_inspire_requests=' + current.sys_id + '^' + 'u_opportunityIN' + previous.opportunity);
        m2mOpportunityRequest.deleteMultiple();
    }
})(current, previous);