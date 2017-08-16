function UserDelegatesController($scope, spUtil, $filter, spModal) {
	/* widget controller */
	var DATE_FORMAT = "YYYY-MM-DD HH:MM:SS";
	var c = this;
	c.addMode = false;
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
	
	c.refDelegateField = {  
		displayValue: "",  
		value: "",  
		name: 'delegate'  
	};   
	
	c.startDateField = {  
		displayValue: "",  
		value: "",  
		name: 'start_date'  
	};
	
	c.endDateField = {  
		displayValue: "",  
		value: "",  
		name: 'start_date'  
	};  
	
	c.addDelegate = addDelegate;
	c.cancelAdd = cancelAdd;
	c.ARMSCheck = ARMSCheck;
	
	/* Implementations */
	function cancelAdd(){
		c.addMode = false;
		clearForm();
	}
	
	function ARMSCheck(arms){
		if(arms){
			c.refDelegateField = {  
				displayValue: $scope.user.manager_dv,  
				value: $scope.user.manager,
				name: 'name'
			};
			
			c.query = c.data.armsQuery;
		}else{
			c.query = '';
		}
	}
	
	function addDelegate(){
		c.data.action = 'add_delegate';
		c.data.newDelegate.starts = moment(c.data.newDelegate.starts)
																	.format(DATE_FORMAT)
																		.toString();
		
		c.data.newDelegate.ends = moment(c.data.newDelegate.ends)
																	.format(DATE_FORMAT)
																		.toString();
		
		c.server.update().then(function(){
			spUtil.update($scope);
	
			clearForm();
		});
	}
	
	function clearForm(){
		c.addMode = false;
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
		
		c.refDelegateField = {  
			displayValue: "",  
			value: "",  
			name: 'delegate'  
		};
		
		c.startDateField = {  
			displayValue: "",  
			value: "",  
			name: 'start_date'  
		}; 

		c.endDateField = {  
			displayValue: "",  
			value: "",  
			name: 'start_date'  
		};  
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
	
	$scope.$watch('c.data.newDelegate.starts', function(){
		if(c.data.newDelegate.ends != null && validate_Date(c.data.newDelegate.starts,c.data.newDelegate.ends) != 0)
			c.validDate = true;
		else
			c.validDate = false;
	});
	
	function validate_Date(StartDate,EndDate){
		var firstDate = Date.parse(StartDate);
		var SecondDate = Date.parse(EndDate);
		if(SecondDate <= firstDate)
			return 0;
		else
			return 1;
	}
	
	$scope.removeDelegate = function(delegate){
		spModal.confirm("${Want to remove this delegate?}")
		.then(function() {
			c.data.action = 'remove_delegate';
			c.data.removeDelegate = delegate.sys_id;
			c.server.update().then(function(){
				c.data.action = '';
				c.data.removeDelegate = null;
				spUtil.update($scope);
			});
		});
	}
	
	/* listeners */
	
	$scope.$on("field.change", function(evt, parms) {
		if (parms.field.name == 'delegate')  
			c.data.newDelegate.delegate = parms.newValue; 
	}); 
}