/* global document, fetch */
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL || 'https://github.com/Dmitry221060/Math-parser';

const submitBTN = document.querySelector('.submit');
const expressionINP = document.querySelector('.expression');
const resultElement = document.querySelector('.result');

submitBTN.onclick = submitExpression;
expressionINP.onkeypress = e => e.key === 'Enter' ? submitExpression() : null;

function submitExpression() {
  fetch('/calculate', {
    'headers': {
      'content-type': 'application/json',
    },
    'method': 'POST',
    'body': JSON.stringify({
      data: expressionINP.value,
    }),
  })
    .then(responce => {
      if (responce.status === 400) return showMessage('validation');
      if (responce.status === 500) return showMessage('internal');
      if (responce.status !== 200) return showMessage('unknown');
      responce.text().then(data => showMessage(null, data));
    });
}

const errors = {
  validation: () => `Validation error! Make sure that your input is correct and meets <a href="${GITHUB_REPO_URL}/blob/master/README.md#expressions-formatting">calculator rules</a>.`,
  internal: () => `Internal error! This should not happen, please <a href="${generateIssueURL()}">create Issue on GitHub</a>.`,
  unknown: () => 'Oh no, an unknown error has occurred! Most likely it is not related to the parser, check your network connection and try again later.',
};

function showMessage(errorType, result) {
  resultElement.classList.remove('error');
  resultElement.style.setProperty('display', 'block');

  if (result) return resultElement.innerText = result;

  resultElement.classList.add('error');
  const errorMessageBuilder = errors[errorType];
  if (!errorMessageBuilder) throw new Error(`Show message got unexpected error type: ${errorType}`);
  resultElement.innerHTML = errorMessageBuilder();
}

function generateIssueURL() {
  return encodeURI(`${GITHUB_REPO_URL}/issues/new?title=Parser sends internal error` +
    `&body=Expression caused error: \`${expressionINP.value}\`\n\n` +
    '// Hit "Submit new issue" button or add more information if you think it\'s necessary!');
}
