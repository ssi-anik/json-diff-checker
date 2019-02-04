export function guess_data_type (value) {
    // Updates on actual answers:
    // https://stackoverflow.com/a/16776395/2190689
    // https://stackoverflow.com/a/24629135/2190689

    if ( null === value ) {
        return 'Null';
    }

    if ( typeof value === typeof true ) {
        return 'Boolean';
    }

    if ( typeof value === typeof {} && Array.isArray(value) ) {
        return 'Array';
    }

    if ( typeof value === typeof {} ) {
        return "Object";
    }

    var nan = isNaN(Number(value));
    var isFloat = /^\d*(\.|,)\d*$/;
    var commaFloat = /^(\d{0,3}(,)?)+\.\d*$/;
    var dotFloat = /^(\d{0,3}(\.)?)+,\d*$/;
    var date = /^(([0-9]{4}[-/.](0[1-9]|1[0-2])[-/.]([0-2][0-9]|3[0-1])|([0-2][0-9]|3[0-1])[-/.](0[1-9]|1[0-2])[-/.][0-9]{4}))$/;
    var email = /^[A-za-z0-9._-]*@[A-za-z0-9_-]*\.[A-Za-z0-9.]*$/;

    if ( typeof value === 'string' ) {
        if ( date.test(value) ) {
            return "Date";
        } else if ( email.test(value) ) {
            return "Email";
        }

        return 'String';
    }

    if ( typeof value !== 'string' ) {
        value = value.toString();
    }

    if ( !nan ) {
        // comma separated float value won't reach here.
        // it's already assumed as STRING.
        if ( parseFloat(value) === parseInt(value) ) {
            return 'Integer';
        } else {
            return 'Float';
        }
    } else if ( isFloat.test(value) || commaFloat.test(value) || dotFloat.test(value) ) {
        // shouldn't even reach here as well
        return 'Float';
    } else {
        return 'String';
    }
}