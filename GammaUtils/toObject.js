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