/**
 * @Name Delete OpportunityInspireRequest from M2M
 * @Table: u_m2m_opportunitie_inspire_requ
 * @FilterCondition: None
 * @WhenToRun: Before Delete
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignOpportunitiesToRequestHelper({request: current.u_inspire_requests}).removeOpportunityFromInspireRequest(previous.u_opportunity);
})(current, previous);