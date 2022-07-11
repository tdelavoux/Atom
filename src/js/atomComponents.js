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
    const a_area_max     = a_int(this.getAttribute("maxlength"), 500);
    const a_area_len     = this.value.length;
    const a_area_ch      = a_area_max - a_area_len;
    const a_area_elem    = document.createElement("p");
    a_area_elem.classList.add("a-length-text");
    a_area_elem.innerHTML = `${a_area_ch} caractère(s) restant(s)`;
    this.parentNode.prepend(a_area_elem);
  });
  textarea.dispatchEvent(new Event('keyup'));
});