import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { AuthenticatedRoute } from '../AuthenticatedRoute';
import { AutoDismissAlert } from '../AutoDismissAlert';
import { DesktopContainer } from '../DesktopContainer';
import { ChatContainer } from '../ChatContainer';
import { SignIn, SignOut, SignUp, ChangePassword } from '../Auth';
import { TaskBar } from '../TaskBar';
import { ChatAppContainer, ChatRoomList } from '../ChatAppContainer';
import { CreateChatRoom } from '../CreateChatRoom';
import { UpdateChatRoom } from '../UpdateChatRoom';

const App = ({ socket }) => {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatRoomName, setChatRoomName] = useState('');

  const clearUser = () => setUser(null);

  const alert = ({ heading, message, variant }) => {
    setAlerts(() => [...alerts, { heading, message, variant }]);
  };

  return (
    <DesktopContainer>
      {alerts.map((alert, index) => (
        <AutoDismissAlert
          key={index}
          heading={alert.heading}
          variant={alert.variant}
          message={alert.message}
        />
      ))}
      <Route
        exact
        path="/"
        render={() => (
          <ChatAppContainer>
            <SignIn alert={alert} setUser={setUser} />
          </ChatAppContainer>
        )}
      />
      <Route
        exact
        path="/sign-up"
        render={() => (
          <ChatAppContainer>
            <SignUp alert={alert} setUser={setUser} />
          </ChatAppContainer>
        )}
      />
      <AuthenticatedRoute
        user={user}
        path="/home"
        render={({ history }) => (
          <div>
            <ChatAppContainer user={user}>
              <ChatRoomList
                user={user}
                alert={alert}
                history={history}
                chatOpen={chatOpen}
                setChatOpen={setChatOpen}
                setChatRoomId={setChatRoomId}
                setChatRoomName={setChatRoomName}
              />
            </ChatAppContainer>
            {chatOpen && chatRoomId && (
              <ChatContainer
                socket={socket}
                alert={alert}
                chatRoomId={chatRoomId}
                setChatOpen={setChatOpen}
                user={user}
                chatRoomName={chatRoomName}
              />
            )}
          </div>
        )}
      />
      <AuthenticatedRoute
        user={user}
        path="/create-chatroom"
        render={() => (
          <ChatAppContainer>
            <CreateChatRoom user={user} alert={alert} />
          </ChatAppContainer>
        )}
      />
      <AuthenticatedRoute
        user={user}
        path="/update-chatroom"
        render={() => (
          <ChatAppContainer>
            <UpdateChatRoom user={user} alert={alert} />
          </ChatAppContainer>
        )}
      />
      <AuthenticatedRoute
        user={user}
        path="/change-password"
        render={() => (
          <ChatAppContainer>
            <ChangePassword user={user} alert={alert} />
          </ChatAppContainer>
        )}
      />
      <AuthenticatedRoute
        user={user}
        path="/sign-out"
        render={() => (
          <SignOut alert={alert} clearUser={clearUser} user={user} />
        )}
      />
      <TaskBar />
    </DesktopContainer>
  );
};

export default App;
