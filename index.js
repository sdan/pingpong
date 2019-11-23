async function log(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  let epoch = `${Date.now()}`
  let body = await request.text()
  let obj = JSON.parse(body)
  obj["ip"] = ip
  obj["epoch"] = epoch
  
  let cleanURL = (obj.url).replace(/^https?\:\/\//i, "")

  let baseDomain = cleanURL.split('/')[0]
  // return new Response('ck '+cKey+' bd '+baseDomain, {status: 200})
  let urlPath = cleanURL.split('/')[1]
  //fast as possible, no need to check if / or not
  if(!urlPath)
  {
    obj["path"] = ""
  }
  else{
    obj["path"] = urlPath
  }
  

  let stringObjCacheVal

  stringObjCacheVal = JSON.stringify(obj)

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicGluZ191c2VyIn0.Mc0S2uPjpf_cigsO-Hcguo2g5wn9GXwtRsjL1a91IoU'
try {
  let response = await fetch("https://post.sdan.io/pong", {
    method: 'POST', 
    body: stringObjCacheVal,
    headers: {
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'
    }
  })
  // const json = await response.json()
  // console.log('Success:', JSON.stringify(json))
  return new Response('yay', {status: 200})
} 
catch (err) {
  return new Response('nope', {status: 200})
}

}


async function handleRequest(request) {
  if (request.method === 'POST') {
    return log(request)
  } 
  else {
    return new Response('rejected', {status: 200})
  }
 
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
