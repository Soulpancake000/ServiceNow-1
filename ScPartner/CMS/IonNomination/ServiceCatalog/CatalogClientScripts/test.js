function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue === '') {
        //remove current options
        jQuery('#' + name + '_select_0').html('').append(jQuery('<option>--None--</option>').attr({selected: true}));
        return;
    }

    //when the record is not being edited and filterBy has value remove selected options
    if (oldValue === '' && newValue !== '') {
        jQuery('#' + name + '_select_1').html('').append(jQuery('<option>--None--</option>').attr({selected: true}));
    }
    //fetch items - Make sure we are have a value in the filter field
    if (g_form.getValue('account') !== '') {
        return;
    }
    //check if the item hasn't been fetched
    if (jQuery('#' + name + '_select_0 option[data-filter-by=' + g_form.getValue('account') + ']').length) {
        return;
    }
    var gr = new GlideRecord(grtable);
    gr.addQuery('account', g_form.getValue('account'));
    gr.orderBy(display);
    gr.query();

    //add options to the select
    if (gr.hasNext()) {
        while (gr.next()) {
            jQuery('#' + name + '_select_0').append(
                jQuery('<option>' + gr.getValue(display) + '</option>').attr({
                    value: gr.getValue(value),
                    style: 'display:none',
                    'data-filter-by': g_form.getValue('account')
                })
            );
        }
    }

    //showOptions();
    jQuery('#' + name + '_select_0 option').each(function (i, option) {
        jQuery(option).toggle(jQuery(option).data('filter-by') === g_form.getValue('account'));
    });
}