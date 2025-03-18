// Define the functions (as provided earlier)
async function signupUser(email, password) {
 try{
 const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  console.log("Signup Response:", data);
 }catch(err){
    console.error("Error during signup:", err);
 }
}

async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Login Response:", data);
  } catch (err) {
    console.error("Error during login:", err);
  }
}

async function getTasks() {
     try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          method: "GET",
          credentials: "include", // Include cookies (JWT token)
        });
        const data = await response.json();
        console.log("Get Tasks Response:", data);
     } catch (err) {
       console.error("Error during get tasks:", err);
     }
 
}

async function createTask(description) {
      try {
       const response = await fetch("http://localhost:3000/api/tasks", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ description }),
         credentials: "include", // Include cookies (JWT token)
       });
       const data = await response.json();
       console.log("Create Task Response:", data);
      } catch (err) {
        console.error("Error during create task:", err);
      }
  
}

async function updateTask(taskId, updates) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
          credentials: "include", // Include cookies (JWT token)
        }
      );
      const data = await response.json();
      console.log("Update Task Response:", data);
    } catch (err) {
      console.error("Error during update task:", err);
    }
  
}

async function deleteTask(taskId) {
      try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include", // Include cookies (JWT token)
        }
      );
      const data = await response.json();
      console.log("Delete Task Response:", data);
      } catch (err) {
        console.error("Error during delete task:", err);
      }
  
}

async function logoutUser() {
  try {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include", // Include cookies (JWT token)
    });
    const data = await response.json();
    console.log("Logout Response:", data);
  } catch (err) {
    console.error("Error during logout:", err);
  }
}

async function requestPasswordReset(email) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/request-password-reset",
     {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email: data.email }),
     }
   );
   const result = await response.json();
   console.log("Reset Password Response:", result);
  } catch (err) {
    console.error("Error during reset password:", err);
  }
}

async function resetPassword(token, password) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await response.json();
  } catch (error) {
    
  }
}

// Function to execute tasks sequentially with a 1-minute delay
async function executeTasks() {
  console.log("Starting task execution...");

  // Signup a new user
  await signupUser("lary3@example.com", "password-123");
  await delay(2000); // 1-minute delay

  // Login the user
  await loginUser("lary3@example.com", "password-123");
  await delay(2000); // 1-minute delay

  // Create a task
  await createTask("Complete the project", "description", "1", ["test"]);
  await delay(2000); // 1-minute delay

  // Fetch tasks
  await getTasks();
  await delay(2000); // 1-minute delay

  // Update a task (replace taskId with the actual ID)
  const taskId = "64f1b2c3e4b0a1b2c3d4e5f"; // Replace with a valid task ID
  await updateTask(taskId, { description: "Updated task", completed: true });
  await delay(20000); // 1-minute delay

  // Delete a task (replace taskId with the actual ID)
  await deleteTask(taskId);
  await delay(20000); // 1-minute delay

  // Request password reset
  await requestPasswordReset("lary3@example.com");
  await delay(20000); // 1-minute delay

  // Reset password
  await resetPassword("token", "newpassword");
  await delay(20000); // 1-minute delay

  // Logout the user
  await logoutUser();
  console.log("All tasks executed successfully.");
}

// Utility function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Execute the tasks
executeTasks();
