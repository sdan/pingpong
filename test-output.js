const setCache = (key, data) => leaf.put(key, data)
const getCache = key => leaf.get(key)

// const html = output => `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width,initial-scale=1">
//     <title>Ping Pong Analytics</title>
//     <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet"></link>
//   </head>

//   <body class="bg-blue-100">
//     <div class="w-full h-full flex content-center justify-center mt-8">
//       <div class="bg-white shadow-md rounded px-8 pt-6 py-8 mb-4">
//         <h1 class="block text-grey-800 text-md font-bold mb-2">Ping Pong Analytics</h1>
//         <div class="flex">
//           <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" placeholder="A new todo"></input>
//           <button class="bg-blue-500 hover:bg-blue-800 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="create" type="submit">Create</button>
//         </div>
//         <div class="mt-4" id="todos"></div>
//       </div>
//     </div>
//   </body>

//   <script>
//     window.todos = ${todos}


//     var populateTodos = function() {
//       var todoContainer = document.querySelector("#todos")
//       todoContainer.innerHTML = null

//     //   if (input.value.length) {
//     // todos = [].concat(todos, { 
//     //   id: todos.length + 1, 
//     //   name: input.value,
//     //   completed: false,
//     // });

    
//     }

//     populateTodos()


//     document.querySelector("#create").addEventListener('click', createTodo)
//   </script>
// </html>
// `

const html = basic => `
<!DOCTYPE html>
<html>
<body>
<h1>ping pong</h1>
<ul id="log"></ul>
</body>

<script>
window.payload = ${basic}

var populateLogs = function() {
  var logContainer = document.querySelector("#log");
  logContainer.innerHTML = null

  window.payload.forEach(log => {
    console.log("cool")
  });
}

populateLogs()

</script>
</html>
`

async function log(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const cacheKey = `${Date.now()}-${ip}`
  let body
  body = await request.text()
  let obj
  obj = JSON.parse(body)
  obj["ip"] = ip
  // let rURL = new URL(request.url)
  

  let cKey = (obj.url).replace(/^https?\:\/\//i, "")
  let baseDomain = cKey.split('/')[0]

  obj["path"] = cKey.split('/')[1]

  let stringObjCacheVal
  let objCacheVal

  let cacheVal = await getCache(baseDomain)
  if (!cacheVal) {
    objCacheVal = {}
    objCacheVal[cacheKey] = obj
    stringObjCacheVal = JSON.stringify(objCacheVal)
  }
  else {
    objCacheVal = JSON.parse(cacheVal)
    objCacheVal[cacheKey] = obj
    stringObjCacheVal = JSON.stringify(objCacheVal)
  }
  

  try {
    await setCache(baseDomain, stringObjCacheVal)
    return new Response(stringObjCacheVal, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function poll(request)
{
  let requestURL = new URL(request.url)
  let path = requestURL.pathname.split('/')[1]
  console.log(path)  
  let payload = await getCache(path)

  const analyticsBody = html(payload)
  return new Response(analyticsBody, {
    headers: { 'Content-Type': 'text/html' },
  })
  // return new Response(path, {status: 200})
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
      // try polling
      return poll(request)

      // return new Response('hola amigo', {status: 200})
    } catch (err) {
      return Response.redirect("https://sdan.xyz/pingpong", 301)
    }
        // return new Response('got treasure? '+Date.now(), {status: 201})
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
