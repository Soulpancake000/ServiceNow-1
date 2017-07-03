(function projectVizServer() {
	data.projects = [];
    var ionGr = new GlideRecord('x_snc_ion_nomination');
    ionGr.setLimit(10);
	ionGr.orderByDesc('opened_at');
	ionGr.query();
    while (ionGr.next()) {
        var ionRec = toObject(ionGr);
        data.projects.push(ionRec);
    }
	
	var tspGr = new GlideRecord('tsp1_project');
	tspGr.setLimit(10);
	tspGr.orderByDesc('opened_at');
	tspGr.query();
	while (tspGr.next()) {
        var tspRec = toObject(tspGr);
        data.projects.push(tspRec);
    }
	console.log("wtf");
	console.log(data.projects);
    function toObject(recordToPackage) {
        var packageToSend = {};
        for (var property in recordToPackage) {
            try {
                packageToSend[property] = recordToPackage[property].getDisplayValue();
            } catch (err) {
            }
        }
        return packageToSend;
    }
})();