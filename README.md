# TimesheetProject

1. to add API for currency exchange https://manage.exchangeratesapi.io/account
2. API https://github.com/everapihq/freecurrencyapi-j
  2a. npm install --save @everapi/freecurrencyapi-js
  2b. import Freecurrencyapi from '@everapi/freecurrencyapi-js';
  2c. const freecurrencyapi = new Freecurrencyapi('YOUR-API-KEY');
  2d. freecurrencyapi.latest({
        base_currency: 'USD',
        currencies: 'EUR'
    }).then(response => {
        console.log(response);
    });

