"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface CreateTaskProps {
  addTask: (task: any) => void; 
}

export function CreateTask({ addTask }: CreateTaskProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    tags: [] as string[],
  });
  const [dialogOpen, setDialogOpen] = useState(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (tag: string) => {
    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) }; 
      } else {
        return { ...prev, tags: [...prev.tags, tag] }; 
      }
    });
  };

  async function createTask() {
    try{
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include", // Include cookies (JWT token)
    });
    const data = await response.json();
    if(response.ok){
      toast("Task created successfully", {
        description: "Please wait while we redirect you",
        duration: 3000,
        position: "bottom-right",
      });
      console.log("Create Task Response:", data);
      addTask(data); 
    }else{
        toast("Task creation failed", {
            description: "Please try again",
            duration: 3000,
            position: "bottom-right",
        });
    }

    // Reset state
    setFormData({
      name: "",
      description: "",
      priority: "",
      tags: [],
    });
    setDialogOpen(false); 
    }catch(error){
        console.error("Error creating task:", error);
    }
  } 


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Input
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tags</Label>
            <div className="col-span-3 flex flex-col">
              {["work", "school", "tech", "play"].map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={formData.tags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="mr-2"
                  />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createTask}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
