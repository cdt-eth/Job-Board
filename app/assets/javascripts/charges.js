document.addEventListener('turbolinks:load', function() {
  var public_key = document.querySelector("meta[name='stripe-public-key']").content;
  var stripe = Stripe(public_key);
  var elements = stripe.elements();

  var style = {
    base: {
      color: '#32325d',
      lineHeight: '32px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '18px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  var card = elements.create('card', { style: style });

  card.mount('#card-element');

  card.addEventListener('change', ({ error }) => {
    var displayError = document.getElementById('card-errors');
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  });

  var form = document.getElementById('new_job');
  form.addEventListener('submit', async event => {
    event.preventDefault();

    var { token, error } = await stripe.createToken(card);

    if (error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(token);
    }
  });

  var stripeTokenHandler = token => {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('new_job');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    ['brand', 'exp_month', 'exp_year', 'last4'].forEach(function(field) {
      addFieldToForm(form, token, field);
    });

    // Submit the form
    form.submit();
  };

  function addFieldToForm(form, token, field) {
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'user[card_' + field + ']');
    hiddenInput.setAttribute('value', token.card[field]);
    form.appendChild(hiddenInput);
  }
});
