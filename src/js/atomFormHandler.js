
const E_S   = "";
const N_R_S = "non-required";

function a_form_handler_error(item, colorInput, displayMsg, err, errmsg, name){
  a_detach(item.parentNode.querySelectorAll(".a-input-error-text"));
  !colorInput && item.parentNode.classList.add("a-form-error");
  displayMsg && err.push({ elem: item, errorMessage: errmsg, name: name});
  return true;
}

function a_form_reset_error(item){
  a_detach(item.parentNode.querySelectorAll(".a-input-error-text"));
  item.parentNode.classList.remove("a-form-error");
}

/* ########################## GESTION DES CONTROLES ####################### */


  /* #########################################################################################################
    *							Vérification des fomulaires avant soumission
    ########################################################################################################### */

  /* Activation au clic sur un bouton de soumission
   * Vérifie l'ensemble des champs du formulaire
   *
   * @use	 optional	a-data-function	                  Fonction JS associé au boutton si celui ci ne submit pas de formulaire. La fonction est lancé si aucun élément n'est bloquant
   * @use  optional    a-check-invisible                 Défini si les champs masqués doivent être pris en compte
   * @use  optional    a-notify-none                     Si reneigné,disable les notofications globales
   * @use  optional    a-notify-all                      Si reneigné,toutes les erreurs sont notifiées
   * @use  optional    a-disable-color                   Si reneigné, ne colore pas les inputs en erreur
   * @use  optional    a-input-notify-none               Si reneigné, disable les message des inputs
   * @use  optional    a-data-opt-bloc                   Fonction de blocage personnalisée. Si retourne false, bloque le formulaire
   */
items = document.getElementsByClassName("a-form-handler");
Array.from(items).forEach((it) => {
    it.addEventListener('click', function(){
        var form = this.closest("form");
        form.submit(function (e) {
            e.preventDefault();
            return;
        });
        compute(form, this);
    });
});

async function compute(form, self) {
  var blocage         = false;
  var notifyNone      = form.hasAttribute("a-notify-none");
  var notifyAll       = form.hasAttribute("a-notify-all");
  var notifyInputNone = form.hasAttribute("a-input-notify-none");
  var colorInput      = form.hasAttribute("a-disable-color");
  var checkInvisible  = form.getAttribute("a-check-invisible");
  var optVerif        = form.getAttribute("a-data-opt-bloc");
  var callback        = form.getAttribute("a-data-function");
  var err             = new Array();

  /**
   * --------- Vérification Des Sélecteurs  ----------
   *
   * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-verif          : Value lancant une erreur. par défaut aucune value
   * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
   * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
   * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
   *
   */
  form.querySelectorAll('.a-verify-select').forEach(item => {

    var verif          = item.getAttribute("a-verif") ?? E_S;
    var name           = item.getAttribute("a-name") ?? "Selecteur";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var alternateVerif = item.getAttribute("a-alternate-verif");
    var nullable       = item.hasAttribute("a-nullable");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Aucune sélection faite";

    var isEmpty = !nullable && !item.value || item.value === verif;
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || eval(alternateVerif)) ) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : errCustomMsg), name);
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
  form.querySelectorAll('.a-verify-text').forEach(item => {
    var minLength      = a_int(item.getAttribute("a-min-length"));
    var maxLength      = item.getAttribute("a-max-length") ? a_int(item.getAttribute("a-max-length")) : null;
    var name           = item.getAttribute("a-name") ?? "Texte";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");
    var numericOnly    = item.hasAttribute("a-numeric-only");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var errorNumeric = "Caractères numeriques uniquement";
    var error        = "Saisie obligatoire";
    var errorInf     = `Saisie trop courte (min ${minLength} caractères)`;
    var errorOver    = `Saisie trop longue (max ${maxLength} caractères)`;

    var isEmpty     = !nullable && item.value.trim() === E_S;
    var isNan       = numericOnly && !a_isNumeric(item.value.trim());
    var inf         = item.value.trim().length < minLength;
    var over        = maxLength !== null && item.value.trim().length > maxLength;
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || isNan || inf || over || eval(alternateVerif))) {
        blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : isNan ? errorNumeric : inf ? errorInf : over ? errorOver : errCustomMsg), name);
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
  form.querySelectorAll('.a-verify-textarea-with-count').forEach(item => {
  
    var minLength      = a_int(item.getAttribute("a-min-length"));
    var maxLength      = item.getAttribute("a-max-length") ? a_int(item.getAttribute("a-max-length")) : null;
    var name           = item.getAttribute("a-name") ?? "Commentaire";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire";
    var errorInf     = `Saisie trop courte (min ${minLength} caractères)`;
    var errorOver    = `Saisie trop longue (max ${maxLength} caractères)`;

    var isEmpty = !nullable && item.value.trim() === E_S;
    var inf     = item.value.trim().length < minLength;
    var over    = maxLength !== null && item.value.trim().length > maxLength;
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || inf || over || eval(alternateVerif))) {
      a_detach(item.parentNode.querySelectorAll(".a-input-error-text-with-count"));
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : inf ? errorInf : over ? errorOver : errCustomMsg), name);
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
  form.querySelectorAll('.a-verify-date').forEach(item => {

    var name           = item.getAttribute("a-name") ?? "Date";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");
    var format         = item.getAttribute("a-date-format") ?? "DD/MM/YYYY";

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire";
    var errorFormat  = `Format invalide. Attendu : ${format.toUpperCase()}`;

    // TODO protect regex format 
    // Formatage de la REGEX a partir du format
    var regFormat = format.toUpperCase().replace(new RegExp("/", "g"), "([\\/])");
    var regFormat = regFormat.replace(new RegExp("-", "g"), "([-])");
    var regFormat = regFormat.replace(
      new RegExp("DD", "g"),
      "(0?[1-9]|[12][0-9]|3[01])"
    );
    var regFormat = regFormat.replace(
      new RegExp("MM", "g"),
      "(0?[1-9]|1[0-2])"
    );
    var regFormat = regFormat.replace(new RegExp("YYYY", "g"), "([0-9]{4})");
    var regFormat = regFormat.replace(new RegExp("YY", "g"), "([0-9]{2})");
    var regFormat = regFormat + "$";
    var regex     = new RegExp("^" + regFormat);

    var isEmpty   = !nullable && item.value.trim() === E_S;
    var unmatched = !regex.test(item.value.trim());
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || unmatched || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : unmatched ? errorFormat : errCustomMsg), name);
    }

  });

  /**
   * --------- Vérification Des champs Telephone  ----------
   *
   * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-phone-format   : Format attendu du numéro de téléphone. Par défaut XX.XX.XX.XX.XX. Accept . - / +
   * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
   * @use optional  a-nullable       : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
   * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
   *
   */
  form.querySelectorAll('.a-verify-phone').forEach(item => {
 
    var name           = item.getAttribute("a-name") ?? "Telephone";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");
    var format         = item.getAttribute("a-phone-format") ?? "XX.XX.XX.XX.XX";

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire";
    var errorFormat  = `Format invalide. Attendu : ${format.toUpperCase()}`;

    // TODO protect regex format 
    // Formatage de la REGEX a partir du format
    var regFormat = format.toUpperCase().replace(new RegExp("/", "g"), "([\\/])");
    var regFormat = regFormat.replace(new RegExp("-", "g"), "([-])");
    var regFormat = regFormat.replace(new RegExp("\\+", "g"), "([+])");
    var regFormat = regFormat.replace(new RegExp("X", "g"),"([0-9])");
    var regFormat = regFormat + "$";
    var regex     = new RegExp("^" + regFormat);

    var isEmpty   = !nullable && item.value.trim() === E_S;
    var unmatched = !regex.test(item.value.trim());
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || unmatched || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : unmatched ? errorFormat : errCustomMsg), name);
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
  form.querySelectorAll('.a-verify-email').forEach(item => {

    var name           = item.getAttribute("a-name") ?? "Email";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire.";
    var errorFormat  = "Format email invalide.";

    // Formatage de la REGEX a partir du format
    var regMail   = "\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+";
    var regFormat = "^" + regMail + "$";
    var regex     = new RegExp(regFormat);
    var regex     = new RegExp("^" + regFormat);

    var isEmpty   = !nullable && item.value.trim() === E_S;
    var unmatched = !regex.test(item.value.trim());
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || unmatched || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : unmatched ? errorFormat : errCustomMsg), name);
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
  form.querySelectorAll('.a-verify-int').forEach(item => {

    var min            = a_int(item.getAttribute("a-min"));
    var max            = item.getAttribute("a-max") ? a_int(item.getAttribute("a-max")) : null;
    var name           = item.getAttribute("a-name") ?? "Integer";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire";
    var errorType    = "Nombre entier attendu.";
    var errorInf     = `Valeur trop petite (min ${min})`;
    var errorOver    = `Valeur trop grande (max ${max})`;

    var isEmpty   = !nullable && item.value.trim() === E_S;
    var isNumeric = a_isInt(item.value);
    var inf       = a_int(item.value) < min;
    var over      = max !== null && a_int(item.value) > max;
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || !isNumeric || inf || over || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : !isNumeric ? errorType : inf ? errorInf : over ? errorOver : errCustomMsg), name);
    }

  });

  /**
   * --------- Vérification Des champs Float  ----------
   *
   * @use optional  a-alternate-verif : Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-error-message   : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-name            : Nom du champs pour l'affichage des erreurs
   * @use optional  a-nullable        : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
   * @use optional  a-disable-message : Permet de désactiver l'affichage des message sous les champs input
   * @use optional  a-min             : taille minimale de l'objet. Default 0
   * @use optional  a-max				      : taille maximale de l'objet. Default 2147483647
   *
   */
  form.querySelectorAll('.a-verify-float').forEach(item => {

    var min            = a_int(item.getAttribute("a-min"));
    var max            = item.getAttribute("a-max") ? a_int(item.getAttribute("a-max")) : null;
    var name           = item.getAttribute("a-name") ?? "Float";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Saisie obligatoire";
    var errorType    = "Nombre entier attendu.";
    var errorInf     = `Valeur trop petite (min ${min})`;
    var errorOver    = `Valeur trop grande (max ${max})`;

    var isEmpty   = !nullable && item.value.trim() === E_S;
    var isNumeric = a_isFloat(item.value);
    var inf       = parseFloat(item.value) < min;
    var over      = max !== null && parseFloat(item.value) > max;
    if ((checkInvisible || a_isVisible(item)) && (isEmpty || !isNumeric || inf || over || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : !isNumeric ? errorType : inf ? errorInf : over ? errorOver : errCustomMsg), name);
    }

  });

  /**
   * --------- Verification Des checkboxs  ----------
   *
   * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-nullable        : Le champ est obligatoire. Nécéssaire quand le form admet des champs non requis
   * @use optional  a-name           : nom du champ pour identifcation de l'erreur
   * @use optional  a-disable-message : Permet de désactiver l'affichage des message sous les champs input
   *
   */
  form.querySelectorAll('.a-verify-checked').forEach(item => {

    var name           = item.getAttribute("a-name") ?? "Checkbox";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Checkbox obligatoire";
   
    var isEmpty   = !nullable && !item.checked;
    if ((checkInvisible || a_isVisible(item.parentNode)) && (isEmpty || eval(alternateVerif))) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : !isNumeric ? errorType : inf ? errorInf : over ? errorOver : errCustomMsg), name);
    }

  });

  /**
   * --------- Vérification Radios & Checkbox multiples  ----------
   * Verification de la sélection d'une checkbox parmis une liste
   *
   * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-name           : nom du champ pour identifcation de l'erreur
   * @use required  a-shared-name    : nom idantifiant les elements de la liste des checkboxs a vérifier
   * @use optional  a-disable-message: Permet de désactiver l'affichage des message sous les champs input
   *
   */
  form.querySelectorAll('.a-verify-one-in-list, a-verify-radio').forEach(item => {

    var name           = item.getAttribute("a-name") ?? "Choix";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Une coche obligatoire";
   
    var checkName  = item.getAttribute("name");
    var allChecks  = form.querySelectorAll(`input[name="${checkName}"]`);
    var isEmpty   = !nullable && Array.prototype.slice.call(allChecks).some(x => x.checked && (checkInvisible || a_isVisible(item.parentNode)));
    if (isEmpty || eval(alternateVerif)) {
      blocage = a_form_handler_error(item, colorInput, displayMsg, err, (isEmpty ? error : !isNumeric ? errorType : inf ? errorInf : over ? errorOver : errCustomMsg), name);
    }

  });

  /**
   * --------- Vérification Des Input Files  ----------
   * Verification simple que l'un des input files a bien un fichier sélectionné
   *
   * @use optional  a-alternate-verif: Fonction complémentaire de vérification du contenu. Celle ci doit renvoyer vrai si le blocage est effectif
   * @use optional  a-error-message  : Message d'erreur personnalisé précisiant l'erreur souvelvée par la fonction de verification alternative
   * @use optional  a-name           : Nom du champs pour l'affichage des erreurs
   * @use optional  a-disable-message     : Permet de désactiver l'affichage des message sous les champs input
   */
  form.querySelectorAll('.a-verify-file').forEach(item => {

    var name           = item.getAttribute("a-name") ?? "Fichier";
    var displayMsg     = !item.hasAttribute("a-disable-message");
    var nullable       = item.hasAttribute("a-nullable");
    var alternateVerif = item.getAttribute("a-alternate-verif");

    var errCustomMsg = item.getAttribute("a-error-message") ?? "Champ incorrect";
    var error        = "Fichier obligatoire";
    var isEmpty = !nullable && !item.files.length;
    if ((checkInvisible || a_isVisible(item.parentNode)) && (isEmpty || eval(alternateVerif))) {
      blocage = a_form_handler_error(item.parentNode, colorInput, displayMsg, err, (isEmpty ? error : errCustomMsg), name);
    }

  });

  // Si une fonction perso est définie, on évalue le blocage
  if (optVerif !== false && (await eval(optVerif)) === true) {
    blocage = true;
  }

  if (blocage === true) {
    //Création d'un id unique pour éviter les collisions de blocs

    !notifyInputNone && err.forEach(function (element) {
      var inputErrorElement = document.createElement('span');
      inputErrorElement.classList.add(element.elem.parentNode.classList.contains("a-count-area") ? 'a-input-error-text-with-count' : 'a-input-error-text');
      inputErrorElement.innerHTML = element.errorMessage.trim();
      element.elem.parentNode.append(inputErrorElement);
    });

    if(notifyAll) {
      err.forEach(function (element) {
        $.atomNotification(`${element.name ?? "Champ incorrect"} : ${element.errorMessage}`, "danger");
      });
    } else if (!notifyNone) {
      $.atomNotification("Des erreurs ont été détectées dans le formulaire. Merci de vérifier les données.", "danger");
    }

    // reinit les flux de données
    err = {};
  } else {
    if (callback) {
      eval(callback);
      form.submit(function (e) {
        e.preventDefault();
      });
    } else {
      form.submit();
    }
  }
  reinitColor(form);
  self.blur();
}


/* #####################################################
*	Réinitialisation des couleurs des champs de saisie
####################################################### */

function reinitColor(form) {

  elements = form.querySelectorAll('.a-verify-select');
  Array.from(elements).forEach((it) => {
    it.addEventListener('change', function(){
      a_form_reset_error(this);
    });
  });

  elements = form.querySelectorAll('.a-verify-text, .a-verify-textarea-with-count, .a-verify-date, .a-verify-phone, .a-verify-email, .a-verify-int, .a-verify-float');
  Array.from(elements).forEach((it) => {
    it.addEventListener('keyup', function(){
      a_form_reset_error(this);
    });
  });

  elements = form.querySelectorAll('.a-verify-checked, .a-verify-one-in-list, a-verify-radio, .a-verify-file');
  Array.from(elements).forEach((it) => {
    it.addEventListener('change', function(){
      a_form_reset_error(this.parentNode);
    });
  });
}
