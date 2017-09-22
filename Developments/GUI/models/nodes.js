var mongoose = require('mongoose');
var Schema = mongoose.Node;

var nodeSchema = new Schema({
    user: String,
    data: String,
    published_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('node', nodeSchema);
