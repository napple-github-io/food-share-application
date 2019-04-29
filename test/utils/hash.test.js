const { hash, compare } = require('../../lib/utils/hash');

describe('hash tests', () => {
  const password = 'napplesaregreat';
  it('hashes a password', () => {
    return hash(password)
      .then(hashed => {
        expect(hashed).toEqual(expect.any(String));
        expect(hashed).not.toEqual(password);
      });
  });

  it('can compare passwords', () => {
    return hash(password)
      .then(created => {
        return compare(password, created);
      })
      .then(compareResult => {
        expect(compareResult).toBeTruthy();
      });
  });
});
