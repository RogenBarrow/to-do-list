import supabase from '@/app/db/client';

export async function GET(req, res) { 
  try {
    const { data, error } = await supabase
      .from('to-do-list')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return res.json({ data });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ error: 'Internal Server Error' }); 
  }
}
