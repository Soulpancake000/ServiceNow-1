/**
 * @Name Update OpportunityInspireRequest from M2M
 * @Table: u_m2m_opportunitie_inspire_requ
 * @FilterCondition: None
 * @WhenToRun: After Insert, Update
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignOpportunitiesToRequestHelper({request: current.u_inspire_requests}).updateInspireRequestOpportunities();
})(current, previous);