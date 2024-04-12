import { NextResponse } from "next/server";
import supabase from '@/app/db/client'



export async function POST(req) { 
  const body = await req.json()

  const user = body.assignee;
  const userTask = body.task;
  const userEmail = body.assigneeEmail;
  const userDate = body.date;
  
  console.log("This is ready for posting: ", user);

const { error } = await supabase
.from('to-do-list')
.insert([
  { assignee: user,
    assigneeEmail: userEmail,
    date: userDate,
    task: userTask,
   },
])
.select()
        
if (error) {
  throw error;
}

console.log(error);

  
  return NextResponse.json({ message: "Excecution went well!" }, { status: 200 }); 


};