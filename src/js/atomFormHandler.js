 const E_S   = "";
 const N_R_S = "non-required";
 
 /* ########################## GESTION DES CONTROLES ####################### */
 
 $(function(){
    /* #########################################################################################################
    *							Vérification des fomulaires avant soumission
    ########################################################################################################### */

    /* Activation au clic sur un bouton de soumission
    * Vérifie l'ensemble des champs du formulaire
    *
    * @use	optional	data-function	                Fonction JS associé au boutton si celui ci ne submit pas de formulaire. La fonction est lancé si aucun élément n'est bloquant
    * @use  optional    check-invisible                 Défini si les champs masqués doivent être pris en compte
    * @use  optional    notify-none                     Si reneigné,disable les notofications globales
    * @use  optional    notify-all                      Si reneigné,toutes les erreurs sont notifiées
    * @use  optional    a-disable-color                 Si reneigné, ne colore pas les inputs en erreur
    * @use  optional    input-notify-none               Si reneigné, disable les message des inputs
    * @use  optional    data-opt-bloc                   Fonction de blocage personnalisée. Si retourne false, bloque le formulaire
    */
    $('.a-form-handler').click(function(){

        var btn  = $(this);
        var form = btn.closest('form');
        form.submit(function(e) {e.preventDefault();});
        
        compute(form, btn);
    });

    async function compute(form, self){

        var blocage         = false;
        var notifyNone      = (form.attr('a-notify-none') !== undefined && form.attr('a-notify-none') !== 'false') ? true : false;
        var notifyAll       = (form.attr('a-notify-all') !== undefined && form.attr('a-notify-all') !== 'false') ? true : false;
        var notifyInputNone = (form.attr('a-input-notify-none') !== undefined && form.attr('a-input-notify-none') !== 'false') ? true : false;
        var colorInput      = (form.attr('a-disable-color') !== undefined && form.attr('a-disable-color') !== 'false') ? true : false;
        var checkVisi       = (form.attr('a-check-invisible')) ? form.attr('a-check-invisible') : false;
        var optVerif        = (form.attr('a-data-opt-bloc'))   ? form.attr('a-data-opt-bloc') : false;
        var callback        = (form.attr('a-data-function'))   ? form.attr('a-data-function') : false;
        var err             = new Array();

        /**
         * --------- Vérification Des Sélecteurs  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-verif          : Value lancant une erreur. par défaut aucune value
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */ 
        $('.a-verify-select', form).each(function(){

            var error        = 'Aucune sélection faite';
            var verif        = $(this).attr('a-verif')       ? $(this).attr('a-verif') : E_S;
            var name         = $(this).attr('a-name')           ? $(this).attr('a-name') : 'Selecteur';
            var errCustomMsg = $(this).attr('a-error-message')  ? $(this).attr('a-error-message') : 'Champs incorrect';
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if(( !$('option:selected', this).val()|| $('option:selected', this).val() === verif)){
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(($(this).val() !== E_S)  && eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs texte  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-min-length     : taille minimale du texte à saisir
         * @use optional  a-max-length     : taille maximale du texte à saisir
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-text', form).each(function(){

            var minLength    = $(this).attr('a-min-length') ? parseInt($(this).attr('a-min-length')) : 0;
            var maxLength    = $(this).attr('a-max-length') ? parseInt($(this).attr('a-max-length')) : null;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Texte';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && $(this).val().length < minLength){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie trop courte (min " + minLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && maxLength !== null && ($(this).val().length > maxLength)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie  trop longue (max " + maxLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput &&  $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });
		
		/**
         * --------- Vérification Des champs textarea avec count  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-min-length     : taille minimale du texte à saisir
         * @use optional  a-max-length     : taille maximale du texte à saisir
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-textarea-with-count', form).each(function(){

            var minLength    = $(this).attr('a-min-length') ? parseInt($(this).attr('a-min-length')) : 0;
            var maxLength    = $(this).attr('a-max-length') ? parseInt($(this).attr('a-max-length')) : null;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Commentiare';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && $(this).val().length < minLength){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie trop courte (min " + minLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().length !== 0 && maxLength !== null && ($(this).val().length > maxLength)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie  trop longue (max " + maxLength + " caractères)", name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text-with-count').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Date  ----------
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-date-format    : format de la date a vérifier (accepté les YY, YYYY, DD, MM, /, -)
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-date', form).each(function(){

            var format       = $(this).attr('a-date-format') ? $(this).attr('a-date-format').toUpperCase() : 'DD/MM/YYYY';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Date';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            // Formatage de la REGEX a partir du format
            var regFormat = format.replace(new RegExp('/', 'g') , "([\\/])");
            var regFormat = regFormat.replace(new RegExp('-', 'g') , "([-])");
            var regFormat = regFormat.replace(new RegExp('DD', 'g') , '(0?[1-9]|[12][0-9]|3[01])');
            var regFormat = regFormat.replace(new RegExp('MM', 'g') , '(0?[1-9]|1[0-2])');
            var regFormat = regFormat.replace(new RegExp('YYYY', 'g') , '([0-9]{4})');
            var regFormat = regFormat.replace(new RegExp('YY', 'g') , '([0-9]{2})');
            var regFormat = regFormat + '\$';
            var regex     = new RegExp('^' + regFormat );

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage: "Format invalide. Attendu : " + format, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Telephone  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-phone-format   : Type de téléphone fixe ou mobile
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-phone', form).each(function(){

            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var format       = $(this).attr('a-phone-format') && $(this).attr('a-phone-format') === 'mobile' ? 'mobile' : 'fixe';
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Telephone';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            // Formatage de la REGEX a partir du format
            var regFormatFixe   = '([0][0-9]{9})$|([0][0-9])(([ ][0-9]{2}){4})$|([0][0-9])(([.][0-9]{2}){4})';
            var regFormatMobile = '([06][0-9]{9})$|([06])(([ ][0-9]{2}){4})$|([06])(([.][0-9]{2}){4})';
            var regFormat       = '^' + (format === 'mobile' ? regFormatMobile : regFormatFixe) + '\$';
            var regex           = new RegExp(regFormat);

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Format inconnu. sans séparateur, point ou espace acceptés.", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs email  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
         */
        $('.a-verify-email', form).each(function(){

            
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            
            // Formatage de la REGEX a partir du format
            var regFormatMobile = '\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+';
            var regFormat       = '^' + regFormatMobile + '\$';
            var regex           = new RegExp(regFormat);

            if(checkVisi || $(this).is(':visible')){
                if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if($(this).val().trim() !== E_S && !regex.test($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Format invalide", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });


        /**
         * --------- Vérification Des champs Int  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * @use optional  a-min             : taille minimale de l'objet. Default 0
         * @use optional  a-max				: taille maximale de l'objet. Default 2147483647
         */
        $('.a-verify-int', form).each(function(){

            var minVal       = parseInt($(this).attr('a-min')) ? parseInt($(this).attr('a-min')) : 0;
            var maxVal       = parseInt($(this).attr('a-max')) ? parseInt($(this).attr('a-max')) : 2147483647;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val() && (!$.isNumeric($(this).val()) ||  $(this).val().includes('.') !== false)){
                    displayMsg && err.push({elem:$(this), errorMessage:"Nombre entier attendu", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val() < minVal || $(this).val() > maxVal){
                    displayMsg && err.push({elem:$(this), errorMessage:(minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""), name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
        });

        /**
         * --------- Vérification Des champs Float  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
         * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
         * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * @use optional  a-min             : taille minimale de l'objet. Default 0
         * @use optional  a-max				: taille maximale de l'objet. Default 2147483647
         * 
         */
        $('.a-verify-float', form).each(function(){

            var minVal       = parseInt($(this).attr('a-min')) ? parseInt($(this).attr('a-min')) : 0;
            var maxVal       = parseInt($(this).attr('a-max')) ? parseInt($(this).attr('a-max')) : 2147483647;
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Mail';
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;

            if(checkVisi || $(this).is(':visible')){
                if($(this).val() && !$.isNumeric($(this).val())){
                    displayMsg && err.push({elem:$(this), errorMessage:"Nombre attendu", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if($(this).val().trim() === E_S && !nullable){
                    displayMsg && err.push({elem:$(this), errorMessage:"Saisie obligatoire", name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(parseFloat($(this).val()) < minVal || parseFloat($(this).val()) > maxVal){
                    displayMsg && err.push({elem:$(this), errorMessage:(minVal ? "Min : " + minVal : "")  + (maxVal ? ' Max : ' + maxVal : ""), name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
            }
            
        });


        /**
         * --------- Verification Des checkboxs  ----------
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : nom du champ pour identifcation de l'erreur
         * @use optional  a-disable-message : Permet de désactiver l'affichage des message sous les champs input
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * 
         */
        $('.a-verify-checked', form).each(function(){

            var error        = "Attention, " + ($(this).attr('a-name') ? $(this).attr('a-name') : 'La checkbox ') + " n'a pas été accepté(e) / coché(e). ";
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Checkbox';
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            if(checkVisi || $(this).parent().is(':visible')){
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                if(!$(this).prop("checked")){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    err     = jQuery.unique(err);
                    blocage = true;
                }
            }
        });

        /**
		 * --------- Vérification Des checkboxs 2  ----------
		 * Verification de la sélection d'une checkbox parmis une liste
         * 
         * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
         * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
         * @use optional  a-name           : nom du champ pour identifcation de l'erreur
		 * @use required  a-shared-name    : nom idantifiant les elements de la liste des checkboxs a vérifier
		 * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
         * 
		 */
		$('.a-verify-one-in-list', form).each(function(){

            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Liste de Checkboxs';
            var error        = "Attention, " + name + " Aucune selection.";
            var checkName    = $(this).attr('a-shared-name');
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

			if(checkVisi || $(this).parent().is(':visible')){
				var counter2 = 0;
				if($('input[data-shared-name="' + checkName+'"]').is(":checked")){
					counter2++;
				}
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
				if(counter2 === 0){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
					displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    blocage = true;
				}  
			}
		});

        /**
         * --------- Vérification Des Radios  ----------
         * 
         * Verification simple que l'un des boutons radio a été sélectionné dans la liste des radio de méme noms
         *  @use optional  data-name		: nom du champ pour identifcation de l'erreur
         *  @use optional  disable-message  : Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-radio', form).each(function(){

            var error        = "Attention, " + ($(this).attr('a-name') ? $(this).attr('a-name') : ' Boutons Radios :') + " aucune selection. ";
            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Radio';
            var radioName    = $(this).attr('name');
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';

            if(checkVisi || $(this).parent().is(':visible')){            
                var counter = 0;
                if($('input[name="' + radioName+'"]').is(":checked")){
                    counter++;
                }
                if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().addClass('a-form-error');
                    blocage = true;
                }
                if( counter === 0){
                    $(this).parent().parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    blocage = true;
                }
            }
        });

        /**
         * --------- Vérification Des Input Files  ----------
         * Verification simple que l'un des input files a bien un fichier sélectionné
         * 
         * @use optional  data-name        : Nom du champs pour l'affichage des erreurs
         * @use optional  disable-message  : Permet de désactiver l'affichage des message sous les champs input
         */
        $('.a-verify-file', form).each(function(){

            var name         = $(this).attr('a-name') ? $(this).attr('a-name') : 'Fichier';
            var error        = "Attention, " + name + " Aucune selection. ";
            var displayMsg   = ($(this).attr('a-disable-message') !== undefined && $(this).attr('a-disable-message') !== 'false') ? false : true;
            var errCustomMsg = $(this).attr('a-error-message') ? $(this).attr('a-error-message') : 'Champs incorrect';
            var nullable     = ($(this).attr('a-nullable') !== undefined && $(this).attr('a-nullable') !== 'false') ? true : false;

            if(checkVisi || $(this).is(':visible')){
                if(!$(this)[0].files.length && !nullable){
                    $(this).parent().find('.a-input-error-text').detach();
                    displayMsg && err.push({elem:$(this), errorMessage:error, name: name});
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    blocage = true;
                }else if(eval($(this).attr('a-alternate-verif'))){
                    displayMsg && err.push({elem:$(this), errorMessage:errCustomMsg, name: name});
                    $(this).parent().find('.a-input-error-text').detach();
                    !colorInput && $(this).parent().parent().addClass('a-form-error');
                    blocage = true;
                }else{
                    $(this).parent().find('.a-input-error-text').detach();
                }
            }
        });

        // Si une fonction perso est définie, on évalue le blocage
        if(optVerif !== false && await eval(optVerif) === true){
            blocage = true;
        }
        
        if(blocage === true){

            //Création d'un id unique pour éviter les collisions de blocs
            var uniqID = Date.now() * (Math.round(Math.random() * 100));

            !notifyInputNone && err.forEach(function(element) {
				if(element.elem.parent().hasClass('a-count-area')) {
					element.elem.parent().append('<span class="a-input-error-text-with-count">'+ element.errorMessage +'</span>');
				}else{
					element.elem.parent().append('<span class="a-input-error-text">'+ element.errorMessage +'</span>');
				}
			});

            var errMsg =  [...new Map(err.map(item =>
                [item['name'], item])).values()];

            if(notifyAll){
                errMsg.forEach(function(element) {
                    $.atomNotification((element.name ? element.name : 'Champ incorrect ') + ' : ' + element.errorMessage, "error");
                });
            }else if(!notifyNone){
                $.atomNotification('Des erreurs ont été détectées dans le formulaire. Merci de vérifier les données.', "error");
            }
            
            // reinit les flux de données
            err = {};
        }else{
            if(callback){
                eval(callback);
                $((form ? '#' + form  : 'form')).submit(function(e) {e.preventDefault();});
            }else{
                $((form ? '#' + form  : 'form')).unbind('submit').submit();
            }
        }
        reinitColor();
		self.blur();
    }
 
});
 
/* #####################################################
*	Réinitialisation des couleurs des champs de saisie
####################################################### */

function reinitColor(){

    $('select').change(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-text').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });
	
	$('.a-verify-textarea-with-count').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text-with-count').detach();
    });

    $('.a-verify-int').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-email').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-date').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-phone').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-float').keyup(function(){
        $(this).parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-checked').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().parent().find('.a-input-error-text').detach();
    });

    $('input[type="radio"]').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().parent().find('.a-input-error-text').detach();
    });

    $('.a-verify-file').change(function(){
        $(this).parent().parent().removeClass('a-form-error');
        $(this).parent().find('.a-input-error-text').detach();
    });

}