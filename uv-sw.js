importScripts("/uv/uv.sw.js");

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async function() {
            // Fetch the original response
            const response = await sw.fetch(event);

            // Clone the response to read and modify
            const responseClone = response.clone();

            // Check if the response is an HTML document
            const contentType = responseClone.headers.get("content-type") || "";
            if (contentType.includes("text/html")) {
                // Read the response text
                const text = await responseClone.text();

                // Inject the script before the closing </body> tag
                const modifiedText = text.replace(
                    "</body>",
                    `<script>
                    document.addEventListener("DOMContentLoaded", function () {
                      // Replace "Google" with "Glitch" in the document title
                      document.title = document.title.replace(/Google/g, "Glitch");
                  
                      // Apply CSS filters with refined selectors
                      var style = document.createElement('style');
                      style.type = 'text/css';
                      style.innerHTML = \`
                        h1, h2, h3, h4, h5, h6, a.no-children {
                          filter: brightness(1) saturate(1.2) hue-rotate(180deg);
                        }
                        h1 img, h2 img, h3 img, h4 img, h5 img, h6 img,
                        h1 video, h2 video, h3 video, h4 video, h5 video, h6 video,
                        h1 canvas, h2 canvas, h3 canvas, h4 canvas, h5 canvas {
                          filter: brightness(-1) saturate(-1) hue-rotate(-180deg);
                        }
                      \`;
                      document.head.appendChild(style);
                  
                      // Update favicon with a check
                      (function () {
                        var link = document.querySelector("link[rel~='icon']");
                        if (!link) {
                          link = document.createElement('link');
                          link.rel = 'icon';
                          document.head.appendChild(link);
                        }
                        link.href = 'https://glitchnetwork.xyz/assets/favicon.png';
                      })();


                      // Remove "Sponsored" elements if necessary
setTimeout(function () {
  var elements = document.evaluate(
    "//*[contains(text(), 'Sponsored')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  
  for (var i = 0; i < elements.snapshotLength; i++) {
    var element = elements.snapshotItem(i);
    
    // Check for safe element types to remove directly
    if (element && (element.tagName === "DIV" || element.tagName === "SPAN" || element.tagName === "SECTION")) {
      element.remove();
    } else {
      // Fallback to setting the element's display to 'none' if unsure
      element.style.display = "none";
    }
  }
}, 500);

                  
      
                  
                      // Update the logo with a delay
                      setTimeout(function () {
                        var logo = document.getElementById("logo");
                        if (logo) logo.innerHTML = "<h3>Glitch Search</h3>";
                      }, 1000);
                  
                      console.log("Modifications applied");
                    });
                  </script>`
                );

                // Return the modified response if status allows a body
                if (response.status !== 204 && response.status !== 304) {
                    return new Response(modifiedText, {
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                    });
                }
            }

            // If not HTML or if status requires no body, return the original response
            return response;
        })()
    );
});
