"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TaskRow from "./TaskRow";
import { CreateTask } from "./CreateTask";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { useAuth } from "./ContextProvider";
import { PasswordReset } from "./PasswordReset";
import { DoorOpen } from "lucide-react";
import Loader from "./Loader";

const Dashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [taskUpdated, setTaskUpdated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 10;
  const { logout, user } = useAuth();

  async function getTasks() {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "GET",
      credentials: "include", // Include cookies (JWT token)
    });
    const data = await response.json();
    console.log("Get Tasks Response:", data);
    setTasks(data);
    setFilteredTasks(data);
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const filtered = tasks.filter((task) => {
      const matchesTag =
        selectedTags.length === 0 ||
        task.tags.some((tag: string) => selectedTags.includes(tag));
      const matchesSearch = task.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
    setFilteredTasks(filtered);
    setLoading(false);
  }, [selectedTags, searchQuery, tasks]);

  async function logoutUser() {
    console.log("logout here");
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "GET",
      credentials: "include", // Include cookies (JWT token)
    });
    const data = await response.json();
    console.log("Logout Response:", data);
    logout();
    router.push("/login");
  }

  useEffect(() => {
    setLoading(true);

    if (!user) {
      router.push("/login");
    }
    getTasks();
    setTimeout(() => {
        setLoading(false);
    }, 3000);
  }, [taskUpdated]); // Run this effect whenever delete is done, update or create is done

  const addTask = (newTask: any) => {
    setLoading(true);
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setFilteredTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskUpdated((prev) => !prev);
    setLoading(false);
  };

  // Calculate totals
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((task) => task.completed).length;
  const uncompletedTasks = totalTasks - completedTasks;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const style = `col-span-1 flex items-center justify-center sm:h-[10rem] h-[4rem] rounded-md text-white`;
  return (
    <div className="h-screen p-6 max-w-7xl mx-auto py-14 overflow-y-hidden">
      <div className="flex justify-end px-4 gap-4 items-center">
        <PasswordReset />
        <Button onClick={logoutUser}>
          <DoorOpen />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 h-auto gap-5 p-4">
        <div className={`bg-green-500 ${style}`}>
          <p>Total Completed Tasks: {completedTasks}</p>
        </div>
        <div className={`bg-blue-500 ${style}`}>
          <p>Total Tasks: {totalTasks}</p>
        </div>
        <div className={`bg-red-500 ${style}`}>
          <p>Total Uncompleted Tasks: {uncompletedTasks}</p>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <CreateTask addTask={addTask} />
      </div>
      <div className="px-5">
        <div className="flex-1 flex items-center gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Find Task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-2xl text-sm"
            />
          </div>
          <div className="flex gap-4 mb-4 flex-wrap">
            {["work", "school", "tech", "play"].map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  className="mr-2"
                />
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <div className="grid-cols-1 sm:grid-cols-15 text-sm font-semibold py-4 mt-3 px-4 text-center hidden sm:grid">
            <p className="col-span-3"> Name</p>
            <p className="col-span-5">Description</p>
            <p className="col-span-1">Status</p>
            <p className="col-span-2">Priority</p>
            <p className="col-span-2">Tags</p>
            <p className="col-span-2">Actions</p>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <div className=" overflow-y-scroll sm:overflow-hidden h-[40rem] sm:h-auto">
              {loading && <Loader />}

              {!loading &&
                currentTasks.map((task, i) => (
                  <div key={i}>
                    <TaskRow
                      addTask={addTask}
                      key={task.id}
                      id={task._id}
                      name={task.name}
                      description={task.description}
                      status={task.completed}
                      priority={task.priority}
                      tags={task.tags}
                    />
                  </div>
                ))}
              {currentTasks.length === 0 && !loading && (
                <div className="text-center text-gray-500 text-4xl py-10">
                  😢No tasks found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalTasks / tasksPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Dashboard;
