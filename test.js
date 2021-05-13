const clipboardy = require('clipboardy');
const bufferData = JSON.stringify(Buffer.from('8308356052109357518f01020102feb75fd82ee25fd82ee20fdb2c7acf26be9b000000000000000200b60e22019affcc8f07000004a80500000030ec00000000000000000000000000000000', 'hex').toJSON());
clipboardy.writeSync(bufferData);
