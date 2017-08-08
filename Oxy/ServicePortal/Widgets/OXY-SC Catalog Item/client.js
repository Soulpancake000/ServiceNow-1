function($scope, $http, spUtil, nowAttachmentHandler, $rootScope, $sanitize, $window, $sce, $location) {
    var c = this;
    $scope.buttons = true;
    c.quantity = 1;
    $scope.data.sc_cat_item.description = $sce.trustAsHtml($scope.data.sc_cat_item.description);
    c.addToFavorites = addToFavorites;
    c.removeFavorite = removeFavorite;
    console.log('data',c.data.sys_id);

    //MOD: instance options are not saving
    c.data.showPrices = false;

    c.showAddCartBtn = function() {
        return c.options.show_add_cart_button &&
            c.data.sc_cat_item.sys_class_name !== "sc_cat_item_producer" &&
            !c.data.sc_cat_item.no_cart;
    }

    c.showQuantitySelector = function() {
        return c.data.sc_cat_item.sys_class_name !== "sc_cat_item_producer" &&
            !c.data.sc_cat_item.no_quantity;
    }

    //Receives widget info from user change
    $rootScope.$on('requestedFor.change', function(event, data) {
        try {
            g_form.setValue('requested_for', data.sys_id);
            g_form.setValue('manager', data.manager);
            g_form.setValue('location', data.location);
            g_form.setValue('user_id', data.user_id);
            g_form.setValue('u_communication_preference', 'Email');
        } catch (error) {}
    })

    //Receives
    $rootScope.$on('contactMeBy.change', function(event, data) {
        try {
            g_form.setValue('u_communication_preference', data.id);
        } catch (error) {}
    })

    $rootScope.$on('changeinfo.change', function(event, data) {
        try {
            g_form.setValue('callback_number', data);
        } catch (error) {}
    })

    $scope.$on('dialog.upload_too_large.show', function(e) {
        spUtil.addErrorMessage($scope.m.largeAttachmentMsg);
    });

    $scope.m = $scope.data.msgs;
    $scope.submitButtonMsg = $scope.m.submitMsg;
    var ah = $scope.attachmentHandler = new nowAttachmentHandler(setAttachments, function() {});
    ah.setParams('sp_portal', $scope.data._attachmentGUID, 1024 * 1024 * 24);

    function setAttachments(attachments, action) {
        $scope.attachments = attachments;
    }

    $scope.attachmentHandler.getAttachmentList();

    $scope.confirmDeleteAttachment = function(attachment, $event) {
        $rootScope.$broadcast("dialog.delete_attachment.show", {
            parms: {
                ok: function() {
                    $scope.attachmentHandler.deleteAttachment(attachment);
                    $rootScope.$broadcast("dialog.delete_attachment.close");
                },
                cancel: function() {
                    $rootScope.$broadcast("dialog.delete_attachment.close");
                },
                details: attachment.name
            }
        })
    }

    if(c.data.modalUrl && c.data.modalUrl != "" ){
        var ok = function(){

        };
        var dismiss = function(x){
            if (x){window.location.href = window.location.origin + '/it?id=oxy_sc_home'}
        };

        $rootScope.$broadcast("oxy.modal.iframe", {
            url:c.data.modalUrl,
            ok:ok,
            dismiss:dismiss
        })
    }



    // Breadcrumbs
    if ($scope.data.sc_cat_item) {
        var bc = [{
            label: $scope.page.title,
            url: '?id=' + $scope.data.sc_catalog_page
        }];
        if ($scope.data.category)
            bc[bc.length] = {
                label: $scope.data.category.name,
                url: $scope.data.category.url
            };

        bc[bc.length] = {
            label: $scope.data.sc_cat_item.name,
            url: '#'
        };
        $rootScope.$broadcast('sp.update.breadcrumbs', bc);
        spUtil.setSearchPage('sc');
    }

    var g_form;
    $scope.$on('spModel.gForm.initialized', function(e, gFormInstance) {
        g_form = gFormInstance;

        // This runs after all onSubmit scripts have executed
        g_form.$private.events.on('submitted', function() {
            if ($scope.data.sc_cat_item.item_action === "order")
                getOne();
            else if ($scope.data.sc_cat_item.item_action === "add_to_cart")
                addToCart();
        });
    });

    $scope.triggerAddToCart = function() {
        $scope.data.sc_cat_item.item_action = "add_to_cart";
        $scope.data.sc_cat_item.requested_for =  g_form.getValue('requested_for');
        $scope.data.sc_cat_item.quantity = c.quantity;
        if (g_form)
            g_form.submit();
    }

    $scope.triggerOnSubmit = function() {
        //$scope.submitted = true;
        $scope.data.sc_cat_item.item_action = "order";
        $scope.data.sc_cat_item.requested_for =  g_form.getValue('requested_for');
        $scope.data.sc_cat_item.quantity = c.quantity;
        if (g_form){
            g_form.save();
        }

    }

    // order / create request
    function getOne() {
        postCatalogFormRequest().success(function(response) {
            var a = response.answer;
            var n = a.number;
            $scope.$emit("$$uiNotification", response.$$uiNotification);
            $scope.$emit("$sp.sc_cat_item.submitted", a);
            if (n)
                issueMessage(n, a.table, a.sys_id);
            $scope.submitting = false;
            $scope.submitButtonMsg = $scope.m.submittedMsg;

            if(c.data.userID!= g_form.getValue('requested_for')){
                c.data.action = 'changeReqFor';
                c.data.reqFor =  g_form.getValue('requested_for');
                c.data.reqId=a.sys_id;

                c.server.update().then(function() {
                    c.data.action = undefined;
                });

            }

            $location.path('/it').search({id: 'oxy_confirmation', sys_id:a.sys_id});
        });
    }

    function addToCart() {
        postCatalogFormRequest().success(function(response) {
            var a = response.answer;

            c.data.action = 'changeCartReqFor';
            c.data.reqFor =  g_form.getValue('requested_for');
            c.data.cartItemId = a.sys_id;

            c.server.update().then(function() {
                c.data.action = undefined;
            });

            $rootScope.$broadcast("$sp.service_catalog.cart.add_item");
            $rootScope.$broadcast("$sp.service_catalog.cart.update");
            //spUtil.addInfoMessage("Added item to shopping cart");
            $scope.submitting = false;
        });
    }

    function postCatalogFormRequest() {
        setFieldsReadonly();
        $scope.submitted = true;
        $scope.submitting = true;
        var t = $scope.data.sc_cat_item;


        t._attachmentGUID = $scope.data._attachmentGUID;
        // calls into SPCatalogForm.getItem()
        return $http.post(spUtil.getURL('sc_cat_item'), t);
    }

    // spModel populates mandatory - hasMandatory is called by the submit button
    $scope.hasMandatory = function(mandatory) {
        return mandatory && mandatory.length > 0;
    };

    // switch catalog items
    var unregister = $scope.$on('$sp.list.click', onListClick);

    $scope.$on("$destroy", function() {
        unregister();
    });

    $scope.shouldPullRight = function (a,b,c,d) {
        console.log(a,b,c,d)
    };

    function onListClick(evt, arg) {
        $scope.data.sys_id = arg.sys_id;
        spUtil.update($scope);
    }

    function setFieldsReadonly() {
        var allFields = g_form.getFieldNames();
        for (var fieldName in allFields) {
            g_form.setReadOnly(allFields[fieldName], true);
        }
    }

    function issueMessage(n, table, sys_id) {
        var page = table == 'sc_request' ? 'sc_request' : 'ticket';
        if (c.options.page) {
            page = c.options.page;
        }
        if (c.options.table) {
            table = c.options.table;
        }
        var url = spUtil.format(c.options.url, {
            page: page,
            table: table,
            sys_id: sys_id
        });
        if (c.options.auto_redirect == "true") {
            $window.location.href = url;
            return;
        }

        var t = $scope.m.createdMsg + " " + n + " - ";
        t += $scope.m.trackMsg;
        t += ' <a href="' + url + '">' + $scope.m.clickMsg + '</a>';
        //spUtil.addInfoMessage(t);
    }

    function addToFavorites() {
        c.data.action = 'addFavorite';
        c.data.favorites.addFavorite.error = null;

        c.server.update().then(function() {
            c.data.action = undefined;
        });
    }

    function removeFavorite() {
        c.data.action = 'deleteFavorite';
        c.data.favorites.removeFavorite.item_id = c.data.sys_id;

        c.server.update().then(function() {
            c.data.action = undefined;
        });


        request.favorite = false;
    }

    function reportProblem() {
        return false;
    }

    function fieldsHack(){
        //MOD: custom fields in catalog item
        console.log(c.data.sc_cat_item);
        var cit = c.data.sc_cat_item;

        //Find test_location field name in model
        var testLocationName = "";
        Object.keys(cit._fields).forEach(function(fn){
            var f = cit._fields[fn];
            if(f.variable_name == "test_location"){
                testLocationName = f.name;
            }
        });

        //build custom checkbox fields
        var checkboxes = ["test","test2", "test3"];

        checkboxes = checkboxes.map(function(f){
            return fieldFactory(f);
        });

        var fields = checkboxes.map(function(f){
            cit._fields[f.name] = f;
            return {
                name: f.name,
                type: "field"
            };
        });

        var flag = false;
        //	debugger;


        var helpTextElement = getObjects(cit._sections, "name","IO:662570d86f291900bfe59be44b3ee492")[0];
        if(typeof(helpTextElement) != 'undefined')
        {
            helpTextElement.variable_set_title = helpTextElement.name;
            var rawFields = cit._fields;
            var helpText = "";
            if(typeof(rawFields["IO:a4e6a3cc0f5af6005acc1d2be1050eed"]) != 'undefined'){
                helpText = rawFields["IO:a4e6a3ca4e6a3cc0f5af6005acc1d2be1050eed"].help_text;
            }

            setTimeout(function(){
                $( "div.h4:contains('IO:662570d86f291900bfe59be44b3ee492')" ).html(helpText).addClass("alert alert-info");
            },1500);


        }











        function fieldFactory(label){
            var id = genUID();
            var field = {
                catalogFieldName : id,
                choice : 0,
                guide_implications : false,
                isMandatory : function (){
                    return false;
                },
                isReadonly : function (){
                    return false;
                },
                label : label,
                mandatory_filled : function hasValue(){
                    return true
                },
                name : id,
                stagedValue : "",
                type : "boolean",
                value : "",
                variable_name : label,
                visible : true,
                _cat_variable : true,
                _class_name : "CheckBoxQuestion",
                _pricing : {}
            };

            return field;
        }

        function genUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

    }

    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }



    fieldsHack();
}
