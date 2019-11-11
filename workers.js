
const setCache = (key, data) => grass.put(key, data)
const getCache = key => grass.get(key)

async function getData(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `data-${ip}`
  let data
  const cache = await getCache(cacheKey)
  if (!cache) {
    await setCache(cacheKey, JSON.stringify(defaultData))
    data = defaultData
  } else {
    data = JSON.parse(cache)
  }
  const body = html(JSON.stringify(data.todos || []))
  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function updateDatabase(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `${Date.now()}-${ip}`
  let body
  body = await request.text()
  let obj
  obj = JSON.parse(body)
  obj["ip"] = ip
  let sobj = JSON.stringify(obj)
  console.log(request)
  try {
    await setCache(cacheKey, body)
    return new Response(sobj, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    return updateDatabase(request)
  } 
  if (request.method === 'PUT') {
    return new Response('treasure put', {status: 200})
  } 
    else {
    return new Response('got treasure? '+Date.now(), {status: 201})
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
