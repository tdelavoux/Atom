function a_isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function a_isVisible(n) {
  return n.offsetWidth > 0 && n.offsetHeight > 0;
}
function a_isHtml(n) {
  return n instanceof HTMLElement;
}

function a_detach(n) {
  if (n instanceof NodeList) {
    n.forEach(function (i) {
      i.remove();
    });
  } else {
    a_isHtml(n) && n.remove();
  }
}

function a_int(number, defaultValue = 0) {
  if (!number || isNaN(number)) {
    return defaultValue;
  }

  return parseInt(number);
}

function a_isInt(v) {
  var x;
  return (
    !isNaN(v) &&
    ((x = parseFloat(v)), (0 | x) === x) &&
    !v.toUpperCase().includes("E")
  );
}

function a_safe_float(number, defaultValue = 0) {
  if (!number || isNaN(number)) {
    return defaultValue;
  }

  return parseFloat(number);
}

function a_isFloat(v) {
  var x;
  return !isNaN(v) && !v.toUpperCase().includes("E");
}
