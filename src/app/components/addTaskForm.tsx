'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';

function AddTaskForm() {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [assignees, setAssignees] = useState<{ name: string; email: string }[]>([]);
  const [todoList, setTodoList] = useState<{ task: string; date: string; assignee: string; assigneeEmail: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dbget');
        if (!response.ok) {
          throw new Error('Failed to fetch todo list');
        }
        const { data } = await response.json(); // Destructure data from the response
        console.log("this is the fetched data: ", data);
        setTodoList(data); // Set the fetched data to the todoList state
      } catch (error) {
        console.error('Error fetching todo list:', error);
      }
    };
  
    fetchData();
  }, []);


  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleAssigneeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    setAssignee(event.target.value);
    setAssigneeEmail(event.target.options[selectedIndex].getAttribute('data-email') || '');
  };

  const handleAddAssignee = () => {
    if (assignee.trim() !== "" && assigneeEmail.trim() !== "") {
      if (!assignees.some(assigneeObj => assigneeObj.name === assignee)) {
        setAssignees([...assignees, { name: assignee, email: assigneeEmail }]);
        setAssignee("");
        setAssigneeEmail("");
      } else {
        alert("Assignee already exists!");
      }
    }
  };

  const handleAddTask = async () => {
    if (task.trim() !== "" && date.trim() !== "" && assignee.trim() !== "" && assigneeEmail.trim() !== "") {
      if (editIndex !== null) {
        const updatedTodoList = [...todoList];
        updatedTodoList[editIndex] = { task, date, assignee, assigneeEmail };
        setTodoList(updatedTodoList);
        setEditIndex(null);
  
        try {
          const response = await fetch('/api/dbedit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, date, assignee, assigneeEmail })
          });
        
          if (!response.ok) {
            throw new Error('Failed to update task');
          }
        
          console.log('Successfully updated task!');
        } catch (error) {
          console.error('Error updating task:', error);
        }
      } else {
        setTodoList([...todoList, { task, date, assignee, assigneeEmail }]);
        setTask("");
        setDate("");
        setAssignee("");
        setAssigneeEmail("");
        
        try {
          const response = await fetch('/api/dbpost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, date, assignee, assigneeEmail })
          });
        
          if (!response.ok) {
            throw new Error('Failed to post in DB');
          }
        
          console.log('Successfully posted in DB!');
        } catch (error) {
          console.error('Error posted in DB reason:', error);
        }  
      
        try {
          const response = await fetch('/api/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, date, assignee, assigneeEmail })
          });
        
          if (!response.ok) {
            throw new Error('Failed to send email');
          }
        
          console.log('Email sent successfully!');
        } catch (error) {
          console.error('Error sending email:', error);
        }       
      }
    }
  };
  

  const handleRemoveTask = (index: number) => {
    const newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  };

  const handleEdit = (index: number) => {
    setTask(todoList[index].task);
    setDate(todoList[index].date);
    setAssignee(todoList[index].assignee);
    setAssigneeEmail(todoList[index].assigneeEmail);
    setEditIndex(index);
  };

  return (
    <div className="flex justify-center items-top h-screen">
      <div className="w-full p-4">
        <div className="flex items-center mb-4">
          <input 
            className="block w-1/4 p-2 mr-2 text-black-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
            type="text"
            placeholder="Task..."
            value={task}
            onChange={handleInputChange}
          />
          <input 
            className="block w-1/4 p-2 mr-2 text-black-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
            type="date"
            value={date}
            onChange={handleDateChange}
          />
          <select
            className="block w-1/4 p-2 mr-2 text-black-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
            value={assignee}
            onChange={handleAssigneeChange}
          >
            <option value="">Select Assignee</option>
            {assignees.map((assigneeObj, index) => (
              <option key={index} value={assigneeObj.name} data-email={assigneeObj.email}>{assigneeObj.name}</option>
            ))}
          </select>
          <button type="button" onClick={handleAddTask} className="text-white bg-yellow-400 hover:bg-yellow-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2">{editIndex !== null ? 'Update Task' : 'Add Task'}</button>
        </div>
        <div className="flex items-center mb-4">
          <input
            className="block w-1/4 p-2 mr-2 text-black-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
            type="text"
            placeholder="Assignee Name..."
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          />
          <input
            className="block w-1/4 p-2 mr-2 text-black-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
            type="email"
            placeholder="Email..."
            value={assigneeEmail}
            onChange={(event) => setAssigneeEmail(event.target.value)}
          />
          <button type="button" onClick={handleAddAssignee} className="text-white bg-yellow-400 hover:bg-yellow-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2">Add Assignee</button>
        </div>
        <div className="flex justify-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Assignee</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <input 
                        type="text" 
                        value={task} 
                        onChange={handleInputChange} 
                        className="w-full"
                      />
                    ) : (
                      item.task
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <input 
                        type="date" 
                        value={date} 
                        onChange={handleDateChange} 
                        className="w-full"
                      />
                    ) : (
                      item.date
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <select 
                        value={assignee} 
                        onChange={handleAssigneeChange} 
                        className="w-full"
                      >
                        <option value="">Select Assignee</option>
                        {assignees.map((assigneeObj, index) => (
                          <option key={index} value={assigneeObj.name} data-email={assigneeObj.email}>{assigneeObj.name}</option>
                        ))}
                      </select>
                    ) : (
                      item.assignee
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <button 
                        type="button" 
                        onClick={() => handleAddTask()} 
                        className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => handleEdit(index)} 
                        className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTask(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;








