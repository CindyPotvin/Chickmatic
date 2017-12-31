var hbs  = require('express-handlebars');
var leftPad  = require('left-pad');

function hbsHelpers(hbs) {
    return hbs.create({
      extname: '.html',
      defaultLayout: 'index',
      layoutsDir: "views/",
      helpers: { // This was missing
        times: function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i) {
                block.data.index = i;
                block.data.first = i === 0;
                block.data.last = i === (n - 1);
                accum += block.fn(this);
            }
            return (accum);
        },
      leftPadNumbers: function(number) {
        return (leftPad(String(number), 2, '0'));
        }
      }
    });
  }
  
  module.exports = hbsHelpers;