import { NextResponse } from "next/server";
import supabase from '@/app/db/client';


export async function GET(req) { 
 
  try {
  const { data, error } = await supabase
.from('to-do-list')
.select('task,date,assignee,assigneeEmail')
return NextResponse.json({ data }, { status: 200 }); 
 } catch (error) {
  throw error;
 } 

};