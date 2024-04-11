import supabase from '@/app/db/client';

export async function GET(req, res) { 
  try {
    const { data, error } = await supabase
      .from('to-do-list')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    console.log(data); // Log the fetched data
    
    return res.json({ data }); // Send fetched data as JSON response
  } catch (error) {
    console.error(error); // Log any errors that occur during the fetch process
    return res.status(500).json({ error: 'Internal Server Error' }); // Return a generic error response
  }
}
