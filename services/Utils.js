class Utils {
    static dateFormat(date) {
        return String.prototype.concat(date.getDate(), '/', date.getMonth()+1, '/', date.getFullYear(), ' ', date.getHours(), ':', date.getMinutes());
    }
}