export const handler = async (event, context) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    
    return {
      statusCode: 400,


      
      body: JSON.stringify({ error: 'Missing "url" query parameter' }),
    };







    
  }
  try {
    const response = await fetch(decodeURIComponent(url));
    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.text();
    return {


      
      statusCode: 200, headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET, OPTIONS','Content-Type': response.headers.get('Content-Type') || 'text/plain',}, body: data,}; } catch (error) {return { statusCode: 500,body: JSON.stringify({ error: error.message }),};
                                                                                                                                                                                                                          
  }
};
