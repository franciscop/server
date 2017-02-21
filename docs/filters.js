// Should be okay
module.exports.noheader = block => block.replace(/<h1.*>.+?<\/h1>/g, '');
