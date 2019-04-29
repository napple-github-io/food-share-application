require('dotenv').config();
const { tokenize, untokenize } = require('../../lib/utils/token');

describe('jwt', () => {
  it('creates a jwt...token', () => {
    const token = tokenize({ username: 'cara', email: 'email@stuff.things' });
    expect(token).toEqual(expect.any(String));
  });
  
  it('untokened', () => {
    const token = tokenize({ username: 'cara', email: 'email@stuff.things' });
    const untokened = untokenize(token);
    expect(untokened).toEqual({ username: 'cara', email: 'email@stuff.things' });
  });
});
