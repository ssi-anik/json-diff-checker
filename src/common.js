export function guess_data_type (value) {

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

    if ( typeof value !== 'string' ) {
        value = value.toString();
    }

    var nan = isNaN(Number(value));
    var isfloat = /^\d*(\.|,)\d*$/;
    var commaFloat = /^(\d{0,3}(,)?)+\.\d*$/;
    var dotFloat = /^(\d{0,3}(\.)?)+,\d*$/;
    var date = /^\d{0,4}(\.|\/|-)\d{0,4}(\.|\/|-)\d{0,4}$/;

    if ( !nan ) {
        if ( parseFloat(value) === parseInt(value) ) {
            return "Integer";
        } else {
            return "Float";
        }
    } else if ( isfloat.test(value) || commaFloat.test(value) || dotFloat.test(value) ) {
        return "Float";
    } else if ( date.test(value) ) {
        return "Date";
    } else {
        return "String";
    }
}