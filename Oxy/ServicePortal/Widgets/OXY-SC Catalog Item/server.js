// populate the 'data' variable with catalog item, variables, and variable view
(function OxySCCatalogItem() {
    data.favorites = {
        addFavorite: {},
        removeFavorite: {}
    };

    data.userID=gs.getUserID();

    var sysId = input.sys_id || $sp.getParameter("sys_id") || $sp.getParameter('sl_sys_id');
    data.sys_id = sysId;

    if (sysId) {
        switch (input.action) {
            case 'addFavorite': addFavorite(sysId); break;
            case 'deleteFavorite': deleteFavorite(input.favorites.removeFavorite.item_id); break;
        }
    }

    if(input.action && input.action=='changeReqFor' && input.reqFor && input.reqId)
        changeReqFor(input.reqId,input.reqFor);

    if(input.action && input.action=='changeCartReqFor' && input.reqFor && input.cartItemId)
        changeCartReqFor(input.cartItemId,input.reqFor);



    options.show_add_cart_button = true;

    if (options.page) {
        var pageGR = new GlideRecord("sp_page");
        options.page = (pageGR.get(options.page)) ? pageGR.getValue("id") : null;
    }

    if (options.table) {
        var tableGR = new GlideRecord("sys_db_object");
        options.table = (tableGR.get(options.table)) ? tableGR.getValue("name") : null;
    }

    options.url = options.url || "?id={page}&table={table}&sys_id={sys_id}";
    data.showPrices = $sp.showCatalogPrices();

    var m = data.msgs = {
        largeAttachmentMsg : gs.getMessage("Attached files must be smaller than {0} - please try again", "24MB"),
        trackMsg : gs.getMessage("track using 'Requests' in the header or"),
        dialogTitle : gs.getMessage("Delete Attachment"),
        clickMsg : gs.getMessage("click here to view"),
        dialogMessage : gs.getMessage("Are you sure?"),
        submitMsg : gs.getMessage("1-Click Order"),
        submittedMsg : gs.getMessage("Submitted"),
        dialogCancel : gs.getMessage("Cancel"),
        createdMsg : gs.getMessage("Created"),
        dialogOK : gs.getMessage("OK")
    };

    data._attachmentGUID = gs.generateGUID();
    // portal can specify a catalog home page
    data.sc_catalog_page = $sp.getDisplayValue("sc_catalog_page") || "sc_home";
    var validatedItem = new GlideappCatalogItem.get(sysId);

    if (!validatedItem.canView()) return;

    data.sc_cat_item = $sp.getCatalogItem(sysId);
    var itemRecord = new GlideRecord('sc_cat_item');


    itemRecord.get(sysId);
    data.automatedDelivery = itemRecord.u_automated.toString() == 'true';

    if(!itemRecord.u_application_instance.nil()){
        data.enhanceBtn = itemRecord.u_application_instance.u_er_enabled.toString() == 'true'
    }

    data.modalUrl = itemRecord.u_modal+""

    var isManagerApproval = itemRecord.u_manager_approval_required.toString() == 'true';
    var isGroupApproved = !itemRecord.u_group_approval.nil();

    var isOnlyManagerApproval = isManagerApproval && !isGroupApproved;

    var msg1 = "This item requires multiple levels of approval which could affect overall delivery time";
    var msg2 = "This item requires manager approval";

    m.approval = isOnlyManagerApproval ?  msg2 : msg1;

    if (data.sc_cat_item.category) {
        var categoryGR = new GlideRecord('sc_category');
        categoryGR.get(data.sc_cat_item.category);
        data.category = {
            name: categoryGR.getDisplayValue('title'),
            url: '?id=oxy_sc_category&sys_id=' + categoryGR.sys_id
        }
    }

    data.isFavorite = isFavorite(sysId);

    //$sp.logStat('Catalog View', data.sc_cat_item.sys_class_name, sysId, data.sc_cat_item.name);

    function addFavorite(sys_id) {
        if (sys_id) {
            var gr = new GlideRecord("u_oxy_my_favorites_products");

            gr.addQuery("u_user_id", gs.getUserID());
            gr.addQuery("u_active", true);
            gr.query();

            var count = gr.getRowCount();

            if (count < 6) {
                gr = new GlideRecord('u_oxy_my_favorites_products');
                gr.initialize();
                gr.u_user_id = gs.getUserID();
                gr.u_cat_item_id =sys_id;
                gr.u_active = true;
                gr.insert();
                data.favorites.addFavorite.success = "Your favorite product is saved";
            } else {
                data.favorites.addFavorite.error = "You can't add more than 6 products";
            }
        }
    }

    function deleteFavorite(sys_id) {
        if (sys_id) {
            var gr = new GlideRecord('u_oxy_my_favorites_products');
            gr.addQuery('u_cat_item_id',sys_id); //to delete one record
            gr.addQuery("u_user_id", gs.getUserID());
            gr.addQuery("u_active", true);
            gr.query();
            gr.next();
            gr.deleteRecord();
            data.favorites.removeFavorite.success = "Your favorite product has been removed";
        }
    }

    function isFavorite(sys_id){
        var gr = new GlideRecord('u_oxy_my_favorites_products');

        gr.addQuery('u_cat_item_id', sys_id);
        gr.addQuery("u_user_id", gs.getUserID());
        gr.addQuery("u_active", true);
        gr.query();

        var count = gr.getRowCount();

        return count > 0? true : false;
    }

    function changeReqFor(id, reqFor){
        var gr = new GlideRecord('sc_request');
        gr.get(id);
        gr.requested_for=reqFor;
        gr.update();
    }

    function changeCartReqFor(id, reqFor){
        var gr = new GlideRecord('sc_cart_item');
        gr.get(id);

        var cartId= gr.getValue('cart');
        var gg= new GlideRecord('sc_cart');
        gg.get(cartId);

        gg.requested_for=reqFor;
        gg.update();
    }




})();
