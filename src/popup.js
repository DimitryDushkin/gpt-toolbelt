function showElement(id, show) {
  const element = document.getElementById(id);
  element.style.display = show ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  showElement("loading", true);

  chrome.runtime.sendMessage({ action: "getSummary" }, (response) => {
    showElement("loading", false);

    console.log(response);

    if (response.error) {
      showElement("error", true);
    } else if (response.summary) {
      const summaryElement = document.getElementById("summary");
      summaryElement.textContent = response.summary;
      showElement("summary", true);
    } else {
      const errorElement = document.getElementById("error");
      errorElement.textContent = "No article content found";
      showElement("error", true);
    }
  });
});
