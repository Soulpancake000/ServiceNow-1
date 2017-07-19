function onChange(control, oldValue, newValue, isLoading) {
    var filterBy = 'assigned_to',
        filteredField = {name: 'u_incidents', grtable: 'incident', filtered_by: 'number', value: 'sys_id'},
        defaultOption = jQuery('<option>--None--</option>').attr({selected: true});

    if (isLoading || newValue === '') {
        return;
    }
    fetchItems();
    removeSelectedOptions();
    showOptions();

    function fetchItems() {
        //Make sure we are have a value in the filter field
        if (g_form.getValue(filterBy) !== '') {
            return;
        }
        //check if the item hasn't been fetched
        if (jQuery('#' + filteredField.name + '_select_0 option[data-filter-by=' + g_form.getValue(filterBy) + ']').length) {
            return;
        }
        var gr = new GlideRecord(filteredField.grtable);
        gr.addQuery(filterBy, g_form.getValue(filterBy));
        gr.orderBy(filteredField.filtered_by);
        gr.query();

        //add options to the select
        if (gr.hasNext()) {
            while (gr.next()) {
                jQuery('#' + filteredField.name + '_select_0').append(
                    jQuery('<option>' + gr.getValue(filteredField.filtered_by) + '</option>').attr({
                        value: gr.getValue(filteredField.value),
                        style: 'display:none',
                        'data-filter-by': g_form.getValue(filterBy)
                    })
                );
            }
        }
    }

    function removeSelectedOptions() {
        //when the record is being edited
        if (oldValue !== '' && newValue === '') {
            return;
        }
        jQuery('#' + filteredField.name + '_select_1').html('').append(defaultOption);
    }

    function showOptions() {
        jQuery('#' + filteredField.name + '_select_0 option').each(function (i, option) {
            jQuery(option).toggle(jQuery(option).data('filter-by') === g_form.getValue(filterBy));
        });
    }
}