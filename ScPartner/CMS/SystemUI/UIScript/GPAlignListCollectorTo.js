/**
 * @Test1: fetch items (GOOD)
 * @Test2: remove selected options (GOOD)
 * @Test3: show options on
 *  - Edit record
 *  - New record
 */
/**
 * TODO: fetch available options on load, show and hide
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
                option.text = gr.getValue(this.listCollectorField.display) + '-' + gr.getValue(this.alignTo);
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
    /**
     * @TODO: merge removeAvailableOptions and remveSelectedOptions in one function
     */
    removeAvailableOptions: function () {
        while (this.availableOptions.options.length) {
            this.availableOptions.options[0].remove();
        }
        // add Default Empty Option
        var option = document.createElement('option');
        option.text = '--None--';
        option.selected = true;
        this.availableOptions.appendChild(option);
    },
    removeSelectedOptions: function () {
        while (this.selectedOptions.options.length) {
            this.selectedOptions.options[0].remove();
        }
        // add Default Empty Option
        var option = document.createElement('option');
        option.text = '--None--';
        option.selected = true;
        this.selectedOptions.appendChild(option);
    }
};
