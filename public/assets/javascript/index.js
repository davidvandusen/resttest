(function init() {

  const main = function main() {
    configureHandlebars();
    loadTemplates();
    show('loading-template');
    fetchConfig()
      .then(fetchTransactions)
      .then(showTransactions)
      .catch(handleError);
  };

  document.addEventListener('DOMContentLoaded', main);

  const configureHandlebars = function configureHandlebars() {
    Handlebars.registerHelper('formatDateShort', function shortDateFormat(date) {
      return moment(date).format('MMM Do, YYYY');
    });
    Handlebars.registerHelper('formatAccountingInverted', function formatAccountingInverted(value) {
      const numericValue = Number(value);
      return formatAccounting(-numericValue);
    });
  };

  // Returns a string representation of the given value as en-US currency (dollars and cents) in accounting format with
  // parentheses for negative numbers.
  const formatAccounting = function formatCurrencyForAccounting(value) {
    const numericValue = Number(value);
    const isNegative = numericValue < 0;
    const cents = numericValue.toFixed(2).split('.')[1];
    const dollars = Math.floor(Math.abs(numericValue)).toLocaleString();
    var formatted = '$' + dollars + '.' + cents;
    if (isNegative) {
      formatted = '(' + formatted + ')';
    }
    return formatted;
  };

  const cachedTemplates = {};

  const loadTemplates = function loadTemplatesFromDOM() {
    const templateNodes = document.querySelectorAll('script[type="text/x-handlebars-template"]');
    for (var i = 0; i < templateNodes.length; i++) {
      const el = templateNodes[i];
      const text = el.innerHTML;
      const id = el.id;
      cachedTemplates[id] = Handlebars.compile(text);
    }
  };

  const render = function renderCachedTemplate(templateId, replacements) {
    return cachedTemplates[templateId](replacements);
  };

  const show = function showRenderedTemplateInRoot(templateId, data) {
    document.getElementById('root').innerHTML = render(templateId, data);
  };

  const parseJSON = function parseJSONFetchResponse(res) {
    return res.json();
  };

  const fetchConfig = function fetchAPIConfigFromLocal() {
    return fetch('/config.json').then(parseJSON);
  };

  const getPageURL = function getTransactionPageURL(config, pageNumber) {
    return config['API_TRANSACTIONS_URL'] + pageNumber + config['API_TRANSACTIONS_EXT'];
  };

  const fetchTransactions = function fetchAllTransactionPages(config) {
    var combinedTransactions;
    var currentPage = 1;
    const fetchPages = function recursivelyFetchTransactionPages() {
      return fetch(getPageURL(config, currentPage))
        .then(parseJSON)
        .then(function combineTransactions(transactionsObject) {
          if (!combinedTransactions) {
            combinedTransactions = transactionsObject;
          } else {
            combinedTransactions.transactions = combinedTransactions.transactions.concat(transactionsObject.transactions);
          }
          // Note: this trusts that the API provides correct "totalCount" values that are consistent across pages
          // and that all pages for these transactions are available and in order.
          if (combinedTransactions.transactions.length < combinedTransactions.totalCount) {
            currentPage++;
            return fetchPages();
          } else {
            return combinedTransactions;
          }
        });
    };
    return fetchPages();
  };

  const sumTransactions = function sumTransactionAmounts(transactions) {
    return transactions.reduce(function sum(s, t) {
      return s + Number(t.Amount);
    }, 0);
  };

  const showTransactions = function showRenderedTransactionsTemplate(transactionsObject) {
    transactionsObject.total = sumTransactions(transactionsObject.transactions);
    show('transactions-table-template', transactionsObject);
  };

  const handleError = function genericErrorHandler(err) {
    console.error(err);
    show('error-template', {
      message: 'The application encountered an error.'
    });
  };

})();
