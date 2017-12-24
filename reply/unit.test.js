const reply = require('.');



describe('reply', () => {

  it('loads the main reply', () => {
    expect(reply).toEqual(require('server').reply);
    expect(reply).toEqual(require('server/reply'));
  });

  it('has the right methods defined', () => {
    expect(reply.cookie  ).toEqual(jasmine.any(Function));
    expect(reply.download).toEqual(jasmine.any(Function));
    expect(reply.end     ).toEqual(jasmine.any(Function));
    expect(reply.file    ).toEqual(jasmine.any(Function));
    expect(reply.header  ).toEqual(jasmine.any(Function));
    expect(reply.json    ).toEqual(jasmine.any(Function));
    expect(reply.jsonp   ).toEqual(jasmine.any(Function));
    expect(reply.redirect).toEqual(jasmine.any(Function));
    expect(reply.render  ).toEqual(jasmine.any(Function));
    expect(reply.send    ).toEqual(jasmine.any(Function));
    expect(reply.status  ).toEqual(jasmine.any(Function));
    expect(reply.type    ).toEqual(jasmine.any(Function));
  });

  it('can load all the methods manually', () => {
    expect(require('server/reply/cookie'  )).toEqual(reply.cookie);
    expect(require('server/reply/download')).toEqual(reply.download);
    expect(require('server/reply/end'     )).toEqual(reply.end);
    expect(require('server/reply/file'    )).toEqual(reply.file);
    expect(require('server/reply/header'  )).toEqual(reply.header);
    expect(require('server/reply/json'    )).toEqual(reply.json);
    expect(require('server/reply/jsonp'   )).toEqual(reply.jsonp);
    expect(require('server/reply/redirect')).toEqual(reply.redirect);
    expect(require('server/reply/render'  )).toEqual(reply.render);
    expect(require('server/reply/send'    )).toEqual(reply.send);
    expect(require('server/reply/status'  )).toEqual(reply.status);
    expect(require('server/reply/type'    )).toEqual(reply.type);
  });





  describe('reply: instances instead of global', () => {
    it('adds a method to the stack', () => {
      const mock = reply.file('./index.js');
      expect(mock.stack.length).toEqual(1);
      const inst = reply.file('./index.js');
      expect(inst.stack.length).toEqual(1);

      // Do not touch the global
      expect(mock.stack.length).toEqual(1);
    });

    it('adds several methods correctly', () => {
      const mock = reply.file('./index.js');
      expect(mock.stack.length).toEqual(1);
      const inst = reply.file('./index.js').file('./whatever.js');
      expect(inst.stack.length).toEqual(2);

      // Do not touch the global
      expect(mock.stack.length).toEqual(1);
    });
  });
});
