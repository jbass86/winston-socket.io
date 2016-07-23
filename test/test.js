
var vows = require('vows');
var assert = require('assert');
var winston = require('winston');
var SocketIO = require('../lib/winston-socketio').SocketIO;


require("../lib/winston-socketio");

vows.describe("winston-socketio").addBatch({

  "Create Instance of the transport": {
    topic: function(){
      return new SocketIO({});
    },

    "is this an instance of the transport": function(topic){
      assert.instanceOf(topic, SocketIO);
    }
  }
}).export(module);
