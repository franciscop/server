    const test = require('server/test');
    
    // The middleware function that we want to test
    // in this example, find a user in the list
    const validTokens = ['t353459821389', 't547432523454', 't564352424223'];
    const mid = ctx => {
      if (validTokens.includes(ctx.query.token)) {
        return 'Valid!';
      }
      return 'Invalid :(';
    };
    
    describe('auth', () => {
      it('correctly handles admin or user emails', async () => {
        const validRes = await test(mid).get('/?token=t353459821389');
        expect(validRes.body).toBe('Valid!');
    
        const invalidRes = await test(mid).get('/?token=madeuptoken');
        expect(invalidRes.body).toBe('Invalid :(');
      });
    });
    
    /* test */
    // ...