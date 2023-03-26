function summarizeText(text) {
  return new Promise(async (resolve, reject) => {
    const apiKey = OPENAI_KEY;
    const prompt = `Please summarize the following text: "${text}"`;

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt,
          max_tokens: 150,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      resolve(data.choices[0].text.trim());
    } catch (error) {
      reject(error);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSummary") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      try {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "getArticleContent" },
          async (response) => {
            if (response && response.content) {
              const summarizedText = await summarizeText(response.content);
              sendResponse({ summary: summarizedText });
            } else {
              sendResponse({ summary: null });
            }
          }
        );
      } catch (error) {
        console.error("Error summarizing text:", error);
        sendResponse({ error: "Unable to generate summary" });
      }
    });

    return true; // Required to use sendResponse asynchronously
  }
});
