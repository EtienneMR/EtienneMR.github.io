// Cloudflare worker used to fetch icons from projetcs
var MAX_REDIRECTS = 3;
var FORBIDDEN_HEADERS = ["Set-Cookie"];
var src_default = {
  async fetch(request, env, ctx) {
    if (request.method != "GET")
      return new Response(`Invalid method: got ${request.method}, expected GET`, { status: 400 });
    const url = new URL(request.url);
    let target = url.searchParams.get("target");
    if (!target)
      return new Response("Invalid request: missing target param", { status: 400 });
    let redirectCount = 0;
    let response;
    do {
      response = await fetch(target, request);
      if (response.status >= 300 && response.status < 400) {
        target = response.headers.get("Location");
        redirectCount++;
        if (!target)
          return new Response(`Invalid response from "${response.url}": requested redirect with status ${response.status} without Location header`, { status: 400 });
      } else {
        break;
      }
    } while (redirectCount < MAX_REDIRECTS);
    if (redirectCount === MAX_REDIRECTS) {
      return new Response("Maximum number of redirects reached", { status: 400 });
    }
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("text/html") && !contentType.startsWith("image/"))
      return new Response("Forbidden response: invalid Content-Type", { status: 403 });
    response = new Response(response.body, response);
    for (let [header] of response.headers.entries()) {
      if (header.startsWith("Access-Control") || FORBIDDEN_HEADERS.includes(header))
        response.headers.delete(header);
    }
    response.headers.set("Access-Control-Allow-Origin", "https://etiennemr.fr");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Cache-Control", "public, max-age=86400");
    return response;
  }
};
export {
  src_default as default
};
