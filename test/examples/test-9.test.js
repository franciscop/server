    /* test */
    const test = require('server/test');
    
    // The middleware function that we want to test. Just renders 'Hello world'
    const mid = ctx => 'Hello world';
    
    describe('simple route', () => {
      it('correctly returns a Hello world', async () => {
        const res = await test(mid).get('/');
        expect(res.body).toBe('Hello world');
        expect(res.status).toBe(200);
      });
    });