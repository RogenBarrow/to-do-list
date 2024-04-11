import { NextResponse } from "next/server";
import supabase from '@/app/db/client'



export async function POST(req) { 
  const body = await req.json()

  const user = body.assignee;
  const userTask = body.task;
  const userEmail = body.assigneeEmail;
  const userDate = body.date;
  
  console.log("This is ready for editing: ", user);


  const { error } = await supabase
  .from('to-do-list')
  .update({ assignee: user,
    assigneeEmail: userEmail,
    date: userDate,
    task: userTask, })
  .eq('assignee', user)
  .select()
          
        
if (error) {
  throw error;
}

console.log(error);

  
  return NextResponse.json({ message: "Hello from Next.js" }, { status: 200 }); 


};