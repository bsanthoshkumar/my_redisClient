const stringParser = (response, index, responses) => {
  responses.push({ err: '', res: response[index].slice(1) });
  return 1;
};

const errorParser = (response, index, responses) => {
  responses.push({ err: response[index].slice(1), res: '' });
  return 1;
};

const integerParser = (response, index, responses) => {
  responses.push({ err: '', res: response[index].slice(1) });
  return 1;
};

const bulkStringParser = (response, index, responses) => {
  responses.push({ err: '', res: response[index + 1] });
  return 2;
};

const typeParser = {
  '+': stringParser,
  '-': errorParser,
  ':': integerParser,
  $: bulkStringParser,
  // '*': arrayParser,
};

const parseResponse = (response) => {
  const splitted = response.split('\r\n');
  const responses = [];
  let index = 0;
  while (index < splitted.length) {
    const symbol = splitted[index][0];
    if (Object.keys(typeParser).includes(symbol)) {
      move = typeParser[symbol](splitted, index, responses);
    }
    index += move;
  }
  return responses;
};

module.exports = { parseResponse };
