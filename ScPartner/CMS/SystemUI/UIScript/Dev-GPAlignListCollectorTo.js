/**
 * @ApiName:     GP-Align List Collector To A Referenced
 * @description: Align a List Collector variable in record producers to referenced value
 */
var GPAlignListCollectorTo = Class.create();
GPAlignListCollectorTo.prototype = {
    initialize: function (alignTo, listCollectorName, listCollectorGrTable, listCollectorDisplay, listCollectorValue) {
        this.alignTo = alignTo;
        this.listCollectorField = {
            name: listCollectorName,
            grTable: listCollectorGrTable,
            display: listCollectorDisplay,
            value: listCollectorValue
        };
        this.availableOptions = document.getElementById(this.listCollectorField.name + '_select_0');
        this.selectedOptions = document.getElementById(this.listCollectorField.name + '_select_1');
        window.gp_alignListCollector = window.gp_alignListCollector || {fetchedItems: {}};
    },
    initOnChange: function (control, oldValue, newValue, isLoading) {
        this.control = control;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.isLoading = isLoading;
    },
    fetchItems: function () {
        //Make sure we have a value in the filter field
        if (g_form.getValue(this.alignTo) === '') {
            return;
        }
        this.removeAvailableOptions();

        var fetchedItems = window.gp_alignListCollector.fetchedItems[g_form.getValue(this.alignTo)] || [];

        //If the item has been fetched already add the options
        if (fetchedItems.length) {
            for (var idx = 0; idx < fetchedItems.length; idx++) {
                this.availableOptions.append(fetchedItems[idx]);
            }
            return;
        }

        //If the item hasn't been fetched, fetch and save it in window variable
        var gr = new GlideRecord(this.listCollectorField.grTable);
        gr.addQuery(this.alignTo, g_form.getValue(this.alignTo));
        gr.orderBy(this.listCollectorField.display);
        gr.query();
        if (gr.hasNext()) {
            while (gr.next()) {
                var option = document.createElement('option');
                option.text = gr.getValue(this.listCollectorField.display);
                option.value = gr.getValue(this.listCollectorField.value);
                option.setAttribute('data-belongs-to', g_form.getValue(this.alignTo));
                fetchedItems.push(option);
                this.availableOptions.append(option);
            }
        }
        window.gp_alignListCollector.fetchedItems[g_form.getValue(this.alignTo)] = fetchedItems;
    },
    showOptions: function () {
        for (var idx = 0; idx < this.availableOptions.options.length; idx++) {
            var belongsTo = this.availableOptions.options[idx].getAttribute('data-belongs-to');
            this.availableOptions.options[idx].classList.toggle('hide', !belongsTo || belongsTo !== g_form.getValue(this.alignTo));
        }
        return this;
    },
    removeOptionsToSelect: function (select) {
        while (select.options.length) {
            select.options[0].remove();
        }
        // add Default Empty Option
        var option = document.createElement('option');
        option.text = '--None--';
        option.selected = true;
        select.appendChild(option);
    },
    removeAvailableOptions: function () {
        this.removeOptionsToSelect(this.availableOptions);
    },
    removeSelectedOptions: function () {
        this.removeOptionsToSelect(this.selectedOptions);
    }
};
