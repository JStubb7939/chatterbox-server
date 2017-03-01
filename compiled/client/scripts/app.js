'use strict';

var app = {

  //TODO: The current 'handleUsernameClick' function just toggles the class 'friend'
  //to all messages sent by the user
  server: 'http://127.0.0.1:3000/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},
  messages: [],

  init: function init() {
    // Get username
    app.username = window.location.search.substr(10);

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(function () {
      app.fetch(true);
    }, 3000);
  },

  send: function send(message) {
    // app.startSpinner();

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function success(data) {
        // Clear messages input
        app.$message.val('');

        // Trigger a fetch to update the messages, pass true to animate
        // app.fetch();
      },
      error: function error(_error) {
        console.error('chatterbox: Failed to send message', _error);
      }
    });
  },

  fetch: function fetch(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      // data: { order: '-createdAt' },
      contentType: 'application/json',
      success: function success(data) {
        // Don't bother if we have nothing to work with
        if (!data.results || !data.results.length) {
          return;
        }

        // Store messages for caching later
        app.messages = data.results;

        // Get the last message
        var mostRecentMessage = data.results[data.results.length - 1];

        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // Update the UI with the fetched rooms
          app.renderRoomList(data.results);

          // Update the UI with the fetched messages
          app.renderMessages(data.results, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function error(_error2) {
        console.error('chatterbox: Failed to fetch messages', _error2);
      }
    });
  },

  clearMessages: function clearMessages() {
    app.$chats.html('');
  },

  renderMessages: function renderMessages(messages, animate) {
    // Clear existing messages`
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages.filter(function (message) {
        return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
      }).forEach(app.renderMessage);
    }

    // Make it scroll to the top
    if (animate) {
      $('body').animate({ scrollTop: '0px' }, 'fast');
    }
  },

  renderRoomList: function renderRoomList(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function (message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.renderRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function renderRoom(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

  renderMessage: function renderMessage(message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // Create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // Add in the message data using DOM methods to avoid XSS
    // Store the username in the element's data attribute
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    // Add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    app.$chats.append($chat);
  },

  handleUsernameClick: function handleUsernameClick(event) {

    // Get username from data attribute
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];

      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      // Add 'friend' CSS class to all of that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function handleRoomChange(event) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.renderRoom(roomname);

        // Select the menu option
        app.$roomSelect.val(roomname);
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();
    }
    // Rerender messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function handleSubmit(event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    // Stop the form from submitting
    event.preventDefault();
  },

  startSpinner: function startSpinner() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function stopSpinner() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJzZXJ2ZXIiLCJ1c2VybmFtZSIsInJvb21uYW1lIiwibGFzdE1lc3NhZ2VJZCIsImZyaWVuZHMiLCJtZXNzYWdlcyIsImluaXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsIiRtZXNzYWdlIiwiJCIsIiRjaGF0cyIsIiRyb29tU2VsZWN0IiwiJHNlbmQiLCJvbiIsImhhbmRsZVVzZXJuYW1lQ2xpY2siLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVSb29tQ2hhbmdlIiwic3RhcnRTcGlubmVyIiwiZmV0Y2giLCJzZXRJbnRlcnZhbCIsInNlbmQiLCJtZXNzYWdlIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInN1Y2Nlc3MiLCJ2YWwiLCJlcnJvciIsImNvbnNvbGUiLCJhbmltYXRlIiwiY29udGVudFR5cGUiLCJyZXN1bHRzIiwibGVuZ3RoIiwibW9zdFJlY2VudE1lc3NhZ2UiLCJvYmplY3RJZCIsInJlbmRlclJvb21MaXN0IiwicmVuZGVyTWVzc2FnZXMiLCJjbGVhck1lc3NhZ2VzIiwiaHRtbCIsInN0b3BTcGlubmVyIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIiwiZm9yRWFjaCIsInJlbmRlck1lc3NhZ2UiLCJzY3JvbGxUb3AiLCJyb29tcyIsInJlbmRlclJvb20iLCIkb3B0aW9uIiwidGV4dCIsImFwcGVuZCIsIiRjaGF0IiwiJHVzZXJuYW1lIiwiYXR0ciIsImFwcGVuZFRvIiwiYWRkQ2xhc3MiLCJldmVudCIsInRhcmdldCIsInVuZGVmaW5lZCIsInNlbGVjdG9yIiwicmVwbGFjZSIsIiR1c2VybmFtZXMiLCJ0b2dnbGVDbGFzcyIsInNlbGVjdEluZGV4IiwicHJvcCIsInByb21wdCIsInByZXZlbnREZWZhdWx0Iiwic2hvdyIsImZhZGVPdXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEs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U0MsT0FBVDs7QUFFQTtBQUNBc0MsVUFBTVUsY0FBTjtBQUNELEdBL05POztBQWlPUnBELGdCQUFjLHdCQUFXO0FBQ3ZCUixNQUFFLGNBQUYsRUFBa0I2RCxJQUFsQjtBQUNBN0QsTUFBRSx5QkFBRixFQUE2QitDLElBQTdCLENBQWtDLFVBQWxDLEVBQThDLE1BQTlDO0FBQ0QsR0FwT087O0FBc09SZCxlQUFhLHVCQUFXO0FBQ3RCakMsTUFBRSxjQUFGLEVBQWtCOEQsT0FBbEIsQ0FBMEIsTUFBMUI7QUFDQTlELE1BQUUseUJBQUYsRUFBNkIrQyxJQUE3QixDQUFrQyxVQUFsQyxFQUE4QyxJQUE5QztBQUNEO0FBek9PLENBQVYiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuICAvL1RPRE86IFRoZSBjdXJyZW50ICdoYW5kbGVVc2VybmFtZUNsaWNrJyBmdW5jdGlvbiBqdXN0IHRvZ2dsZXMgdGhlIGNsYXNzICdmcmllbmQnXG4gIC8vdG8gYWxsIG1lc3NhZ2VzIHNlbnQgYnkgdGhlIHVzZXJcbiAgc2VydmVyOiAnaHR0cDovLzEyNy4wLjAuMTozMDAwL2NsYXNzZXMvbWVzc2FnZXMnLFxuICB1c2VybmFtZTogJ2Fub255bW91cycsXG4gIHJvb21uYW1lOiAnbG9iYnknLFxuICBsYXN0TWVzc2FnZUlkOiAwLFxuICBmcmllbmRzOiB7fSxcbiAgbWVzc2FnZXM6IFtdLFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vIEdldCB1c2VybmFtZVxuICAgIGFwcC51c2VybmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEwKTtcblxuICAgIC8vIENhY2hlIGpRdWVyeSBzZWxlY3RvcnNcbiAgICBhcHAuJG1lc3NhZ2UgPSAkKCcjbWVzc2FnZScpO1xuICAgIGFwcC4kY2hhdHMgPSAkKCcjY2hhdHMnKTtcbiAgICBhcHAuJHJvb21TZWxlY3QgPSAkKCcjcm9vbVNlbGVjdCcpO1xuICAgIGFwcC4kc2VuZCA9ICQoJyNzZW5kJyk7XG5cbiAgICAvLyBBZGQgbGlzdGVuZXJzXG4gICAgYXBwLiRjaGF0cy5vbignY2xpY2snLCAnLnVzZXJuYW1lJywgYXBwLmhhbmRsZVVzZXJuYW1lQ2xpY2spO1xuICAgIGFwcC4kc2VuZC5vbignc3VibWl0JywgYXBwLmhhbmRsZVN1Ym1pdCk7XG4gICAgYXBwLiRyb29tU2VsZWN0Lm9uKCdjaGFuZ2UnLCBhcHAuaGFuZGxlUm9vbUNoYW5nZSk7XG5cbiAgICAvLyBGZXRjaCBwcmV2aW91cyBtZXNzYWdlc1xuICAgIGFwcC5zdGFydFNwaW5uZXIoKTtcbiAgICBhcHAuZmV0Y2goZmFsc2UpO1xuXG4gICAgLy8gUG9sbCBmb3IgbmV3IG1lc3NhZ2VzXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBhcHAuZmV0Y2godHJ1ZSk7XG4gICAgfSwgMzAwMCk7XG4gIH0sXG5cbiAgc2VuZDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIC8vIGFwcC5zdGFydFNwaW5uZXIoKTtcblxuICAgIC8vIFBPU1QgdGhlIG1lc3NhZ2UgdG8gdGhlIHNlcnZlclxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IGFwcC5zZXJ2ZXIsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIC8vIENsZWFyIG1lc3NhZ2VzIGlucHV0XG4gICAgICAgIGFwcC4kbWVzc2FnZS52YWwoJycpO1xuXG4gICAgICAgIC8vIFRyaWdnZXIgYSBmZXRjaCB0byB1cGRhdGUgdGhlIG1lc3NhZ2VzLCBwYXNzIHRydWUgdG8gYW5pbWF0ZVxuICAgICAgICAvLyBhcHAuZmV0Y2goKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2NoYXR0ZXJib3g6IEZhaWxlZCB0byBzZW5kIG1lc3NhZ2UnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uKGFuaW1hdGUpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBhcHAuc2VydmVyLFxuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAvLyBkYXRhOiB7IG9yZGVyOiAnLWNyZWF0ZWRBdCcgfSxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vIERvbid0IGJvdGhlciBpZiB3ZSBoYXZlIG5vdGhpbmcgdG8gd29yayB3aXRoXG4gICAgICAgIGlmICghZGF0YS5yZXN1bHRzIHx8ICFkYXRhLnJlc3VsdHMubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgICAgIC8vIFN0b3JlIG1lc3NhZ2VzIGZvciBjYWNoaW5nIGxhdGVyXG4gICAgICAgIGFwcC5tZXNzYWdlcyA9IGRhdGEucmVzdWx0cztcblxuICAgICAgICAvLyBHZXQgdGhlIGxhc3QgbWVzc2FnZVxuICAgICAgICB2YXIgbW9zdFJlY2VudE1lc3NhZ2UgPSBkYXRhLnJlc3VsdHNbZGF0YS5yZXN1bHRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIC8vIE9ubHkgYm90aGVyIHVwZGF0aW5nIHRoZSBET00gaWYgd2UgaGF2ZSBhIG5ldyBtZXNzYWdlXG4gICAgICAgIGlmIChtb3N0UmVjZW50TWVzc2FnZS5vYmplY3RJZCAhPT0gYXBwLmxhc3RNZXNzYWdlSWQpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIFVJIHdpdGggdGhlIGZldGNoZWQgcm9vbXNcbiAgICAgICAgICBhcHAucmVuZGVyUm9vbUxpc3QoZGF0YS5yZXN1bHRzKTtcblxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgVUkgd2l0aCB0aGUgZmV0Y2hlZCBtZXNzYWdlc1xuICAgICAgICAgIGFwcC5yZW5kZXJNZXNzYWdlcyhkYXRhLnJlc3VsdHMsIGFuaW1hdGUpO1xuXG4gICAgICAgICAgLy8gU3RvcmUgdGhlIElEIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlXG4gICAgICAgICAgYXBwLmxhc3RNZXNzYWdlSWQgPSBtb3N0UmVjZW50TWVzc2FnZS5vYmplY3RJZDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdjaGF0dGVyYm94OiBGYWlsZWQgdG8gZmV0Y2ggbWVzc2FnZXMnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgY2xlYXJNZXNzYWdlczogZnVuY3Rpb24oKSB7XG4gICAgYXBwLiRjaGF0cy5odG1sKCcnKTtcbiAgfSxcblxuICByZW5kZXJNZXNzYWdlczogZnVuY3Rpb24obWVzc2FnZXMsIGFuaW1hdGUpIHtcbiAgICAvLyBDbGVhciBleGlzdGluZyBtZXNzYWdlc2BcbiAgICBhcHAuY2xlYXJNZXNzYWdlcygpO1xuICAgIGFwcC5zdG9wU3Bpbm5lcigpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgLy8gQWRkIGFsbCBmZXRjaGVkIG1lc3NhZ2VzIHRoYXQgYXJlIGluIG91ciBjdXJyZW50IHJvb21cbiAgICAgIG1lc3NhZ2VzXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlLnJvb21uYW1lID09PSBhcHAucm9vbW5hbWUgfHxcbiAgICAgICAgICAgICAgICAgYXBwLnJvb21uYW1lID09PSAnbG9iYnknICYmICFtZXNzYWdlLnJvb21uYW1lO1xuICAgICAgICB9KVxuICAgICAgICAuZm9yRWFjaChhcHAucmVuZGVyTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBpdCBzY3JvbGwgdG8gdGhlIHRvcFxuICAgIGlmIChhbmltYXRlKSB7XG4gICAgICAkKCdib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAnMHB4J30sICdmYXN0Jyk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlclJvb21MaXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIGFwcC4kcm9vbVNlbGVjdC5odG1sKCc8b3B0aW9uIHZhbHVlPVwiX19uZXdSb29tXCI+TmV3IHJvb20uLi48L29wdGlvbj4nKTtcblxuICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgdmFyIHJvb21zID0ge307XG4gICAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIHJvb21uYW1lID0gbWVzc2FnZS5yb29tbmFtZTtcbiAgICAgICAgaWYgKHJvb21uYW1lICYmICFyb29tc1tyb29tbmFtZV0pIHtcbiAgICAgICAgICAvLyBBZGQgdGhlIHJvb20gdG8gdGhlIHNlbGVjdCBtZW51XG4gICAgICAgICAgYXBwLnJlbmRlclJvb20ocm9vbW5hbWUpO1xuXG4gICAgICAgICAgLy8gU3RvcmUgdGhhdCB3ZSd2ZSBhZGRlZCB0aGlzIHJvb20gYWxyZWFkeVxuICAgICAgICAgIHJvb21zW3Jvb21uYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdCB0aGUgbWVudSBvcHRpb25cbiAgICBhcHAuJHJvb21TZWxlY3QudmFsKGFwcC5yb29tbmFtZSk7XG4gIH0sXG5cbiAgcmVuZGVyUm9vbTogZnVuY3Rpb24ocm9vbW5hbWUpIHtcbiAgICAvLyBQcmV2ZW50IFhTUyBieSBlc2NhcGluZyB3aXRoIERPTSBtZXRob2RzXG4gICAgdmFyICRvcHRpb24gPSAkKCc8b3B0aW9uLz4nKS52YWwocm9vbW5hbWUpLnRleHQocm9vbW5hbWUpO1xuXG4gICAgLy8gQWRkIHRvIHNlbGVjdFxuICAgIGFwcC4kcm9vbVNlbGVjdC5hcHBlbmQoJG9wdGlvbik7XG4gIH0sXG5cbiAgcmVuZGVyTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIGlmICghbWVzc2FnZS5yb29tbmFtZSkge1xuICAgICAgbWVzc2FnZS5yb29tbmFtZSA9ICdsb2JieSc7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgZGl2IHRvIGhvbGQgdGhlIGNoYXRzXG4gICAgdmFyICRjaGF0ID0gJCgnPGRpdiBjbGFzcz1cImNoYXRcIi8+Jyk7XG5cbiAgICAvLyBBZGQgaW4gdGhlIG1lc3NhZ2UgZGF0YSB1c2luZyBET00gbWV0aG9kcyB0byBhdm9pZCBYU1NcbiAgICAvLyBTdG9yZSB0aGUgdXNlcm5hbWUgaW4gdGhlIGVsZW1lbnQncyBkYXRhIGF0dHJpYnV0ZVxuICAgIHZhciAkdXNlcm5hbWUgPSAkKCc8c3BhbiBjbGFzcz1cInVzZXJuYW1lXCIvPicpO1xuICAgICR1c2VybmFtZS50ZXh0KG1lc3NhZ2UudXNlcm5hbWUgKyAnOiAnKS5hdHRyKCdkYXRhLXJvb21uYW1lJywgbWVzc2FnZS5yb29tbmFtZSkuYXR0cignZGF0YS11c2VybmFtZScsIG1lc3NhZ2UudXNlcm5hbWUpLmFwcGVuZFRvKCRjaGF0KTtcblxuICAgIC8vIEFkZCB0aGUgZnJpZW5kIGNsYXNzXG4gICAgaWYgKGFwcC5mcmllbmRzW21lc3NhZ2UudXNlcm5hbWVdID09PSB0cnVlKSB7XG4gICAgICAkdXNlcm5hbWUuYWRkQ2xhc3MoJ2ZyaWVuZCcpO1xuICAgIH1cblxuICAgIHZhciAkbWVzc2FnZSA9ICQoJzxicj48c3Bhbi8+Jyk7XG4gICAgJG1lc3NhZ2UudGV4dChtZXNzYWdlLnRleHQpLmFwcGVuZFRvKCRjaGF0KTtcblxuICAgIC8vIEFkZCB0aGUgbWVzc2FnZSB0byB0aGUgVUlcbiAgICBhcHAuJGNoYXRzLmFwcGVuZCgkY2hhdCk7XG5cbiAgfSxcblxuICBoYW5kbGVVc2VybmFtZUNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgLy8gR2V0IHVzZXJuYW1lIGZyb20gZGF0YSBhdHRyaWJ1dGVcbiAgICB2YXIgdXNlcm5hbWUgPSAkKGV2ZW50LnRhcmdldCkuZGF0YSgndXNlcm5hbWUnKTtcblxuICAgIGlmICh1c2VybmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBUb2dnbGUgZnJpZW5kXG4gICAgICBhcHAuZnJpZW5kc1t1c2VybmFtZV0gPSAhYXBwLmZyaWVuZHNbdXNlcm5hbWVdO1xuXG4gICAgICAvLyBFc2NhcGUgdGhlIHVzZXJuYW1lIGluIGNhc2UgaXQgY29udGFpbnMgYSBxdW90ZVxuICAgICAgdmFyIHNlbGVjdG9yID0gJ1tkYXRhLXVzZXJuYW1lPVwiJyArIHVzZXJuYW1lLnJlcGxhY2UoL1wiL2csICdcXFxcXFxcIicpICsgJ1wiXSc7XG5cbiAgICAgIC8vIEFkZCAnZnJpZW5kJyBDU1MgY2xhc3MgdG8gYWxsIG9mIHRoYXQgdXNlcidzIG1lc3NhZ2VzXG4gICAgICB2YXIgJHVzZXJuYW1lcyA9ICQoc2VsZWN0b3IpLnRvZ2dsZUNsYXNzKCdmcmllbmQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlUm9vbUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIHZhciBzZWxlY3RJbmRleCA9IGFwcC4kcm9vbVNlbGVjdC5wcm9wKCdzZWxlY3RlZEluZGV4Jyk7XG4gICAgLy8gTmV3IHJvb20gaXMgYWx3YXlzIHRoZSBmaXJzdCBvcHRpb25cbiAgICBpZiAoc2VsZWN0SW5kZXggPT09IDApIHtcbiAgICAgIHZhciByb29tbmFtZSA9IHByb21wdCgnRW50ZXIgcm9vbSBuYW1lJyk7XG4gICAgICBpZiAocm9vbW5hbWUpIHtcbiAgICAgICAgLy8gU2V0IGFzIHRoZSBjdXJyZW50IHJvb21cbiAgICAgICAgYXBwLnJvb21uYW1lID0gcm9vbW5hbWU7XG5cbiAgICAgICAgLy8gQWRkIHRoZSByb29tIHRvIHRoZSBtZW51XG4gICAgICAgIGFwcC5yZW5kZXJSb29tKHJvb21uYW1lKTtcblxuICAgICAgICAvLyBTZWxlY3QgdGhlIG1lbnUgb3B0aW9uXG4gICAgICAgIGFwcC4kcm9vbVNlbGVjdC52YWwocm9vbW5hbWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuc3RhcnRTcGlubmVyKCk7XG4gICAgICAvLyBTdG9yZSBhcyB1bmRlZmluZWQgZm9yIGVtcHR5IG5hbWVzXG4gICAgICBhcHAucm9vbW5hbWUgPSBhcHAuJHJvb21TZWxlY3QudmFsKCk7XG4gICAgfVxuICAgIC8vIFJlcmVuZGVyIG1lc3NhZ2VzXG4gICAgYXBwLnJlbmRlck1lc3NhZ2VzKGFwcC5tZXNzYWdlcyk7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgdXNlcm5hbWU6IGFwcC51c2VybmFtZSxcbiAgICAgIHRleHQ6IGFwcC4kbWVzc2FnZS52YWwoKSxcbiAgICAgIHJvb21uYW1lOiBhcHAucm9vbW5hbWUgfHwgJ2xvYmJ5J1xuICAgIH07XG5cbiAgICBhcHAuc2VuZChtZXNzYWdlKTtcblxuICAgIC8vIFN0b3AgdGhlIGZvcm0gZnJvbSBzdWJtaXR0aW5nXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcblxuICBzdGFydFNwaW5uZXI6IGZ1bmN0aW9uKCkge1xuICAgICQoJy5zcGlubmVyIGltZycpLnNob3coKTtcbiAgICAkKCdmb3JtIGlucHV0W3R5cGU9c3VibWl0XScpLmF0dHIoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgfSxcblxuICBzdG9wU3Bpbm5lcjogZnVuY3Rpb24oKSB7XG4gICAgJCgnLnNwaW5uZXIgaW1nJykuZmFkZU91dCgnZmFzdCcpO1xuICAgICQoJ2Zvcm0gaW5wdXRbdHlwZT1zdWJtaXRdJykuYXR0cignZGlzYWJsZWQnLCBudWxsKTtcbiAgfVxufTtcbiJdfQ==