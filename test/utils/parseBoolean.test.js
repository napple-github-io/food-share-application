const parseBoolean = require('../../lib/utils/parseBoolean');

describe('boolean parser', () => {
  it('parses a boolean', () => {
    const query = { dairy: 'true', gluten: 'true' };

    expect(parseBoolean(query)).toEqual({ 'dietary.dairy': true, 'dietary.gluten': true });
  });
});
