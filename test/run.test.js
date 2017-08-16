let run;

describe('run() main function', () => {
  it('is a function', async () => {
    run = require('./run');
    expect(run instanceof Function).toBe(true);
  });

  it('can be called empty', async () => {
    return run();
  });
});
