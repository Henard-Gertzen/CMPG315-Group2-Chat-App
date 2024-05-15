import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { toast } from "react-toastify";

const AddUser = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();


  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const searchedUser = querySnapShot.docs[0].data();
        if(searchedUser.id !== currentUser.id){
          const existingChatRef1 = collection(db, "userchats", currentUser.id, "chats");
          const existingChatQuery1 = query(existingChatRef1, where("recieverId", "==", searchedUser.id));

          const existingChatRef2 = collection(db, "userchats", searchedUser.id, "chats");
          const existingChatQuery2 = query(existingChatRef2, where("recieverId", "==", currentUser.id));

          const [existChatSnapshot1, existingChatSnapshot2] = await Promise.all([
            getDocs(existingChatQuery1),
            getDocs(existingChatQuery2),
          ]);

          if(existChatSnapshot1.empty && existingChatQuery2.empty){
            setUser(searchedUser);
            toast.done(searchedUser.username + " added successfully!");
          }
          else{
            toast.warn("Chat with " + searchedUser.username + " already exists!");
          }
        }      
        else{
          toast.warn("Cannot message yourself!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} disabled={user.id === currentUser.id}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;