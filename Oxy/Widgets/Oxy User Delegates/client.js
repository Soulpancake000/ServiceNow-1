function UserDelegatesController($scope, spUtil, $filter, spModal) {
    /* widget controller */
    var c = this;
    c.addMode = false;
    c.editMode = false;
    c.data.action = null;

    // on data for server input read
    c.data.newDelegate = {
        delegate:'',
        starts:null,
        ends:null,
        approvals:false,
        assignments:false,
        notifications:false,
        invitations:false
    };

    c.refDelegateField = {displayValue: "", value: "", name: 'delegate'};
    c.startDateField   = {displayValue: "", value: "", name: 'start_date'};
    c.endDateField     = {displayValue: "", value: "", name: 'end_date'};

    c.addDelegate = addDelegate;
    c.cancelAdd = cancelAdd;
    c.editDelegate = editDelegate;
    c.removeDelegate = removeDelegate;
    c.setEditMode = setEditMode;

    /* Implementations */
    function setEditMode(delegate) {
        c.addMode = true;
        c.editMode = true;
        c.refDelegateField.displayValue = delegate.delegate;
        c.refDelegateField.value = delegate.delegate_id;
        c.data.newDelegate = {
            sys_id: delegate.sys_id,
            delegate: delegate.delegate_id,
            starts: delegate.starts,
            ends: delegate.ends,
            approvals: delegate.approvals,
            assignments: delegate.assignments,
            notifications: delegate.notifications,
            invitations: delegate.invitations
        };
        var startDate = new Date(delegate.starts);
        var endDate = new Date(delegate.ends);
        c.data.newDelegate.starts = startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString();
        c.data.newDelegate.ends = endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString();
    }

    function cancelAdd(){
        clearForm();
    }

    function addDelegate(){
        c.data.action = 'add_delegate';
        c.server.update().then(function(){
            spUtil.update($scope);
            clearForm();
        });
    }

    function editDelegate() {
        c.data.action = 'edit_delegate';
        c.server.update().then(function () {
            spUtil.update($scope);
            clearForm();
        });
    }

    function removeDelegate(delegate) {
        spModal.confirm("${Want to remove this delegate?}")
            .then(function () {
                c.data.action = 'remove_delegate';
                c.data.removeDelegate = delegate.sys_id;
                c.server.update().then(function () {
                    c.data.action = '';
                    c.data.removeDelegate = null;
                    spUtil.update($scope);
                });
            });
    }

    function clearForm(){
        c.addMode = false;
        c.editMode = false;
        c.data.action = null;

        c.data.newDelegate = {
            delegate:'',
            starts:null,
            ends:null,
            approvals:false,
            assignments:false,
            notifications:false,
            invitations:false
        };

        c.refDelegateField = {displayValue: "", value: "", name: 'delegate'};
        c.startDateField   = {displayValue: "", value: "", name: 'start_date'};
        c.endDateField     = {displayValue: "", value: "", name: 'end_date'};
    }
    c.convertToDate = function (stringDate){
        var dateOut = new Date(stringDate);
        dateOut.setDate(dateOut.getDate());
        return dateOut;
    };

    c.validDate = false;
    $scope.$watch('c.data.newDelegate.ends',function(){
        if(c.data.newDelegate.ends != null && validate_Date(c.data.newDelegate.starts,c.data.newDelegate.ends) != 0)
            c.validDate = true;
        else
            c.validDate = false;

    });
    $scope.$watch('c.data.newDelegate.starts',function(){
            if(c.data.newDelegate.ends != null && validate_Date(c.data.newDelegate.starts,c.data.newDelegate.ends) != 0)
                c.validDate = true;
            else
                c.validDate = false;
        }

    );
    function validate_Date(StartDate,EndDate)
    {
        var firstDate = Date.parse(StartDate);
        var SecondDate = Date.parse(EndDate);
        if(SecondDate <= firstDate)
            return 0;
        else
            return 1;
    }
    /* listeners */

    $scope.$on("field.change", function(evt, parms) {
        if (parms.field.name == 'delegate')
            c.data.newDelegate.delegate = parms.newValue;
    });
}