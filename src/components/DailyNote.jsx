import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import homeIcon from "../homeIcon.png";
import {
  BsFillTrashFill,
  BsListUl,
} from "react-icons/bs";
import { MdFormatColorText } from "react-icons/md";

const DailyNote = () => {
    const [notes, setNotes] = useState({ public: [], private: [] });
    const [newNote, setNewNote] = useState({
      id: null,
      type: "public",
      content: "",
      title: "",
      fontSize: "16px",
      fontColor: "#000",
      fontFamily: "Arial",
    });
    const [user, setUser] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [showInput, setShowInput] = useState(false);
    const [privateNotePassword, setPrivateNotePassword] = useState("");
    const [visiblePrivateNoteId, setVisiblePrivateNoteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const fetchNotes = async () => {
      const q = query(collection(db, "notes"));
      onSnapshot(q, (querySnapshot) => {
        const publicNotes = [];
        const privateNotes = [];
        querySnapshot.forEach((doc) => {
          const data = { ...doc.data(), id: doc.id };
          if (data.type === "public") publicNotes.push(data);
          else privateNotes.push(data);
        });
        setNotes({ public: publicNotes, private: privateNotes });
      });
    };

    fetchNotes();
    return () => unsubscribe();
  }, []);

  const handleNoteSelection = (note) => {
    if (note.type === "public") {
      setNewNote(note);
      setShowInput(true);
    } else {
      setNewNote(note); // Set note untuk password validation
      setShowInput(true); // Tampilkan area editing
      setVisiblePrivateNoteId(note.id);
      setPrivateNotePassword(""); // Reset password input
    }
  };  

  const filterNotes = (notesArray) => {
    return notesArray.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
 
  const handlePasswordSubmit = (noteId) => {
    const selectedNote = notes.private.find((note) => note.id === noteId);
    if (selectedNote && privateNotePassword === selectedNote.password) {
      // Password benar, tampilkan isi note sepenuhnya
      setNewNote({ ...selectedNote, isPasswordVerified: true });
      setShowInput(true);
      setVisiblePrivateNoteId(null);
    } else {
      // Password salah
      alert("Incorrect password");
    }
    setPrivateNotePassword(""); // Reset input password
  };
  
  const addOrUpdateNote = async () => {
    // Pastikan bahwa title dan content tidak kosong
    if (newNote.title.trim() === "" || newNote.content.trim() === "") return;
    const currentTime = new Date().toLocaleString();
    const newTask = { text: "", editable: true, timestamp: currentTime };
  
    const updatedNote = {
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      fontSize: newNote.fontSize || "16px",  // Menambahkan nilai default jika undefined
      fontColor: newNote.fontColor || "#000", // Menambahkan nilai default jika undefined
      fontFamily: newNote.fontFamily || "Arial", // Menambahkan nilai default jika undefined
      password: newNote.type === "private" ? newNote.password : null,
      timestamp: serverTimestamp(),  // Menyimpan waktu pembuatan
    };
  
    if (newNote.id) {
      // Jika sudah ada id, update dokumen yang ada
      const noteRef = doc(db, "notes", newNote.id);
      await updateDoc(noteRef, updatedNote);
    } else {
      // Jika belum ada id, tambah dokumen baru
      await addDoc(collection(db, "notes"), updatedNote);
    }
  
    // Reset form setelah menambah atau memperbarui catatan
    setNewNote({
      id: null,
      type: "public",
      content: "",
      title: "",
      fontSize: "16px",
      fontColor: "#000",
      fontFamily: "Arial",
    });
    setShowInput(false);
  };
  
  const deleteNote = async (noteId) => {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
    setNewNote({
      id: null,
      type: "public",
      content: "",
      title: "",
      fontSize: "16px",
      fontColor: "#000",
      fontFamily: "Arial",
    });
    setShowInput(false);
  };

  const handleNoteClick = (note) => {
    setNewNote(note);
    setShowInput(true);
  };

  const handleNewNote = () => {
    setNewNote({
      id: null,
      type: "public",
      content: "",
      title: "",
      fontSize: "16px",
      fontColor: "#000",
      fontFamily: "Arial",
    });
    setShowInput(true);
  };


  return (
    <div className="flex min-h-screen bg-[#ECF4FC]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#9CBDD9] transition-all duration-300 ${sidebarVisible ? "w-[250px]" : "w-16"} z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#77ACD6] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          {sidebarVisible ? "<" : ">"}
        </button>

        <div className={`flex items-center h-[72px] w-full px-4 ${sidebarVisible ? "justify-start" : "justify-center"}`}>
          <img
            src="/logo.png"
            alt="Logo"
            className={`object-contain ${sidebarVisible ? "h-30 w-30" : "h-10 w-10"}`}
          />
          {sidebarVisible && (
            <h1 className="text-xl font-extrabold font-[Caveat] text-white ml-4">
              SahabatDiri
            </h1>
          )}
        </div>

        <div className={`space-y-4 w-full mt-8 ${!sidebarVisible && "text-center"}`}>
          <NavLink
            to="/dashboard"
            className="flex items-center space-x-3 py-3 px-4 hover:bg-[#77ACD6] rounded-lg text-white w-full"
          >
            <img
              src={homeIcon}
              alt="Home Icon"
              className="w-6 h-6 object-contain"
            />
            {sidebarVisible && <span className="text-lg font-medium">Dashboard</span>}
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ${sidebarVisible ? "md:ml-[250px]" : "md:ml-16"}`}
      >
        <div
          className={`fixed top-0 left-0 right-0 transition-all duration-300 ${sidebarVisible ? "md:left-[250px]" : "md:left-16"} bg-[#9AC7E5] flex justify-between items-center px-6 py-4 z-40 h-[72px]`}
        >
          <h1 className="text-lg font-bold text-white">Daily Note</h1>
          <div className="relative ml-auto">
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                {user?.displayName ? user.displayName[0] : "U"}
              </div>
            )}
          </div>
        </div>

        <div className="pt-[88px] p-8">
        <div className="mb-6">
  <input
    type="text"
    placeholder="Search notes by title..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full p-3 rounded-lg border border-gray-300"
  />
</div>

          <div className="grid grid-cols-2 gap-8">
            {/* Public Notes */}
            <div className="bg-blue-200 p-5 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Public</h2>
              <div className="space-y-4">
              {filterNotes(notes.public).map((note, index) => {

             // Debugging: Cek apakah timestamp ada
             console.log('Public Note Timestamp:', note.timestamp);

            const formattedTime = note.timestamp
           ? new Date(note.timestamp.seconds * 1000).toLocaleString()
           : "No timestamp";

          return (
           <div
              key={index}
             className="p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer"
             onClick={() => handleNoteClick(note)}
           >
            <h3
               className="font-semibold text-xl"
               style={{
                 fontFamily: note.fontFamily,
                 fontSize: note.fontSize,
                 color: note.fontColor,
               }}
              >
          {note.title}
          </h3>
            {/* Menampilkan waktu */}
            <div className="text-sm text-gray-500 mt-2">
              {formattedTime}
            </div>
       </div>
    );
})}
</div>
            </div>

            {/* Private Notes */}
            <div className="bg-blue-200 p-5 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Private</h2>
            <div className="space-y-4">
            {filterNotes(notes.private).map((note, index) => ( 
            <div
                key={index}
                className="p-4 bg-blue-100 rounded-lg shadow-md"
                onClick={() => handleNoteSelection(note)}
            >
            <h3
              className="font-semibold text-xl cursor-pointer"
              style={{
                fontFamily: note.fontFamily,
                fontSize: note.fontSize,
                color: note.fontColor,
                }}
            >
          {note.title}
            </h3>
            {/* Menambahkan waktu di pojok kiri bawah */}
            <div className="text-sm text-gray-500 mt-2">
            {/* Memastikan bahwa timestamp ditampilkan dalam format yang dapat dibaca */}
            {note.timestamp
              ? new Date(note.timestamp.seconds * 1000).toLocaleString()
              : ""}
      </div>
        {visiblePrivateNoteId === note.id ? (
          <div className="mt-2">
            <textarea
              className="p-2 w-full border rounded-lg text-sm"
              value={note.content}
              readOnly
              style={{
                fontFamily: note.fontFamily,
                fontSize: note.fontSize,
                color: note.fontColor,
                filter: privateNotePassword !== note.password ? "blur(4px)" : "none",
              }}
            />
            {privateNotePassword !== note.password && (
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={privateNotePassword}
                  onChange={(e) => setPrivateNotePassword(e.target.value)}
                  className="p-2 border rounded-lg w-full"
                />
                <button
                  onClick={() => handlePasswordSubmit(note.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 p-2 w-full bg-gray-100 text-sm text-gray-500 blur-sm">
            ************
          </div>
        )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New/Edit Note Input */}
          {showInput && (
            <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
              <div>
                <input
                  type="text"
                  placeholder="Masukkan judul di sini..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 text-xl font-semibold"
                />
              </div>
              <div className="mt-4">
              <textarea
  placeholder="Tulis isi catatan di sini..."
  value={newNote.type === "private" && newNote.password !== privateNotePassword ? "*****" : newNote.content}
  onChange={(e) =>
    setNewNote({ ...newNote, content: e.target.value })
  }
  className="w-full p-3 rounded-lg border border-gray-300 text-base"
  rows={5}
  readOnly={newNote.type === "private" && newNote.password !== privateNotePassword}
  style={{
    fontSize: newNote.fontSize,
    color: newNote.fontColor,
    fontFamily: newNote.fontFamily,
    filter: newNote.type === "private" && newNote.password !== privateNotePassword ? "blur(4px)" : "none",
  }}
/>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div>
                  <label className="block mb-1 text-gray-600">Font Color:</label>
                  <input
                    type="color"
                    value={newNote.fontColor}
                    onChange={(e) =>
                      setNewNote({ ...newNote, fontColor: e.target.value })
                    }
                    className="w-16 h-8 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Font Family:</label>
                  <select
                    value={newNote.fontFamily}
                    onChange={(e) =>
                      setNewNote({ ...newNote, fontFamily: e.target.value })
                    }
                    className="p-2 rounded-lg border border-gray-300"
                  >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Font Size:</label>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={parseInt(newNote.fontSize, 10)}
                    onChange={(e) =>
                      setNewNote({
                        ...newNote,
                        fontSize: e.target.value + "px",
                      })
                    }
                    className="w-20 p-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => deleteNote(newNote.id)}
                  className="text-red-500 text-sm"
                >
                  <BsFillTrashFill size={20} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <select
                  value={newNote.type}
                  onChange={(e) =>
                    setNewNote({ ...newNote, type: e.target.value })
                  }
                  className="p-2 rounded-lg border border-gray-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <button
                  onClick={addOrUpdateNote}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  {newNote.id ? "Save Changes" : "Add Note"}
                </button>
                <div className="mt-4">
                {newNote.type === "private" && (
            <div>
             <label className="block mb-1 text-gray-600">Password:</label>
             <input
              type="password"
              placeholder="Masukkan password"
              value={newNote.password || ""}
             onChange={(e) =>
               setNewNote({ ...newNote, password: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300"
            />
             </div>
             )}
            </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Button for Add New Note */}
        <button
          onClick={handleNewNote}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default DailyNote;