// 'use strict';
const DataController = function () {
  const self = this;

  self.events = [
    {
      id: 'event34534534',
      title: 'Sting',
      eventImg: 'img/events/eventbg34534534.jpg',
      date: '28.09.2017',
      location: 'Helsinki',
      private: false,
      large: true,
      attending: ['ducky101', 'alan'],
      tags: ['music', 'rock', 'pop'],
      owner: 'testeri',
      groupsIds: ['sting_123', 'sting_54395']
    },
    {
      id: 'event123',
      title: 'Camping',
      eventImg: 'img/events/eventbg34534534.jpg',
      date: '28.10.2017',
      location: 'Hämeenlinna',
      private: true,
      large: false,
      attending: ['Alan'],
      tags: ['outdoor', 'camping', 'fishing'],
      owner: 'Ducky101',
    },
  ]

  self.eventGroup = {
    evtGrp0: {
      members: ['alan', 'ducky101'],
      chat: 'evtChat123',
    }
  }

  self.users = {
    'ducky101_123': {
      nickname: 'Ducky101',
      email: 'ducky@mail.fi',
      hash: '12034810289581dsfhakjhv92384',
      profileImage: 'img/users/ducky.jpg',
      profileBg: 'img/users/duckybg.jpg',
      chatBg: 'img/users/duckybg.jpg',
      interests: ['camping', 'fishing', 'rock'],
      hates: ['pop'],
      description: 'Hello I\'m Ducky101',
      location: 'Helsinki',
      friends: [234, 1234, 4356],
      searchRange: 12,
      eventsAttending: ['event123'],
      chatMute: false,
      chats: ['chat123'],
    }
  }

  self.login = {
    'ducky@mail.fi': {
      id: 'ducky101_123',
      hash: '1340998fdg0984098has098gha98ds',
    }
  }

  self.chatNames = {
    chat123: {
      name: 'testing chat',
    },
    evtChat123: {
      name: 'Sting chat',
    }
  }

  self.chatMembers = {
    chat123: {
      ducky101: true,
      alan: true,
    }
  }

  self.chatMessages = {
    chat123: {
      0: {
        sender: 'ducky101',
        message: 'Quack! Quack!',
        time: '21.10.2017 12.00'
      },
      1: {
        sender: 'alan',
        message: 'Hey! Let\'s meet up!',
        time: '21.10.2017 12.03'
      }
    },
    evtChat123: {
      0: {
        sender: 'ducky101',
        message: 'Quack! Quack!',
        time: '21.10.2017 12.00'
      },
      1: {
        sender: 'alan',
        message: 'Hey! Let\'s meet up!',
        time: '21.10.2017 12.03'
      }
    }
  }

  return {
    get() {
      return self.asldkj;
    },
  };
};
