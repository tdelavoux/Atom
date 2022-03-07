/*###########################################################################################################
*						Compteur de charactères pour texteArea
############################################################################################################*/

/**
 * @use optional maxlength
 *
 * Défini un compteur automatique de caractères restant pour un texte area donné.
 * La taille max est basée sur l'attribut maxlenght de la textArea. Par défaut, la valeur est à 500;
 */
    $('.a-count-area>textarea').keyup(function(){
    $(this).parent().find('.lengthText').remove();
    var max = $(this).attr('maxlength') ? parseInt($(this).attr('maxlength')) : 500;
    var len = $(this).val().length;
    var ch  = max - len;
    $(this).parent().prepend('<p class="small-text lengthText">' + ch + ' caractère(s) restant(s)</p>');
});
$('.a-count-area>textarea').trigger('keyup');