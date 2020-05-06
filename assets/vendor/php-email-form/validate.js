jQuery(document).ready(function($) {
  "use strict";

  //Contact
  $('form.php-email-form').submit(function() {
   
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs
     
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    else var str = $(this).serialize();

    var this_form = $(this);
    var action = $(this).attr('action');

    if( ! action ) {
      this_form.find('.loading').slideUp();
      this_form.find('.error-message').slideDown().html('¡La propiedad de acción de formulario no está establecida!');
      return false;
    }
    
    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();
    
    $.ajax({
      type: "POST",
      url: action,
      data: str,
      success: function(msg) {
        if (msg == 'OK') {
          this_form.find('.loading').slideUp();
          this_form.find('.sent-message').slideDown();
          this_form.find("input:not(input[type=submit]), textarea").val('');
        } else {
          this_form.find('.loading').slideUp();
          this_form.find('.error-message').slideDown().html(msg);
        }
      }
    });
    return false;
  });

});


   /**
     * Subscription form content frontpage
     */
    $('#subscribe-content').click(function(event) {
      event.preventDefault();
      var emailPersonToSubscribeContent = $('#mail-front-page-suscribed').val();
      var checkchecked = $('#check-home-newsletter').prop('checked');

      if (!validateEmail(emailPersonToSubscribeContent)) {
          $('#error-form').html('<p>El email no es valido</p>');
      } else if (!checkchecked) {
          $('#error-form').html('<p>Acepte los términos y condiciones</p>');
      } else {
           console.log(emailPersonToSubscribeContent);
          $.ajax({
                  url: ajaxUrl,
                  type: 'POST',
                  dataType: 'json',
                  data: {
                      action: 'subscription_content_digital',
                      nonce: ajaxNonce,
                      email: emailPersonToSubscribeContent,
                      habeasData: 'Acepto',
                  },
              })
              .done(function(response) {
                  console.log(response);
                  if (response.success != true) {
                      $('#error-form').html('<p>' + response.data.error + '</p>');
                  } else {
                      $('#error-form').hide('slow');
                      swal(
                          "Éxito!",
                          response.data.success,
                          "success"
                      );
                      $('#form-front-page-subscribed').closest('form').find('input[type=text], input[type=email], input[type=checkbox]').val('');
                  }
              })
              .fail(function(response) {
                  $('#error-form').html('<p>Ha ocurrido un errror, Por favor intentalo nuevamente </p>');
              })
      }
  });

  /**
   * Subscription to events form
   */
  $('#save-mail-subscribe').click(function(event) {
      event.preventDefault();
      var emailPersonToEvent = $('#leave_us_your_email').val();

      if (!validateEmail(emailPersonToEvent)) {
          $('#error-form').html('<p>El email no es valido</p>');
      } else {
          $.ajax({
                  url: ajaxUrl,
                  type: 'POST',
                  dataType: 'json',
                  data: {
                      action: 'subscription_to_events_and_workshops',
                      nonce: ajaxNonce,
                      email: emailPersonToEvent,
                  },
              })
              .done(function(response) {
                  if (response.success != true) {
                      $('#error-form').html('<p>' + response.data.error + '</p>');
                  } else {
                      $('#error-form').hide('slow');
                      swal(
                          "Éxito!",
                          response.data.success,
                          "success"
                      );
                      $('#form-subscribe-events').closest('form').find('input[type=text], input[type=email]').val('');
                  }
              })
              .fail(function(response) {
                  $('#error-form').html('<p>Ha ocurrido un errror, Por favor intentalo nuevamente.</p>');
              })
      }
  });
