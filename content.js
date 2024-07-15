function transformText(text) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({action: "generate", prompt: text}, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else if (response.error) {
        console.error('API error:', response.error);
        reject(response.error);
      } else {
        resolve(response.generatedText);
      }
    });
  });
}

async function modifyPageContent(inputText) {
  console.log('Modifying page content for input:', inputText);
  const textNodes = document.evaluate(
    '//text()[normalize-space()]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  console.log('Found text nodes:', textNodes.snapshotLength);

  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const node = textNodes.snapshotItem(i);
    if (node.textContent.includes(inputText)) {
      console.log('Found matching node:', node.textContent);
      try {
        const transformedText = await transformText(node.textContent);
        console.log('Transformed text:', transformedText);
        node.textContent = transformedText;
        return transformedText;
      } catch (error) {
        console.error('Error transforming text:', error);
        throw error;
      }
    }
  }
  console.error('Text not found on the page');
  throw new Error("Text not found on the page");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === "transform") {
    modifyPageContent(request.text)
      .then(transformedText => {
        console.log('Sending response with transformed text');
        sendResponse({status: "Text transformed", transformedText: transformedText});
      })
      .catch(error => {
        console.error('Sending error response:', error);
        sendResponse({status: "Error", error: error.message});
      });
    return true; // Indicates that the response is asynchronous
  }
});