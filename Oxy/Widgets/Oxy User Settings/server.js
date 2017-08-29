(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var sysUserGR = new GlideRecord("sys_user");
    data.sysUserID = gs.getUser().getID();
    data.userExists = sysUserGR.get(data.sysUserID);
    data.userSettings = {};

    if(data.userExists){

        var sysId = data.sysUserID = $sp.getParameter("sys_id");
        var loggedInSysUserID = gs.getUser().getID();
        data.isLoggedInUsersProfile = loggedInSysUserID.equals(sysId);


        data.userSettings = {
            communicationPreference:sysUserGR.u_communication_preference.getDisplayValue(),
            language:sysUserGR.u_preferred_language.getDisplayValue(),
            timezone:sysUserGR.time_zone.getDisplayValue(),
            location:sysUserGR.getValue('location'),
            locationDisplayValue:sysUserGR.location.getDisplayValue()
        };
    }

    if(input && input.action === 'update'){
        sysUserGR.u_communication_preference = input.userSettings.communicationPreference;
        sysUserGR.u_preferred_language = input.userSettings.language;
        sysUserGR.time_zone = input.userSettings.timezone;
        sysUserGR.location = input.userSettings.location;
        sysUserGR.update();
    }
})();