/**
 * bigpipe-node is a sample on implementing bigpipe on node.js
 * Copyright (C) 2011  Jan Ehrhardt
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var http = require('http');
var jade = require('jade');
var Task = require('parallel').Task;

var database = {
  users: {
    tj: { name: 'tj', age: 23, email: 'tj@vision-media.ca', isA: 'human' },
    tobi: { name: 'tobi', age: 1, email: 'tobi@is-amazing.com', isA: 'ferret' }
  }
};

var findUserByName = function(name, callback) {
  if(name == "tj") {
    setTimeout(function() {callback(database.users[name]);}, 5000);
  }
  else {
    setTimeout(function() {callback(database.users[name]);}, 10000);
  }
};

var renderBody = function(response) {
  response.write('<body><div id="tj" class="user"></div><div id="tobi" class="user"></div>');

  var dataLoader = new Task();
  dataLoader.add(1, [findUserByName, 'tj']);
  dataLoader.add(2, [findUserByName, 'tobi']);
  
  dataLoader.bind(1, 2, function(user){
    var html = '<script type="text/javascript">renderUser(';
    html += JSON.stringify(user);
    html += ');</script>';
    response.write(html);
  });
  
  dataLoader.run(function(name, user) {
    if(null === name) {
      response.end('</body></html>');
    }
  });
};

var renderHeader = function(response) {
  var header = '<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv="Content-type" content="text/html; charset=utf-8">\n<title>Things</title>';
  header += '\n<style>.user {border:1px solid #0000ff;width: 500px;height: 50px;float: left;}</style>';
  header += '\n<script type="text/javascript">var renderUser = function(user) {\ndocument.getElementById(user.name).innerText = JSON.stringify(user)\n};\n</script>';
  header += '\n</head>';

  response.write(header);
};

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  renderHeader(response);
  renderBody(response);
}).listen(3000, "127.0.0.1");

console.log('Server running at http://127.0.0.1:3000/');
