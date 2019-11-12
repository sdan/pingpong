const setCache = (key, data) => ding.put(key, data)
const getCache = key => ding.get(key)

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



async function log(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `${Date.now()}-${ip}`
  let body
  body = await request.text()
  let obj
  obj = JSON.parse(body)
  obj["ip"] = ip
  let sobj = JSON.stringify(obj)

  const cKey = obj.url
  let iterateObj = {cKey : {cacheKey: sobj}}
  let dict = {}
  dict[cKey] = obj

  let stringIterateObj = JSON.stringify(dict)


  console.log(request)
  try {
    await setCache(cKey, body)
    return new Response(stringIterateObj, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function poll(request)
{
  let requestURL = new URL(request.url)
  let path = requestURL.pathname.split('/')[1]
  console.log(path)
  let location = redirectMap.get(path)
  if (location) {
    return Response.redirect(location, 301)
  }
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    return log(request)
  } 
  if (request.method === 'PUT') {
    return new Response('treasure put', {status: 200})
  }
  else {
    try {
      return new Response('hola amigo', {status: 200})
    } catch (err) {
      return Response.redirect("https://sdan.xyz/pingpong", 301)
    }
    
    return Response.redirect("https://sdan.xyz/pingpong", 301)
    // return new Response('got treasure? '+Date.now(), {status: 201})
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
