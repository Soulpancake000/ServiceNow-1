/**
 * @Name: Populate m2m opportunities
 * @Table: x_snc_ion_nomination
 * @FilterCondition: Opportunity Changes
 * @WhenToRun: After Insert, Update, Delete
 */
(function executeRule(current, previous /*null when async*/) {
    new AlignOpportunitiesToRequestHelper({
        request: current.sys_id,
        opportunities: current.opportunity,
        previous_opportunities: previous.opportunity
    }).updateM2MOpportunitiesRequest();
})(current, previous);