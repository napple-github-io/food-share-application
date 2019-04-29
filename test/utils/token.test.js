require('dotenv').config();
const { tokenize, untokenize } = require('../../lib/utils/token');

describe('jwt', () => {
  it('creates a jwt...token', () => {
    const token = tokenize({ username: 'cara', email: 'email@stuff.things' });
    expect(token).toEqual(expect.any(String));
  });
});
