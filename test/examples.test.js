const path = require('path');
const fs=require('mz/fs');

function fromDir(startPath, filter, cb){
  if (!fs.existsSync(startPath)) return;
  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      fromDir(filename, filter, cb); //recurse
    }
    else if (filename.indexOf(filter)>=0) {
      cb(filename);
    };
  };
};

const getExamples = async () => {
  let matches = [];
  let files = [];
  fromDir(process.cwd() + '/docs', '.md', file => { files.push(file); });
  for (let file of files) {
    let text = await fs.readFile(file, 'utf-8');
    text.replace(/```[a-z]*\n[\s\S]*?\n```/g, code => {
      if (/\/\* ?test ?\*\//i.test(code)) {
        matches.push(code.split('\n').slice(1, -1).map(one => '    ' + one).join('\n'));
      }
    });
  }
  return matches;
};



const simple = ({ id, text }) => `// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content ${id}', () => {
  it('works', async () => {
    // START
    ${text}
    // END
  });
});`;



describe('fn', () => {
  it('loads', async () => {
    const matches = await getExamples();
    // console.log('Total tests found:', matches.length);
    for (let i in matches) {
      const filename = `${process.cwd()}/test/examples/test-${i}.test.js`;
      let code = matches[i];
      const content = /it\(/.test(matches[i]) ? matches[i]
        : simple({ id: i, text: matches[i] });
      try {
        const retrieved = await fs.readFile(filename, 'utf-8');
        if (retrieved !== content) {
          await fs.writeFile(filename, content, 'utf-8');
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          await fs.writeFile(filename, content, 'utf-8');
        } else {
          console.log(err);
        }
      }
      // console.log(content);
    }
  });
});
