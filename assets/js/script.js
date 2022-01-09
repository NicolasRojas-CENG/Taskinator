//Variables to help select the desired element.
var formEl = document.querySelector("#task-form"); //For <form>.
var pageContentEl = document.querySelector("#page-content"); //For <main>.
var tasksToDoEl = document.querySelector("#tasks-to-do"); //For <ul> in Tasks to do.
var tasksInProgressEl = document.querySelector("#tasks-in-progress"); //For <ul> in Progress.
var tasksCompletedEl = document.querySelector("#tasks-completed"); //For <ul> in Completed.

//Unique ID's for the tasks.
var taskIdCounter = 0;

//Function used for the gathering of task information.
var taskFormHandler = function(event) {
    //Stops the browser from reloading after clicking the submit button.
    event.preventDefault();
    //Variables used to store the task information.
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //Checks if form inputs are empty or not.
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    //Clears the form after a submittion. 
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    //Object to hold the task information.
    else {
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
        };
    
        createTaskEl(taskDataObj);
    }
};

//Function used to create the task composing elements.
var createTaskEl = function (taskDataObj) {
    //Variable to create the list item for the task.
    var listItemEl = document.createElement("li");
    //Sets a class to the <li>.
    listItemEl.className = "task-item";
    //Sets a custom data attribute to hold the unique ID for the task.
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //Variable to create the division that holds the task information.
    var taskInfoEl = document.createElement("div");
    //Sets a class to the <div>.
    taskInfoEl.className = "task-info";
    /*Method to add the task information to the <div>.
    innerHTML is used to be able to add HTML tags.*/
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //Adds the task information (<div>) as a child of the list item (<li>). 
    listItemEl.appendChild(taskInfoEl);
    //Variable used to save the division of the buttons from the function's return.
    var taskActionsEl = createTaskActions(taskIdCounter);
    //Adds the <div> containing the task buttons to the <li>
    listItemEl.appendChild(taskActionsEl);

    //Adds the <li> to the To Do <ul>.
    tasksToDoEl.appendChild(listItemEl);
    //Increases the unique ID counter for a new 
    taskIdCounter++;
};

//Function used to create the buttons for each task.
var createTaskActions = function(taskId) {
    //Variable to create a <div>.
    var actionContainerEl = document.createElement("div");
    //Adds a class to the <div>.
    actionContainerEl.className = "task-actions";
    //Variable to create a <button>.
    var editButtonEl = document.createElement("button");
    //Adds text to the button.
    editButtonEl.textContent = "Edit";
    //Adds a class to the <button>.
    editButtonEl.className = "btn edit-btn";
    //Sets a custom data attribute to hold the unique ID for the task.
    editButtonEl.setAttribute("data-task-id", taskId);
    //Adds the <button> to the parent <div>.
    actionContainerEl.appendChild(editButtonEl);
    
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
      
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

//Function used to handle the task buttons.
var taskButtonHandler = function(event) {
     // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//Function used to delete the task.
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

//Function used to edit a task.
var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

pageContentEl.addEventListener("click", taskButtonHandler);

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
  
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};

pageContentEl.addEventListener("change", taskStatusChangeHandler);