function extractArticleContent() {
  // Create a new DOMParser instance and parse the current document's HTML
  const parser = new DOMParser();
  const docClone = parser.parseFromString(
    document.documentElement.outerHTML,
    "text/html"
  );

  // Remove any existing scripts in the cloned document to avoid running them again
  const scripts = docClone.getElementsByTagName("script");
  while (scripts[0]) {
    scripts[0].parentNode.removeChild(scripts[0]);
  }

  // Instantiate Readability with the cloned document
  const article = new Readability(docClone).parse();

  if (article && article.textContent) {
    return article.textContent;
  } else {
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getArticleContent") {
    sendResponse({ content: extractArticleContent() });
  }
});
