function UserSettingsController($scope, spUtil) {
    /* widget controller */
    var c = this;
    c.data.action = null;
    c.refFields = {
        communicationPreference:{
            displayValue: c.data.userSettings.communicationPreference,
            value: c.data.userSettings.communicationPreference,
            name: 'communication_preference'
        },
        language:{
            displayValue: c.data.userSettings.language,
            value: c.data.userSettings.language,
            name: 'language'
        },
        timezone:{
            displayValue: c.data.userSettings.timezone,
            value: c.data.userSettings.timezone,
            name: 'timezone'
        },
        location:{
            displayValue: c.data.userSettings.locationDisplayValue,
            value: c.data.userSettings.location,
            name: 'location'
        }
    };

    /* Listeners */
    $scope.$on("field.change", function(evt, parms) {
        if (parms.field.name == 'communication_preference')
            c.data.userSettings.communicationPreference = parms.newValue;
        if (parms.field.name == 'language')
            c.data.userSettings.language = parms.newValue;
        if (parms.field.name == 'timezone')
            c.data.userSettings.timezone = parms.newValue;
        if (parms.field.name == 'location')
            c.data.userSettings.location = parms.newValue;

        c.data.action = 'update';
        c.server.update().then(function(response) {
            c.data.action = null;
            spUtil.update($scope);
        });
    });


    console.log("c.data.isLoggedInUsersProfile",c.data.isLoggedInUsersProfile)

}