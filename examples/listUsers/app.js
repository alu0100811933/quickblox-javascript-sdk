/*
 * Sample JavaScript app using some of the QuckBlock WebSDK APIs
 *
 * Author: Dan Murphy (dan@quickblox.com)
 *
 */

(function () {
  APP = new App();
  $(document).ready(function(){APP.init();});
}());

function App(){
  console.debug('App constructed');
}

App.prototype.init = function(){
  var _this= this;
  this.compileTemplates();
  $('#sessionButton').click(function(e){_this.createSession(e); return false;});
  $('#sessionDeleteButton').click(function(e){_this.deleteSession(e); return false;});
  $('#listUsersButton').click(function(e){_this.listUsers(e); return false;});
};

App.prototype.compileTemplates = function(){
  var template = $('#users-template').html();
  this.usersTemplate = Handlebars.compile(template);
};

App.prototype.createSession = function(e){
  var form, appId, authKey, secret;
  console.debug('createSession', e);
  form = $('#apiSession');
  appId = form.find('#appId')[0].value;
  authKey = form.find('#authKey')[0].value;
  secret = form.find('#secret')[0].value;
  console.debug(form, appId, authKey, secret);
  QB.init(appId,authKey,secret, true);
  QB.createSession(function(err,result){
    console.debug('Session create callback', err, result);
    if (result){
      $('#session').append('<p><em>Created session token<em>: ' + result.token + '</p>');
      $('#sessionDeleteButton').removeAttr('disabled');
    } else {
      $('#session').append('<p><em>Error creating session token<em>: ' + JSON.stringify(err)+'</p>');
    }
  });
};

App.prototype.deleteSession = function(e){
  var token = QB.session.token;
  console.debug('deleteSession', e);
  QB.destroySession(function(err, result){
    console.debug('Session destroy callback', err, result);
    if (result) {
      $('#session').append('<p><em>Deleted session token</em>: ' + token + '</p>');
      $('#sessionDeleteButton').attr('disabled', true);
    } else {
      $('#session').append('<p><em>Error occured deleting session token</em>: ' + JSON.stringify(err) + '</p>');
    }
  });
};

App.prototype.listUsers= function(e){
  var form, filterType, filterValue, perPage, pageNo, params = {}, _this= this;
  console.debug('listUsers', e);
  form = $('#listUsers');
  filterType = form.find('#userType')[0].value;
  filterValue = form.find('#userFilter')[0].value;
  if (filterType && filterValue) {
    params.filter = {};
    params.filter.type = filterType;
    params.filter.value = filterValue;
  }
  perPage = parseInt(form.find('#per_page')[0].value, 10);
  pageNo = parseInt(form.find('#page')[0].value, 10);
  if (typeof perPage === 'number') {params.perPage = perPage;}
  if (typeof pageNo === 'number') {params.pageNo = pageNo;}
  $('#users').find('h4').remove();
  $('#users').find('p').remove();
  QB.users.listUsers(params, function(err,result){
    console.debug('Users callback', err, result);
    if (result) {
      $('#userList').empty();
      $('#userList').append(_this.usersTemplate(result));
    } else {
      $('#usersList').append('<em>Error retrieving users</em>:' + JSON.stringify(err));
    }
  });
}
