const port = require('./port');

describe('test/port', () => {
  it('can generate a random new port', () => {
    expect(typeof port()).toBe('number');
  });

  it('will not generate two times the same port', () => {
    const temp = port.picker;
    port.picker = () => 42;
    const first = port();
    expect(first).toBe(42);
    expect(() => port()).toThrow();
    port.picker = temp;
  });
});
