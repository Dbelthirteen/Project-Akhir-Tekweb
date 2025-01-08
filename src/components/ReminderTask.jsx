import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import homeIcon from "../homeIcon.png";
import { FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const ReminderTask = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const fetchTasks = async () => {
    try {
      const collections = ["todo", "inProgress", "done"];
      const snapshots = await Promise.all(
        collections.map((col) => getDocs(collection(db, col)))
      );

      setTasks(
        collections.reduce((acc, col, index) => {
          acc[col] = snapshots[index].docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
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

    fetchTasks();

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    try {
      const currentTime = new Date().toLocaleString();
      const newTask = { text: "", editable: true, timestamp: currentTime };
      const docRef = await addDoc(collection(db, "todo"), newTask);
      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, { id: docRef.id, ...newTask }],
      }));
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const updateTaskText = async (id, text, category) => {
    try {
      const taskDoc = doc(db, category, id);
      const currentTime = new Date().toLocaleString();

      if (text.trim() === "") {
        await deleteDoc(taskDoc);
        setTasks((prev) => ({
          ...prev,
          [category]: prev[category].filter((task) => task.id !== id),
        }));
      } else {
        await updateDoc(taskDoc, { text, editable: false, timestamp: currentTime });
        setTasks((prev) => ({
          ...prev,
          [category]: prev[category].map((task) =>
            task.id === id ? { ...task, text, editable: false, timestamp: currentTime } : task
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const deleteTask = async (id, category) => {
    try {
      const taskDoc = doc(db, category, id);
      await deleteDoc(taskDoc);
      setTasks((prev) => ({
        ...prev,
        [category]: prev[category].filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const moveTask = async (id, fromCategory, toCategory) => {
    try {
      const taskToMove = tasks[fromCategory].find((task) => task.id === id);
      if (!taskToMove) return;

      const taskDoc = doc(db, fromCategory, id);
      const currentTime = new Date().toLocaleString();

      await deleteDoc(taskDoc);

      const newDocRef = await addDoc(collection(db, toCategory), {
        text: taskToMove.text,
        editable: false,
        timestamp: currentTime,
      });

      setTasks((prev) => ({
        ...prev,
        [fromCategory]: prev[fromCategory].filter((task) => task.id !== id),
        [toCategory]: [...prev[toCategory], { id: newDocRef.id, text: taskToMove.text, editable: false, timestamp: currentTime }],
      }));
    } catch (error) {
      console.error("Error moving task: ", error);
    }
  };

  const getDynamicHeight = (taskCount) => {
    const baseHeight = 16;
    const taskHeight = 4;
    return `${baseHeight + taskCount * taskHeight}rem`;
  };

  const renderTasks = (category, nextCategory) => {
    return tasks[category].map((task) => (
      <div
        key={task.id}
        className="bg-blue-100 p-4 mb-4 rounded shadow flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          {task.editable ? (
            <input
              type="text"
              className="border w-full p-2 rounded"
              placeholder="Enter task details"
              value={task.text}
              onChange={(e) =>
                setTasks((prev) => ({
                  ...prev,
                  [category]: prev[category].map((t) =>
                    t.id === task.id ? { ...t, text: e.target.value } : t
                  ),
                }))
              }
              onBlur={(e) => updateTaskText(task.id, e.target.value.trim(), category)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateTaskText(task.id, e.target.value.trim(), category);
                }
              }}
              autoFocus
            />
          ) : (
            <span
              className="text-gray-700 flex-1 mr-2 cursor-pointer"
              onClick={() => {
                setTasks((prev) => ({
                  ...prev,
                  [category]: prev[category].map((t) =>
                    t.id === task.id ? { ...t, editable: true } : t
                  ),
                }));
              }}
            >
              {task.text}
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteTask(task.id, category)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
            {nextCategory && (
              <button
                onClick={() => moveTask(task.id, category, nextCategory)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiArrowRight />
              </button>
            )}
          </div>
        </div>
        <span className="text-gray-500 text-xs mt-2">
        {category === "todo" && task.timestamp
          ? `Created: ${task.timestamp}`
          : category === "inProgress" && task.timestamp
          ? `Last Updated: ${task.timestamp}`
          : category === "done" && task.timestamp
          ? `Done: ${task.timestamp}`
          : ""}
        </span>
      </div>
    ));
  };

  return (
    <div className="flex min-h-screen bg-[#ECF4FC]">
      <div
        className={`fixed top-0 left-0 h-full bg-[#9CBDD9] transition-all duration-300 ${
          sidebarVisible ? "w-[250px]" : "w-16"
        } z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#77ACD6] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          {sidebarVisible ? "<" : ">"}
        </button>

        <div
          className={`flex items-center h-[72px] w-full px-4 ${
            sidebarVisible ? "justify-start" : "justify-center"
          }`}
        >
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
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 py-3 px-4 hover:bg-[#77ACD6] rounded-lg text-white w-full"
          >
            <img
              src={homeIcon}
              alt="Home Icon"
              className="w-6 h-6 object-contain"
            />
            {sidebarVisible && <span className="text-lg font-medium">Dashboard</span>}
          </Link>
        </div>
      </div>

      <div
        className={`flex-1 ml-0 transition-all duration-300 ${
          sidebarVisible ? "md:ml-[250px]" : "md:ml-16"
        }`}
      >
        <div
          className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
            sidebarVisible ? "md:left-[250px]" : "md:left-16"
          } bg-[#9AC7E5] flex justify-between items-center px-6 py-4 z-40 h-[72px]`}
        >
          <h1 className="text-lg font-bold text-white">Reminder Your Task</h1>
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
          <div className="grid grid-cols-3 gap-4">
            <div
              className="bg-blue-200 p-4 rounded shadow"
              style={{ height: getDynamicHeight(tasks.todo.length) }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-blue-700">To Do</h2>
                <button
                  onClick={addTask}
                  className="bg-blue-500 text-white px-2 py-1 rounded shadow"
                >
                  <FiPlus />
                </button>
              </div>
              {renderTasks("todo", "inProgress")}
            </div>

            <div
              className="bg-blue-200 p-4 rounded shadow"
              style={{ height: getDynamicHeight(tasks.inProgress.length) }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-blue-700">In Progress</h2>
              </div>
              {renderTasks("inProgress", "done")}
            </div>

            <div
              className="bg-blue-200 p-4 rounded shadow"
              style={{ height: getDynamicHeight(tasks.done.length) }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-blue-700">Done</h2>
              </div>
              {renderTasks("done", null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderTask;