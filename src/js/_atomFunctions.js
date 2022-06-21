function a_isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}