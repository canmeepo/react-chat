import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './app.css';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

//ACTIONS

const ADD_MESSAGE = 'ADD_MESAGE';

//ACTIONS CREATORS

function addMessage(nickname, message, date) {
  return {
    type: ADD_MESSAGE,
    payload: {
      nickname: nickname,
      message: message,
      date: date
    }
  };
}

//INITIAL STATE

const initialState = {
  current_user: {},
  messages: []
};

//REDUCERS

function MessagingApp(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        ...{
          messages: [
            ...state.messages,
            {
              nickname: action.payload.nickname,
              message: action.payload.message,
              date: action.payload.date
            }
          ]
        }
      };
    default:
      return state;
  }
}

//STORE

const serverState = {
  current_user: {
    nickname: 'name1',
    profile_picture: 'url'
  },
  messages: [
    {
      nickname: 'name2',
      message: 'Hi name1',
      date: '03/8/2017'
    },
    {
      nickname: 'name1',
      message: `Hi name2`,
      date: '03/8/2017'
    }
  ]
};

let store = createStore(MessagingApp, serverState);

let unsubscribe = store.subscribe(() => console.log(store.getState()));

//COMPONENTS

let SingleMessage = ({ message, current_user }) => {
  if (!(current_user.nickname == message.nickname)) {
    return (
      <div className="left-message">
        <p className="profile">
          {message.nickname}
          <br />
          {message.date}
        </p>
        <p className="message">
          {message.message}
        </p>
      </div>
    );
  } else {
    return (
      <div className="right-message">
        <p className="message">
          {message.message}
        </p>
        <p className="profile">
          You<br />
          {message.date}
        </p>
      </div>
    );
  }
};

let MessageApp = ({ messages }) =>
  <div>
    <div className="message-container">
      {messages.map(m => <SingleMessage message={m} />)}
    </div>
  </div>;

let AddMessage = ({ dispatch, current_user }) => {
  let input;
  return (
    <div className="formZone">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          let date = new Date();
          let messageDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
          dispatch(addMessage(current_user.nickname, input.value, messageDate));
          input.value = '';
        }}
      >
        <input
          ref={ref => {
            input = ref;
          }}
        />
        <button type="submit">SEND</button>
      </form>
    </div>
  );
};

// CONTAINERS

const singleMessage_mapStateToProps = state => {
  return {
    current_user: state.current_user
  };
};
SingleMessage = connect(singleMessage_mapStateToProps)(SingleMessage);

const messageApp_mapStateToProps = state => {
  return {
    messages: state.messages
  };
};
MessageApp = connect(messageApp_mapStateToProps)(MessageApp);

const addMessage_mapStateToProps = state => {
  return {
    current_user: state.current_user
  };
};
AddMessage = connect(addMessage_mapStateToProps)(AddMessage);

//APP

const Providers = Provider;

ReactDOM.render(
  <Providers store={store}>
    <div>
      <MessageApp />
      <AddMessage />
    </div>
  </Providers>,
  document.getElementById('root')
);
