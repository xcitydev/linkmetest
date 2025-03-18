import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CheckIcon, TrashIcon, XIcon } from "lucide-react";
import { toast } from "sonner";


const TaskRow = ({
  name,
  description,
  status,
  id,
  priority,
  addTask,
  tags,
}: {
  name: string;
  description: string;
  status: string;
  id: string;
  priority: number;
  tags: string[];
  addTask: (task: any) => void;
}) => {
  async function updateTaskCompletion(taskId: string) {
 
    console.log("taskId", taskId);
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: true }), 
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast("Task update failed", {
          description: "Please try again",
          duration: 3000,
          position: "bottom-right",
        });
        return;
      }

      toast("Task updated successfully", {
        description: "Please wait while we redirect you",
        duration: 3000,
        position: "bottom-right",
      });
      const updatedTask = await response.json();
      console.log("Task updated successfully:", updatedTask);
      addTask(updatedTask); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function deleteTask(taskId: string) {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include", // Include cookies (JWT token)
    });
    const data = await response.json();
    if(response.ok){
      toast("Task deleted successfully", {
        description: "Please wait while we redirect you",
        duration: 3000,
        position: "bottom-right",
      });
      console.log("Delete Task Response:", data);
      addTask(data);
    }else{
      toast("Task deletion failed", {
        description: "Please try again",
        duration: 3000,
        position: "bottom-right",
      });
    }
  }

  // Function to determine badge color based on priority
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return (
          <Badge variant="outline" className="bg-green-500 text-white">
            High
          </Badge>
        );
      case 2:
        return (
          <Badge variant="outline" className="bg-orange-500 text-white">
            Medium
          </Badge>
        );
      case 3:
        return (
          <Badge variant="outline" className="bg-red-500 text-white">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sm:grid sm:grid-cols-15 text-sm font-semibold py-4 mt-3 px-4 text-center cursor-pointer hover:bg-gray-100/10 transition-all duration-200">
      {/* Mobile view - vertical layout */}
      <div className="flex flex-col gap-4 sm:hidden bg-gray-100/10 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-bold">Name:</span>
          <span>{name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Description:</span>
          <span>{description}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Status:</span>
          <span>
            {status ? (
              <CheckIcon className="text-green-500" />
            ) : (
              <XIcon className="text-red-500" />
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Priority:</span>
          <span>{getPriorityBadge(Number(priority))}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Tags:</span>
          <div className="flex gap-2 flex-wrap justify-end">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-4 py-1 text-white bg-black"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={() => deleteTask(id)}>
            <TrashIcon />
          </Button>
          <Button onClick={() => updateTaskCompletion(id)}>
            <CheckIcon />
          </Button>
        </div>
      </div>

      {/* Desktop view - horizontal layout */}
      <div className="hidden sm:contents">
        <p className="col-span-3">{name}</p>
        <p className="col-span-5">{description}</p>
        <p className="col-span-1 flex items-center justify-center">
          {status ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
        </p>
        <p className="col-span-2">{getPriorityBadge(Number(priority))}</p>
        <p className="col-span-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="px-4 py-1 text-white bg-black"
            >
              {tag}
            </Badge>
          ))}
        </p>
        <div className="col-span-2 flex gap-2 items-center justify-center">
          <Button onClick={() => deleteTask(id)}>
            <TrashIcon />
          </Button>
          <Button onClick={() => updateTaskCompletion(id)}>
            <CheckIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
