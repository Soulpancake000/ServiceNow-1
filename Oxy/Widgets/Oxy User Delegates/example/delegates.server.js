(function tjxDelegates() {
  /* populate the 'data' object */
  /* e.g., data.table = $sp.getValue('table'); */
	data.sysUserID = $sp.getParameter("sys_id");
	data.delegates = [];
	if (!data.sysUserID)
         data.sysUserID = gs.getUser().getID();
	
	var userGr = new GlideRecord('sys_user');
	userGr.get(data.sysUserID);
	if (userGr.isValid()) {
		var mgr1 = userGr.manager;
		var mgr2 = userGr.manager.manager;
		var mgr3 = userGr.manager.manager.manager;
		data.armsQuery = 'sys_id='+mgr1+'^ORsys_id='+mgr2+'^ORsys_id='+mgr3;
	}
	
	var loggedInSysUserID = gs.getUser().getID();
	data.isLoggedInUsersProfile = loggedInSysUserID.equals(data.sysUserID);
	
	var tz = gs.getSession().getTimeZone();
	var now = new GlideDateTime();
	now.setTZ(tz);
	
	var grDelegates = new GlideRecord('sys_user_delegate');  
		grDelegates.addQuery('user', data.sysUserID);
		grDelegates.addQuery('ends', '>', now); 
		grDelegates.orderByDesc("sys_created_on");  
		//grDelegates.setlimit(1);
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
			starts: grDelegates.getValue("starts"),
			ends:  grDelegates.getValue("ends")
		};
		data.delegates.push(delegate);
	}
	
	if(input && input.action){
		switch(input.action){
				case 'add_delegate': 
					addDelegate(input.newDelegate);
				break;
				case 'remove_delegate':
					removeDelegate(input.removeDelegate);
				break;
		}
	}
	
	function removeDelegate(delegateId){
		var grDelegate = new GlideRecord('sys_user_delegate');
		grDelegate.get(delegateId);
		
		if(grDelegate.isValidRecord()){
			grDelegate.deleteRecord();
		}
	}
	
	function addDelegate(delegate){
		if(delegate == undefined){
			return false;
		}
		
		//var starts = new GlideDateTime(delegate.starts);
		//var ends = new GlideDateTime(delegate.ends);
		
		var grDelegateAdd = new GlideRecord('sys_user_delegate');
			grDelegateAdd.initialize();
			grDelegateAdd.user = data.sysUserID;
			grDelegateAdd.delegate = delegate.delegate;
			grDelegateAdd.starts = delegate.starts;
			grDelegateAdd.ends = delegate.ends;
			grDelegateAdd.approvals = delegate.approvals;
			grDelegateAdd.assignments = delegate.assignments;
			grDelegateAdd.notifications = delegate.notifications;
			grDelegateAdd.invitations = delegate.invitations;
			//custom fields	
			grDelegateAdd.u_arms_approval = delegate.u_arms_approval;
			grDelegateAdd.u_reason = delegate.u_reason;
		
			grDelegateAdd.insert();
	}	
})();