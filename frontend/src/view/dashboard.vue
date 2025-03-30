<template>
     <!-- Navbar -->
    <nav class="navbar">
      <div class="container navbar-container">
        <a href="#" class="navbar-logo">{{ username }}</a>
        
        <ul class="navbar-menu"  @click="logoutUser">
          <li class="navbar-item">
            <button class="navbar-link active">Logout</button>
          </li>
        </ul>
        
        <!-- Mobile menu toggle -->
        <input type="checkbox" id="mobile-menu-toggle" class="navbar-toggle">
        <label for="mobile-menu-toggle" class="mobile-menu-button">
          <span class="mobile-menu-icon"></span>
        </label>
      </div>
      <!-- Mobile menu -->
      <div class="mobile-menu">
        <ul class="mobile-menu-list">
          <li class="mobile-menu-item">
            <a href="#" class="mobile-menu-link active">Dashboard</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#" class="mobile-menu-link">Projects</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#" class="mobile-menu-link">Team</a>
          </li>
          <li class="mobile-menu-item">
            <a href="#" class="mobile-menu-link">Reports</a>
          </li>
        </ul>
      </div>
    </nav>
    
    <!-- Main content -->
    <main class="main-content">
      <div class="container">
        <div class="card">
          <!-- Card header -->
          <div class="card-header">
            <h2 class="card-title">Users Task</h2>
            <p class="card-subtitle">A list of all the task.</p>
          </div>
          
          <!-- Filters -->
          <div class="filters">
            <div class="filter-row">
              
              <div class="filter-group">
                <label for="search" class="filter-label">Search</label>
                <input type="text" id="search" class="filter-input" placeholder="Search by title">
              </div>

              <div class="filter-group" style="flex: 0 0;">
                <label for="status" class="filter-label">Status</label>
                <select id="status" class="filter-select" v-model="selectedFilter" 
                @change="filterTasks">
                  <option value="all">All Task</option>
                  <option value="Self">Self </option>
                  <option value="Shared">Shared</option>
                </select>
              </div>
              
              <button class="add-button open-button" @click="showPopup = true">Add</button>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Task Creator</th>
                  <th>Task Share</th>
                  <th><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in TasksData" :key="task.id">
                  <td>
                    <div class="user-cell">
                      <span class="user-name">{{ task.title }}</span>
                    </div>
                  </td>
                  <td>{{ task.description }}</td>
                  <td><span class="status-badge status-inactive">{{ task.creator_name }}</span></td>
                  <td><span class="status-badge status-inactive">{{ task.shared_with_name }}</span></td>
                  <td><button class="action-link" @click="shareTask(task.id)">Share</button> <button class="action-link" @click="editTask(task.id)">Edit</button> <button @click="viewTask(task.id)" class="action-link">View</button> <button @click="deleteTask(task.id)" class="action-link">Delete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showPopup" class="popup-overlay" @click="closePopup">
        <!-- Popup form -->
        <div class="popup-form" @click.stop>
          <h2>Add New Task</h2>
          <form @submit.prevent="submitForm">
            <!-- Title field -->
            <div class="form-group">
              <label for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title" 
                placeholder="Enter title"
                required
              >
            </div>
            <!-- Description field -->
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                v-model="form.description" 
                placeholder="Enter description"
                rows="3"
              ></textarea>
            </div>
            <!-- Form buttons -->
            <div class="form-buttons">
              <button type="button" class="cancel-button" @click="closePopup">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
          <!-- Close button -->
          <button class="close-button" @click="closePopup">×</button>
        </div>
      </div>

      <div v-if="editshowPopup" class="popup-overlay" @click="editclosePopup">
        <!-- Popup form -->
        <div class="popup-form" @click.stop>
          <h2>Update Task</h2>
          <form @submit.prevent="updatesubmitForm">
            <!-- Title field -->
            <div class="form-group">
              <label for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title" 
                placeholder="Enter title"
                required
              >
            </div>
            <!-- Description field -->
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                v-model="form.description" 
                placeholder="Enter description"
                rows="3"
              ></textarea>
            </div>
            <!-- Form buttons -->
            <div class="form-buttons">
              <button type="button" class="cancel-button" @click="editclosePopup">Cancel</button>
              <button type="submit" class="submit-button">Update</button>
            </div>
          </form>
          <!-- Close button -->
          <button class="close-button" @click="editclosePopup">×</button>
        </div>
      </div>

      <div v-if="showshowPopup" class="popup-overlay" @click="showclosePopup">
        <!-- Popup form -->
        <div class="popup-form" @click.stop>
          <h2>View Task</h2>
            <!-- Title field -->
            <div class="form-group">
              <label for="title">Title</label>
              <p>{{ taskToEdit.title }}</p>
            </div>
            <!-- Description field -->
            <div class="form-group">
              <label for="description">Description</label>
              <p>{{ taskToEdit.description }}</p>
            </div>
          <!-- Close button -->
          <button class="close-button" @click="showclosePopup">×</button>
        </div>
      </div>

      <div v-if="ShareshowPopup" id="taskPopup" class="popup-overlay">
          <div class="popup">
              <div class="popup-header">
                  <h2>Share Task</h2>
              </div>
              <form @submit.prevent="asignTask" id="assignForm">
                  <div class="user-list" id="userList">
                      <h3 style="margin-bottom: 1rem;">Select a user:</h3>
                      <!-- User items will be generated here -->
                      <div v-for="user in userlist" class="user-item" :data-user-id="user.id" :key="user.id">
                          <div class="user-info">
                              <div class="user-name">{{ user.username }}</div>
                          </div>
                          <input type="radio" name="selectedUser" v-model="selectedUser" 
                          :value="user.firebaseuser" class="radio-custom">
                      </div>
                  </div>
                  <div class="form-actions">
                      <button type="button" class="cancel-button" id="cancelBtn" @click="shareclosePopup">Cancel</button>
                      <button type="submit" class="submit-button" id="assignBtn">Assign Task</button>
                  </div>
              </form>
          </div>
      </div>
    </main>

</template>

<script setup lang="ts">

import { useUserStore } from '../store/useUserStore';
import router from '../router/index';
import { ref, onMounted } from 'vue';
const { logout } = useUserStore();
const taskToEdit = ref<any>(null);
const userlist = ref<any>(null);
const username = ref<any>(null);
const selectedUser = ref<any>(null);
const selectedTask = ref<any>(null);
const TasksData = ref<tasks[]>([]);
const selectedFilter = ref<string>('');

// Reactive references
const showPopup = ref<boolean>(false);
const editshowPopup = ref<boolean>(false);
const showshowPopup = ref<boolean>(false);
const ShareshowPopup = ref<boolean>(false);

interface tasks {
  id: number,
  title: string,
  description: string,
  status: string,
  shared_with_name: string,
  creator_name: string
}

// Reactive reference for storing user data
const form = ref({
  title: '',
  description: '',
  user_id: '',
});

const filterTasks = async () => {
  if (selectedFilter.value) {
    try {
      const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error('No user data found in localStorage');
    }
    const parsedUser = JSON.parse(userData);
    const userUuid = parsedUser.user.uid;
    
    // Send the form data to an API (adjust the URL to your API endpoint)
    const response = await fetch(`http://localhost:3000/api/searchtask/${userUuid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({filter: selectedFilter.value} ),
    });

      const data = await response.json();
      TasksData.value = data;
    } catch (error) {
      console.error('Failed to fetch task:', error);
      alert('Error fetching task details');
    }
  }
};

const fetchTask = async (taskId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task details');
    }
    const data = await response.json();
    taskToEdit.value = data;
    form.value = {...data};
  } catch (error) {
    console.error('Failed to fetch task:', error);
    alert('Error fetching task details');
  }
};

const fetchUser = async () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error('No user data found in localStorage');
    }
    const parsedUser = JSON.parse(userData);
    const userUuid = parsedUser.user.uid;
    const response = await fetch(`http://localhost:3000/api/allusers/${userUuid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task details');
    }
    const data = await response.json();
    userlist.value = data;
  } catch (error) {
    console.error('Failed to user:', error);
    alert('Error fetching user details');
  }
};

// Open the edit popup and fetch the task data
const editTask = (taskId: number) => {
  fetchTask(taskId);  // Fetch task data
  editshowPopup.value = true;  // Show the edit popup
};

// Open the view popup and fetch the task data
const viewTask = (taskId: number) => {
  fetchTask(taskId);  // Fetch task data
  showshowPopup.value = true;  // Show the edit popup
};

const shareTask = (taskId: number) => {
  fetchUser();  // Fetch task data
  selectedTask.value = taskId;
  ShareshowPopup.value = true;  // Show the edit popup
};

// Fetch users data from the API using Fetch API
const fetchAlltask = async () => {
  const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error('No user data found in localStorage');
    }
    const parsedUser = JSON.parse(userData);
    const userUuid = parsedUser.user.uid;
  try {
  const response = await fetch(`http://localhost:3000/api/alltasks/${userUuid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    TasksData.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Delete a task
const deleteTask = async (taskId: any) => {
  try {
    // Send DELETE request to the API
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    // Remove the task from the local TasksData array
    TasksData.value = TasksData.value.filter(task => task.id !== taskId);

    // Optionally, show a success message
    alert('Task deleted successfully!');
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task. Please try again.');
  }
};

// Fetch users data when the component is mounted
onMounted(() => {
  fetchAlltask();
  username.value = localStorage.getItem('username');
});

// Close the popup
const closePopup = () => {
  showPopup.value = false;
};

const editclosePopup = () => {
  editshowPopup.value = false;
};

const showclosePopup = () => {
  showshowPopup.value = false;
};

const shareclosePopup = () => {
  ShareshowPopup.value = false;
};

// add task form data
const submitForm = async () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error('No user data found in localStorage');
    }
    const parsedUser = JSON.parse(userData);
    const userUuid = parsedUser.user.uid;
    form.value.user_id = userUuid;
    // Send the form data to an API (adjust the URL to your API endpoint)
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const newTask = await response.json();
    const username = localStorage.getItem("username");
    newTask.creator_name = username;
    TasksData.value.unshift(newTask); 
    // Show success message
    alert('Form submitted successfully!');

    // Reset form and close popup
    resetForm();
    closePopup();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit the form. Please try again.');
  }
};

// update form data
const updatesubmitForm = async () => {
  try {
    // Send the form data to an API (adjust the URL to your API endpoint)
    const response = await fetch(`http://localhost:3000/api/tasks/${taskToEdit.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Show success message
    alert('Form submitted successfully!');
    const updatedTask = await response.json();
    const taskIndex = TasksData.value.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      TasksData.value[taskIndex] = updatedTask;  // Update the task in the list
    }
    editclosePopup();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit the form. Please try again.');
  }
};

// assign task data
const asignTask = async () => {
  if (!selectedUser.value) {
    alert('Please select a user');
    return;
  }
  const userData = localStorage.getItem("user");
  if (!userData) {
    throw new Error('No user data found in localStorage');
  }
  const parsedUser = JSON.parse(userData);
  const userUuid = parsedUser.user.uid;
  
  const formData = {
    shareid: selectedUser.value,
    user_id: userUuid,
  };
  console.log('formData = ', formData)

  try {
    const response = await fetch(`http://localhost:3000/api/assign-task/${selectedTask.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Task assigned successfully', data);
      selectedUser.value = null;
    } else {
      const errorData = await response.json();
      console.error('Error assigning task:', errorData);
      alert('There was an error assigning the task');
    }
  } catch (error) {
    console.error('Network or other error:', error);
    alert('There was an error with the request');
  }
};

// Reset form fields
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    user_id: ''
  };
};

// Call the logout function from the store
const logoutUser = async () => {
  await logout();
  // Optionally, redirect the user to the login page after logging out
  // Example:
   router.push('/login');
};

</script>

<style>

@import "../assets/css/dashboard.css";
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
        
header {
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

/* Button styles */
.btn {
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3a56d4;
}

/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  position: relative;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.close-btn:hover {
  color: #333;
}

/* User list styles */
.user-list {
  margin-bottom: 1.5rem;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-item:hover {
    background-color: #f8f9fa;
}

.user-item.selected {
    background-color: #e6f7ff;
    border-color: #91caff;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4361ee;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.user-info {
    flex: 1;
}

.user-name {
    font-weight: 600;
}

.user-role {
    font-size: 0.85rem;
    color: #666;
}

.radio-custom {
    width: 20px;
    height: 20px;
}

/* Form actions */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background-color: #d0d0d0;
}

/* Active state for popup */
.popup-overlay.active {
    display: flex;
}

/* Task info */
.task-info {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .popup {
        width: 95%;
        padding: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .form-actions button {
        width: 100%;
    }
}

    /* Simple CSS for the popup form */
.popup-container {
  font-family: Arial, sans-serif;
}

.open-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-form {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.popup-form h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.status-options {
  display: flex;
  gap: 15px;
}

.radio-label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  background-color: #f1f1f1;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}

/* Focus styles for better accessibility */
input:focus,
textarea:focus,
select:focus,
button:focus {
  outline: 2px solid #4CAF50;
}
</style>