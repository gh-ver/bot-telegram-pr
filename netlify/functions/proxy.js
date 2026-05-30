export const handler = async (event, context) => {
  const url = event.queryStringParameters?.url;
  if (!url) {
    
    return {
      statusCode: 400,


      
      headers: {
        'Access-Control-Allow-Origin': '*',







        
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing "url" query parameter' }),
    };
    
  }
  try {


    
    const response = await fetch(decodeURIComponent(url));
    
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
    const datas = await response.text();

    const contentType = response.headers ? response.headers.get('content-type') : 'text/plain';
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Content-Type': contentType || 'text/plain',},body: datas,};} catch (error) { return { statusCode: 500, headers: {'Access-Control-Allow-Origin': '*','Content-Type': 'application/json' },body: JSON.stringify({ error: error.message }),};}};
