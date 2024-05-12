import Chat from "./components/chat/Chat";
import List from "./components/list/List";
import Detail from "./components/detail/Detail";
import Notification from "./components/notification/Notification";
import Login from "./components/login/Login";
import { invoke } from '@tauri-apps/api'
import { tauri } from "@tauri-apps/api";

const App = () => {

  const user = false
  return (
    <div className='container'>
      {
        user ? ( 
        <>
        <List/>
        <Chat/>
        <Detail/>
        </>
        ) : (
        <Login/>
      )}
      <Notification/>
    </div>
  );
};

export default App