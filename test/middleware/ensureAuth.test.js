require('dotenv').config();
const { tokenize } = require('../../lib/utils/token');
const { ensureAuth } = require('../../lib/middleware/ensureAuth');

describe('ensureAuth middleware', () => {
  it('validates a valid token', done => {
    const token = tokenize({
      username: 'banana'
    });

    const req = { token };
    const res = {};
    const next = () => {
      expect(req.user).toEqual({ username: 'banana' });
      done();
    };
    
    ensureAuth(req, res, next);
  });
});
