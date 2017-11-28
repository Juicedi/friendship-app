// 'use strict';
/**
 * Fetches and stores data for the other controllers.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const DataController = function (mainCtrl) {
  let userData = {};
  let categories = 'empty';
  let allEvents = 'empty';
  let allChats = 'empty';
  let allUsers = 'empty';
  let allMessages = 'empty';
  let selectedFilters = [];

  function addFilter(item) {
    if (selectedFilters.indexOf(item) === -1) {
      selectedFilters.push(item);
    }
  }

  function removeFilter(item) {
    if (selectedFilters.indexOf(item) !== -1) {
      selectedFilters.splice(selectedFilters.indexOf(item), 1);
    }
  }

  function clearFilters() {
    selectedFilters = [];
  }

  function getCategories(callback) {
    const url = 'data/categories.json';

    if (categories === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          categories = content;

          if (typeof callback !== 'undefined') {
            callback(content);
          }
          return content;
        },
        error: () => {
          console.log('Error: Couldn\'t get user informations');
        },
      });
    } else {
      if (typeof callback !== 'undefined') {
        callback(categories);
      }
      return categories;
    }
  }

  /**
   * Will filter througt all the events and put user event informations to a list.
   *
   * @param {Object} events - Object that has all event informations.
   * @return {Array} - List of only current user's events.
   */
  function filterUserEvents(events) {
    let eventObjList = [];
    for (let i = 0, len = userData.eventsAttending.length; i < len; i += 1) {
      eventObjList.push(events[userData.eventsAttending[i]]);
    }
    return eventObjList;
  }

  function checkLovesAndHates(user) {
    let result = false;

    for (let i = 0, len = userData.loves.length; i < len; i += 1) {
      if (user.loves.indexOf(userData.loves[i]) !== -1) {
        result = true;
      }
    }

    for (let i = 0, len = userData.hates.length; i < len; i += 1) {
      if (user.hates.indexOf(userData.hates[i]) !== -1) {
        result = true;
      }
    }

    return result;
  }

  function filterSuggestedUsers(users) {
    const userList = [];
    let found = 0;
    for (let i = 0; i < found || i < users.lenght; i += 1) {
      const match = checkLovesAndHates(users[i]);
      if (match) {
        userList.push(users[userData.eventsAttending[i]]);
        found += 1;
      }
    }
    return userList;
  }

  function filterChats(chats) {
    const ownChats = [];
    for (let i = 0, len = userData.chats.length; i < len; i += 1) {
      ownChats.push(chats[userData.chats[i]]);
    }
    return ownChats;
  }

  /**
   * Checks if selected filters match with the event tags
   *
   * @param {Object} event - Event object which tags will be checked
   * @returns {Boolean} - Returns true if filters matched with the event tags
   */
  function checkTags(event) {
    const tags = event.tags;
    let result = false;

    for (let i = 0, len = tags.length; i < len; i += 1) {
      if (selectedFilters.indexOf(tags[i]) !== -1) {
        result = true;
      }
    }

    return result;
  }

  /**
   * Filters events that are relevant to user
   * (This will be done mostly in the server when we get one)
   *
   * @param {Object} events - List of all events
   * @returns {Array} - Returns list of relevant event objects
   */
  function filterSuggestedEvents(events) {
    const eventObjList = [];
    const keys = Object.keys(events);

    for (let i = 0, len = keys.length; i < len; i += 1) {

      if (
        userData.eventsAttending.indexOf(events[keys[i]].id) === -1
        && events[keys[i]].owner !== userData.id
      ) {
        if (selectedFilters.length > 0) {
          if (checkTags(events[keys[i]])) {
            eventObjList.push(events[keys[i]]);
          }
        } else {
          eventObjList.push(events[keys[i]]);
        }
      }
    }
    return eventObjList;
  }

  /**
   * Gets user information from database.
   * @param {String} userName - Username which user information will be fetched.
   * @return {Object} - Returns all of the user information
   */
  function setCurrentUser(username) {
    const url = 'data/users.json';
    $.ajax({
      url,
      success: (content) => {
        userData = content[username];
        console.log('current user: ' + userData.id);
        return userData;
      },
      error: () => {
        console.log('Error: Couldn\'t get user informations');
      },
    });
  }

  /**
   *  Gets current users event informations.
   *  @return {Array} - Returns an array of objects which have the event informations
   */
  function getUserEvents() {
    if (allEvents === 'empty') {
      const url = 'data/events.json';
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          const events = filterUserEvents(content);
          mainCtrl.populateOwnEvents(events);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const events = filterUserEvents(allEvents);
      mainCtrl.populateOwnEvents(events);
    }
  }

  function getProfileInfo(userId, callback) {
    const url = 'data/users.json';
    let user = userId;

    if (userId === 'own') {
      user = userData.id;
    }

    if (allUsers === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          allUsers = content;
          if (typeof callback === 'function') {
            callback(allUsers[user]);
          } else {
            return allUsers[user];
          }
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else if (typeof callback === 'function') {
      callback(allUsers[user]);
    } else {
      return allUsers[user];
    }
  }

  function getEventInfo(eventId, callback) {
    const url = 'data/events.json';

    if (allEvents === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          if (typeof callback === 'function') {
            mainCtrl.fillEventInfo(content[eventId]);
          } else {
            return content[eventId];
          }
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else if (typeof callback === 'function') {
      mainCtrl.fillEventInfo(allEvents[eventId]);
    } else {
      return allEvents[eventId];
    }
  }

  /**
   *  Gets current users event informations.
   *  @return {Array} - Returns an array of objects which have the event informations
   */
  function getSuggestedEvents() {
    if (allEvents === 'empty') {
      const url = 'data/events.json';
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          const suggestedEvents = filterSuggestedEvents(content);
          mainCtrl.populateSearchEvents(suggestedEvents, '#suggested-events');
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const suggestedEvents = filterSuggestedEvents(allEvents);
      mainCtrl.populateSearchEvents(suggestedEvents, '#suggested-events');
    }
  }

  /**
   * Gets messages for a specific chat
   *
   * @param {String} id - Chat id
   * @param {Function} callback - Run after messages have been collected
   */
  function getChatMessages(id, callback) {
    if (allMessages === 'empty') {
      const url = 'data/messages.json';
      $.ajax({
        url,
        success: (content) => {
          allMessages = content;
          const chatMessages = allMessages[id];
          callback(chatMessages);
          return chatMessages;
        },
        error: () => {
          console.log('Error: Couldn\'t get messages');
        },
      });
    } else {
      const chatMessages = allMessages[id];
      callback(chatMessages);
      return chatMessages;
    }
  }

  /**
   * Goes through the chats and combines their information with chat messages.
   *
   * @param {Array} chats - Array of chat objects and their information
   * @param {Object} allMessages - Object with properties containing array of chat message objects
   */
  function filterChatMessages(chats, allMessages) {
    const messages = {};
    for (let i = 0, len = chats.length; i < len; i++) {
      messages[chats[i].chatId] = allMessages[chats[i].chatId];
    }
    return messages;
  }

  /**
   * Attach chat messages to the chat other data
   *
   * @param {Array} chats - Filtered chats in an array
   */
  function addMessages(chats, callback) {
    const chatData = {};
    chatData.chats = chats;
    chatData.messages = {};

    if (allMessages === 'empty') {
      const url = 'data/messages.json';
      $.ajax({
        url,
        success: (content) => {
          allMessages = content;
          const chatMessages = filterChatMessages(chats, allMessages);
          chatData.messages = chatMessages;
          callback(chatData);
          return chatData;
        },
        error: () => {
          console.log('Error: Couldn\'t get messages');
        },
      });
    } else {
      const chatMessages = filterChatMessages(chats, allMessages);
      chatData.messages = chatMessages;
      callback(chatData);
      return chatData;
    }
  }

  /**
   * Gets all chats the user is currently assigned to.
   *
   * @param {Function} callback - Callback function which is run after the data fetch
   */
  function getChatList(callback) {
    if (allChats === 'empty') {
      const url = 'data/chats.json';
      $.ajax({
        url,
        success: (content) => {
          allChats = content;
          const ownChats = filterChats(content);
          callback(ownChats, mainCtrl.populateChatList);
          return ownChats;
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const ownChats = filterChats(allChats);
      callback(ownChats, mainCtrl.populateChatList);
      return ownChats;
    }
  }

  function getSearchResults(searchInput) {
    const inputLower = searchInput.toLowerCase();
    const keys = Object.keys(allEvents);
    const length = keys.length;
    const found = [];

    for (let i = 0; i < length; i += 1) {
      const id = keys[i];

      if (allEvents[id].owner !== userData.id) {
        if (allEvents[id].title.toLowerCase() === inputLower) {
          found.push(allEvents[id]);
        } else if (allEvents[id].tags.indexOf(inputLower) !== -1) {
          found.push(allEvents[id]);
        }
      }
    }
    mainCtrl.populateSearchEvents(found, '#search-results');
  }

  /**
   * Check if event has available squads.
   *
   * @param {String} eventId - Events id.
   */
  function checkEventChats(eventInfo) {
    for (let i = 0, len = eventInfo.chats.length; i < len; i++) {
      const userNum = allChats[eventInfo.chats[i]].partisipants.length;

      if (userNum > 0 && userNum < 6) {
        return allChats[eventInfo.chats[i]];
      }
    }

    return null;
  }

  /**
   * Join or create squad for an event.
   */
  function joinSquadChat(eventInfo) {
    const randomNum = Math.floor(Math.random() * 1000000);
    let squad = checkEventChats(eventInfo).chatId;
    const userInfo = {
      id: userData.id,
      name: userData.name
    };

    if (squad === null) {
      squad = eventInfo.id + randomNum;
      allChats[squad] = {
        eventId: eventInfo.id,
        chatId: squad,
        name: eventInfo.title,
        image: `build/chats/${eventInfo.id}.jpg`,
        partisipants: []
      };
      allMessages[squad] = [];
    }

    userData.chats.push(squad);
    allChats[squad].partisipants.push(userInfo);
  }

  /**
   * Join or create chat for an event.
   */
  function joinEventChat(eventId) {
    const userInfo = {
      id: userData.id,
      name: userData.name
    };

    if (allChats === 'empty') {
      const url = 'data/chats.json';

      $.ajax({
        url,
        success: (content) => {
          allChats = content;

          if (typeof allChats[eventId] === 'undefined') {
            allChats[eventId] = {
              id: eventId,
              name: allEvents[eventId].name,
              image: `build/chat/${eventId}.jpg`,
              partisipants: []
            };
            allMessages[eventId] = [];
          }

          userData.chats.push(eventId);
          allChats[eventId].partisipants.push(userInfo);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      if (typeof allChats[eventId] === 'undefined') {
        allChats[eventId] = {
          eventId,
          chatId: eventId,
          name: allEvents[eventId].title,
          image: `build/chats/${eventId}.jpg`,
          partisipants: []
        };
        allMessages[eventId] = [];
      }

      userData.chats.push(eventId);
      allChats[eventId].partisipants.push(userInfo);
    }
  }

  /**
   * Adds user to the event participant list and eventChat.
   * @param {String} id - Event id given as a string.
   */
  function attendEvent(id) {
    const index = userData.eventsAttending.indexOf(id);

    if (index === -1) {
      userData.eventsAttending.push(id);
      allEvents[id].attending.push(userData.id);
    }

    if (allEvents[id].large === false) {
      joinEventChat(id);
    }
  }

  function createEvent(data) {
    allEvents[data.id] = data;
    attendEvent(data.id);
    mainCtrl.changePage('own_events');
  }

  function eventPrivacyToggle(id) {
    console.log('toggling privacy');
  }

  function addAttendee(name) {
    console.log('Added attendee' + name);
  }

  /**
   * Removes interest from user data.
   *
   * @param {String} value - Interests value.
   * @param {String} alignment - Is the interest loved or hated.
   */
  function removeInterest(value, alignment) {
    const valIndex = alignment === 'loves' ? userData.loves.indexOf(value) : userData.hates.indexOf(value);

    if (valIndex > -1) {
      userData[alignment].splice(valIndex, 1);
      allUsers[userData.id][alignment].splice(valIndex, 1);
    }
  }

  /**
   * Adds interest to user data.
   *
   * @param {String} value - Interests value.
   * @param {String} alignment - Is the interest loved or hated.
   */
  function addInterest(value, alignment) {
    if (alignment === 'loved') {
      userData.loves.push(value);
      allUsers[userData.id].loves.push(value);
      removeInterest(value, 'hates');
    } else if (alignment === 'hated') {
      userData.hates.push(value);
      allUsers[userData.id].hates.push(value);
      removeInterest(value, 'loves');
    }
  }

  /**
   * Removes user from squad chat they are currently in.
   *
   * @param {Object} eventInfo - All information of the event the users squad is in
   */
  function leaveSquadChat(eventInfo) {
    const id = eventInfo.id;
    const chatKeys = Object.keys(allChats);

    for (let i = 0, len = chatKeys.length; i < len; i++) {
      if (allChats[chatKeys[i]].eventId === id) {
        const bigChatIndex = userData.chats.indexOf(chatKeys[i]);
        const partisipants = allChats[chatKeys[i]].partisipants;

        if (bigChatIndex !== -1) {
          userData.chats.splice(bigChatIndex, 1);
        }

        for (let j = 0; j < partisipants.length; j++) {
          if (partisipants[j].id === userData.id) {
            partisipants.splice(j, 1);
          }
        }
      }
    }
  }

  /**
   * Removes user from given event.
   * @param {String} id - Event id given as a string.
   */
  function leaveEvent(id) {
    const index = userData.eventsAttending.indexOf(id);
    const chatKeys = Object.keys(allChats);
    const chatIndex = userData.chats.indexOf(id);

    if (index !== -1) {
      userData.eventsAttending.splice(index, 1);
    }

    // Also leave the event chat
    if (chatIndex !== -1) {
      userData.chats.splice(chatIndex, 1);
    }

    // If left event is a larger one, check what chat is user on and remove him from there
    for (let i = 0, len = chatKeys.length; i < len; i++) {
      if (allChats[chatKeys[i]].eventId === id) {
        const bigChatIndex = userData.chats.indexOf(chatKeys[i]);
        const partisipants = allChats[chatKeys[i]].partisipants;

        if (chatIndex === -1 && bigChatIndex !== -1) {
          userData.chats.splice(bigChatIndex, 1);
        }

        for (let j = 0; j < partisipants.length; j++) {
          if (partisipants[j].id === userData.id) {
            partisipants.splice(j, 1);
          }
        }
      }
    }
  }

  function removeEvent(id) {
    console.log('removed event' + id);
    leaveEvent(id);
    delete allEvents[id];
  }

  function removeTag(id, tag) {
    const index = allEvents[id].tags.indexOf(tag);
    allEvents[id].tags.splice(index, 1);
  }

  function changeEventOwner(id, newOwner) {
    console.log('changed ' + id + ' event\'s owner to ' + newOwner);
    leaveEvent(id);
    allEvents[id].owner = newOwner;
  }

  /**
   * Checks if the login information is correct.
   *
   * @param {String} id - User id.
   * @param {String} hash - Hash password.
   * @returns {Boolean}
   */
  function checkLoginInput(id, hash) {
    let result = true;

    if (typeof allUsers[id] === 'undefined') {
      result = false;
    } else if (allUsers[id].password !== hash) {
      result = false;
    }

    return result;
  }

  /**
   * Checks if the username is already taken.
   *
   * @param {String} name - Given username to be checked.
   * @returns {Boolean} Returns true if the username is not yet taken.
   */
  function checkNameAvailability(name) {
    let result = true;

    if (typeof allUsers[name] !== 'undefined') {
      result = false;
    }

    return result;
  }

  /**
   * Check if already on a squad chat.
   */
  function checkSquad(eventInfo) {
    const userChats = userData.chats;

    for (let i = 0, len = userChats.length; i < len; i++) {
      if (eventInfo.chats.indexOf(userChats[i]) > -1) {
        return eventInfo.chats.indexOf(userChats[i]);
      }
    }

    return null;
  }

  /**
   * Send message to the database (and other users?)
   *
   * @param {String} id - Chat id where the message is sent
   * @param {String} message - Message content
   */
  function sendMessage(id, message) {
    const currentDate = new Date();
    const newMessage = {
      id: Math.floor(Math.random() * 1000000),
      content: message,
      sender: userData.id,
      nickname: userData.nickname,
      date: currentDate.getTime()
    };

    allMessages[id].push(newMessage);
    mainCtrl.updateChat(newMessage);
  }

  return {
    initTempData() {
      const url = [
        'data/categories.json',
        'data/events.json',
        'data/chats.json',
        'data/users.json',
        'data/messages.json'
      ];

      for (let i = 0, len = url.length; i < len; i++) {
        $.ajax({
          url: url[i],
          success: (content) => {
            if (i === 0) {
              categories = content;
            } else if (i === 1) {
              allEvents = content;
            } else if (i === 2) {
              allChats = content;
            } else if (i === 3) {
              allUsers = content;
            } else if (i === 4) {
              allMessages = content;
            }
          },
          error: () => {
            console.log('Error: Couldn\'t get event informations');
          },
        });
      }
    },
    getCategories(callback) {
      return getCategories(callback);
    },
    setCurrentUser(user) {
      return setCurrentUser(user);
    },
    getCurrentUserData() {
      return userData;
    },
    getUserEvents() {
      return getUserEvents();
    },
    getEventInfo(eventId, callback) {
      return getEventInfo(eventId, callback);
    },
    getProfileInfo(userId, callback) {
      getProfileInfo(userId, callback);
    },
    getSuggestedEvents() {
      return getSuggestedEvents();
    },
    getSearchResults(searchInput) {
      getSearchResults(searchInput);
    },
    getChatMessages(id, callback) {
      getChatMessages(id, callback);
    },
    getChatList() {
      getChatList(addMessages);
    },
    createEvent(data) {
      createEvent(data);
    },
    addInterest(value, alignment) {
      addInterest(value, alignment);
    },
    addAttendee(id) {
      addAttendee(id);
    },
    getInterestFilters() {
      return selectedFilters;
    },
    addFilter(item) {
      addFilter(item);
    },
    removeFilter(item) {
      removeFilter(item);
    },
    clearFilters() {
      clearFilters();
    },
    joinSquadChat(eventInfo) {
      joinSquadChat(eventInfo);
    },
    attendEvent(id) {
      attendEvent(id);
    },
    leaveSquadChat(eventInfo) {
      leaveSquadChat(eventInfo);
    },
    leaveEvent(id) {
      leaveEvent(id);
    },
    eventPrivacyToggle(id) {
      eventPrivacyToggle(id);
    },
    removeInterest(value, alignment) {
      removeInterest(value, alignment);
    },
    removeEvent(id) {
      removeEvent(id);
    },
    removeTag(id, tag) {
      removeTag(id, tag);
    },
    checkLoginInput(id, hash) {
      return checkLoginInput(id, hash);
    },
    checkNameAvailability(name) {
      return checkNameAvailability(name);
    },
    checkSquad(eventInfo) {
      return checkSquad(eventInfo);
    },
    sendMessage(id, message) {
      sendMessage(id, message);
    },
    changeEventOwner(id, newOwner) {
      changeEventOwner(id, newOwner);
    },
  };
};
