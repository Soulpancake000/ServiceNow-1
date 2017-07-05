function ($scope, spUtil, $location, $timeout) {
    var c = this;
    c.m = $scope.data.msgs;
    c.deliverTo = "";
    c.additionalDetails = "";
    c.options.cartTemplate = c.options.cartTemplate || 'oxy_large_shopping_cart.html';
    c.data.completion_date = c.data.completion_date.value ? moment().add(c.data.completion_date.value, c.data.completion_date.time).format('LL') : 'Unknown';

    $scope.$on("$sp.service_catalog.cart.update", function() {
        $scope.server.update().then(function() {
            $scope.$emit("$sp.service_catalog.cart.count", getItemCount());
            c.data.completion_date = c.data.completion_date.value ? moment().add(c.data.completion_date.value, c.data.completion_date.time).format('LL') : 'Unknown';
        });
    });

    c.updateQuantity = function(item) {
        c.server.get({
            action: "update_quantity",
            itemID: item.sys_id,
            quantity: item.quantity
        }).then(function(response) {
            $rootScope.$broadcast("$sp.service_catalog.cart.update");
        });
    }

    c.triggerCheckout = function($evt, twostepCheckout) {
        if (twostepCheckout) {
            $location.url('?id=oxy_sc_cart');
            return;
        }

        $evt.stopPropagation();
        $evt.preventDefault();

        c.checkoutInProgress = true;
        c.data.action = "checkout";
        c.data.deliverTo = c.deliverTo;
        c.data.additionalDetails = c.additionalDetails;
        c.server.update().then(function(response) {
            c.data.action = null;
            c.redirecting = true;
            c.checkoutInProgress = false;

            var requestData = $scope.data.requestData;

            $location.path('/it').search({
                id: 'oxy_confirmation',
                sys_id:requestData.sys_id
            });

            $rootScope.$broadcast("$sp.service_catalog.cart.update");
        });
    }

    c.removeItem = function($evt, item) {
        $evt.stopPropagation();
        $evt.preventDefault();

        $scope.server.get({
            cartName: "DEFAULT",
            action: "remove_item",
            removeItemID: item.sys_id
        }).then(function(response) {
            c.data.cart = response.data.cart;
            c.data.cartItems = response.data.cartItems
            $rootScope.$broadcast("$sp.service_catalog.cart.update");
        });
    }

    c.editItem = function(itemID) {
        c.server.get({
            itemID: itemID,
            action: "edit_item"
        }).then(function(response) {
            var myModalCtrl;
            var unregister = $scope.$on('$sp.service_catalog.cart.update', function(){
                myModalCtrl.close();
            });

            var myModal = angular.copy(response.data.editVariablesModal);
            myModal.options.afterOpen = function(ctrl){
                myModalCtrl = ctrl;
            };
            myModal.options.afterClose = function() {
                unregister();
                c.editVariablesModal = null;
                myModalCtrl = null;
            };
            c.editVariablesModal = myModal;
        })
    }

    c.saveBundle = function() {
        var saveCartModalCtrl;
        var unregister = $scope.$on('$sp.service_catalog.cart.save_cart', function(){
            saveCartModalCtrl.close();
        });

        var saveCartModal = angular.copy(c.data.saveCartModal);
        saveCartModal.options.afterOpen = function(ctrl){
            saveCartModalCtrl = ctrl;
        };
        saveCartModal.options.afterClose = function() {
            unregister();
            c.saveCartModal = null;
            saveCartModalCtrl = null;
        };
        c.saveCartModal = saveCartModal;
    }

    c.requestedFor = {
        displayValue: c.data.cart.requested_for_display_name,
        value: c.data.cart.requested_for,
        name: 'requested_for'
    };

    $scope.$on("field.change", function(evt, parms) {
        if (parms.field.name == 'requested_for')
            c.data.cart.requested_for = parms.newValue;
    });

    $scope.$emit("$sp.service_catalog.cart.count", getItemCount());

    function getItemCount() {
        return c.data.cartItems.length || 0;
    }
}
