(function projectVizServer() {
    data.projects = [];
    var ionGr = new GlideRecord('x_snc_ion_nomination');
    ionGr.orderByDesc('opened_at');
    ionGr.addQuery('state', 'IN', ['1', '2', '3']);
    ionGr.setLimit(10);
    ionGr.query();
    while (ionGr.next()) {
        var ionRec = toObject(ionGr);
        data.projects.push(ionRec);
    }


    var tspGr = new GlideRecord('tsp1_project');
    tspGr.orderByDesc('opened_at');
    tspGr.addQuery('phase', 'IN', ['Engage', 'Discover', 'Align and Confirm', 'Promote', 'Realize', 'Closure']);
    tspGr.setLimit(10);
    tspGr.query();
    while (tspGr.next()) {
        var tspRec = toObject(tspGr);
        switch (tspRec.phase.display) {
            case 'Engage':
                tspRec.state = {value: '4', display: 'Engage'};
                break;
            case 'Discover':
                tspRec.state = {value: '5', display: 'Discover'};
                break;
            case 'Align and Confirm':
                tspRec.state = {value: '6', display: 'Align & Confirm'};
                break;
            case 'Promote':
                tspRec.state = {value: '7', display: 'Promote'};
                break;
            case 'Realize':
                tspRec.state = {value: '8', display: 'Realize'};
                break;
            case 'Closure':
                tspRec.state = {value: '9', display: 'Closure'};
                break;
        }
        data.projects.push(tspRec);
    }

    function toObject(recordToPackage) {
        var packageToSend = {};
        for (var property in recordToPackage) {
            try {
                packageToSend[property] = {
                    display: recordToPackage[property].getDisplayValue(),
                    value: recordToPackage.getValue(property)
                };
            } catch (err) {
            }
        }
        return packageToSend;
    }
})();