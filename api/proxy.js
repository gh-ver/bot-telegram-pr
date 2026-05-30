
export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });

    
  }

  try {








    
    const response = await fetch(decodeURIComponent(url));
    if (!response.ok) {
      throw new Error('Failed to fetch data');
      
    }
    res.setHeader('Access-Control-Allow-Origin', '*');

    
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', response.headers.get('Content-Type'));
    
    const data = await response.text();
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });













    
  }
}
