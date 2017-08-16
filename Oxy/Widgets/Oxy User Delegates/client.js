function UserDelegatesController($scope, spUtil, $filter) {
    /* widget controller */
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



    /* Implementations */
    function cancelAdd(){
        c.addMode = false;
        clearForm();
    }

    function addDelegate(){
        c.data.action = 'add_delegate';
        console.log(c.data.newDelegate);
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
        dateOut.setDate(dateOut.getDate() + 1);
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