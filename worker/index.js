export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    const url = new URL(request.url)
    const sgdbUrl = `https://www.steamgriddb.com/api/v2${url.pathname}${url.search}`

    const response = await fetch(sgdbUrl, {
      headers: { Authorization: `Bearer ${env.SGDB_KEY}` },
    })

    const body = await response.text()

    return new Response(body, {
      status: response.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  },
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
