/** -----------------------------------------------------
 *      text-area characters counter
 * ------------------------------------------------------
 * @use optional maxlength
 *
 * Défini un compteur automatique de caractères restant pour un texte area donné.
 * La taille max est basée sur l'attribut maxlenght de la textArea. Par défaut, la valeur est à 500;
 */
 document.querySelectorAll('.a-count-area>textarea').forEach(function(textarea) {
  textarea.addEventListener('keyup', function() {
    a_detach(this.parentNode.querySelector(".a-length-text"));
    var max     = a_int(this.getAttribute("maxlength"), 500);
    var len     = this.value.length;
    var ch      = max - len;
    var newElem = document.createElement("p");
    newElem.classList.add("a-length-text");
    newElem.innerHTML = `${ch} caractère(s) restant(s)`;
    this.parentNode.prepend(newElem);
  });
  var event = new Event('keyup');
  textarea.dispatchEvent(event);
});