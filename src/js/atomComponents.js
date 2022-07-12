/** -----------------------------------------------------
 *      text-area characters counter
 * ------------------------------------------------------
 * @use optional maxlength
 *
 * Défini un compteur automatique de caractères restant pour un texte area donné.
 * La taille max est basée sur l'attribut maxlenght de la textArea. Par défaut, la valeur est à 500;
 */
document.querySelectorAll('.a-count-area>textarea').forEach(function (textarea) {
    const a_area_max = a_int(this.getAttribute("maxlength"), 500);
    const a_area_elem = document.createElement("p");
    a_area_elem.classList.add("a-length-text");
    a_area_elem.innerHTML = `${a_area_ch} caractères restants`;
    this.parentNode.prepend(a_area_elem);

    textarea.addEventListener('keyup', function () {
        const a_area_len = this.value.length;
        const remaining = a_area_max - a_area_len;

        const plural = remaining > 1 ? 's' : '';
        a_area_elem.innerText = `${remaining}/${max} caractère${plural} restant${plural}`;
    });
})
});