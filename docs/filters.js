module.exports.noheader = block => {
  return block.replace(/<h1[^>]*>[^<]*<\/h1>/, '');
}
