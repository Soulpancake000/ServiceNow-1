(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    data.sysUserID = $sp.getParameter("sys_id");
    data.delegates = [];
    if (!data.sysUserID)
        data.sysUserID = gs.getUser().getID();



    var loggedInSysUserID = gs.getUser().getID();
    data.isLoggedInUsersProfile = loggedInSysUserID.equals(data.sysUserID);


    var grDelegates = new GlideRecord('sys_user_delegate');
    grDelegates.addQuery('user', data.sysUserID);
    grDelegates.orderByDesc("sys_created_on");
    grDelegates.chooseWindow(0, 3);
    grDelegates.query();

    while(grDelegates.next()) {
        var delegate = {
            sys_id:grDelegates.sys_id.getDisplayValue(),
            delegate:grDelegates.delegate.getDisplayValue(),
            user:{
                sys_id:grDelegates.delegate.sys_id.getDisplayValue(),
                fullName:grDelegates.delegate.name.getDisplayValue(),
                firstName:grDelegates.delegate.first_name.getDisplayValue(),
                lastName:grDelegates.delegate.last_name.getDisplayValue(),
                photo:grDelegates.delegate.photo.getDisplayValue()
            },
            starts: grDelegates.starts.getDisplayValue(),
            ends:  grDelegates.ends.getDisplayValue(),
            delegate_id: grDelegates.getValue('delegate'),
            invitations: grDelegates.getValue('invitations') === "1",
            approvals: grDelegates.getValue('approvals') === "1",
            assignments: grDelegates.getValue('assignments') === "1",
            notifications: grDelegates.getValue('notifications') === "1"
        };
        data.delegates.push(delegate);
    }

    if (input && input.action) {
        switch (input.action) {
            case 'add_delegate':
                addDelegate(input.newDelegate);
                break;
            case 'remove_delegate':
                removeDelegate(input.removeDelegate);
                break;
            case 'edit_delegate':
                editDelegate(input.newDelegate);
                break;
        }
    }

    function removeDelegate(delegateId) {
        var grDelegate = new GlideRecord('sys_user_delegate');
        grDelegate.get(delegateId);
        if (grDelegate.isValidRecord()) {
            grDelegate.deleteRecord();
        }
    }

    function addDelegate(delegate){
        if(delegate === undefined){
            return false;
        }

        var grDelegateAdd = new GlideRecord('sys_user_delegate');
        grDelegateAdd.initialize();
        grDelegateAdd.user = data.sysUserID;
        grDelegateAdd.delegate = delegate.delegate;
        grDelegateAdd.starts = new GlideDateTime().setValue((delegate.starts.getDisplayValue()));
        grDelegateAdd.ends = new GlideDateTime().setValue((delegate.ends.getDisplayValue()));
        grDelegateAdd.approvals = delegate.approvals;
        grDelegateAdd.assignments = delegate.assignments;
        grDelegateAdd.notifications = delegate.notifications;
        grDelegateAdd.invitations = delegate.invitations;

        grDelegateAdd.insert();
    }

    function editDelegate(delegate){
        if(delegate === undefined){
            return false;
        }
        var grDelegateEdit = new GlideRecord('sys_user_delegate');
        grDelegateEdit.get(delegate.sys_id);
        grDelegateEdit.delegate = delegate.delegate;
        // grDelegateEdit.starts = new GlideDateTime().setValue((delegate.starts.getDisplayValue()));
        // grDelegateEdit.ends = new GlideDateTime().setValue((delegate.ends.getDisplayValue()));
        grDelegateEdit.approvals = delegate.approvals;
        grDelegateEdit.assignments = delegate.assignments;
        grDelegateEdit.notifications = delegate.notifications;
        grDelegateEdit.invitations = delegate.invitations;
        grDelegateEdit.update();
    }
})();