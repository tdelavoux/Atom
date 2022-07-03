function a_isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function a_isVisible(n) {
  return n.offsetWidth > 0 && n.offsetHeight > 0
}
function a_isHtml(n){
  return n instanceof HTMLElement;
}

function a_detach(n) {
  if(n instanceof NodeList){
      n.forEach(function(i){
          i.remove();
      });
  }else{
    a_isHtml(n) && n.remove();
  }
}

function a_int(n, d=0){
return (!n || isNaN(n)) ? d: parseInt(n);
}

function a_isInt(v) {
  var x;
  return !isNaN(v) && (x = parseFloat(v), (0 | x) === x) && !v.toUpperCase().includes('E');
}

function a_isFloat(v){
  var x;
  return !isNaN(v) && !v.toUpperCase().includes('E');
}