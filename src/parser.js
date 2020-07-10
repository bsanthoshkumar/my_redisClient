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

const arrayParser = (response, index, responses) => {
  const length = +response[index].slice(1);
  const tempResponses = [];
  let idx = index + 1;
  while (tempResponses.length != length) {
    const symbol = response[idx][0];
    if (symbol in typeParser) {
      move = typeParser[symbol](response, idx, tempResponses);
    }
    idx += move;
  }

  responses.push({ res: tempResponses.map(({ res, err }) => res) });
  return idx - index;
};

const typeParser = {
  '+': stringParser,
  '-': errorParser,
  ':': integerParser,
  $: bulkStringParser,
  '*': arrayParser,
};

const parseResponse = (response) => {
  const splitted = response.split('\r\n');
  const responses = [];
  let index = 0;
  while (index < splitted.length) {
    const symbol = splitted[index][0];
    if (symbol in typeParser) {
      move = typeParser[symbol](splitted, index, responses);
    }
    index += move;
  }
  return responses;
};

module.exports = { parseResponse };
