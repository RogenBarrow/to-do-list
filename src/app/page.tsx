import AddTaskForm from '@/app/components/addTaskForm'
import React from 'react';

 function Home() {
 

  return (
    <div className="flex flex-col min-h-screen justify-top mt-10 items-center border-black">
      <h1>To-Do List</h1>
      <AddTaskForm onAdd={AddTaskForm} />
      
    </div>
  )};

  export default Home;