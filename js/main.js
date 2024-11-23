// Error handling function
async function handleApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (response.status === 404) {
      throw new Error("Resource not found. Please check the API endpoint URL.");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    document.getElementById(
      "error-message"
    ).innerHTML = `Request failed: ${error.message}. Please try again later.`;
    throw error;
  }
}

async function detectAI() {
  const textInput = document.getElementById("textInput").value;
  const resultDiv = document.getElementById("result");
  const loaderContainer = document.querySelector(".loader-container");

  // Show loader
  loaderContainer.style.display = "flex";

  const url =
    "https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "b104570362mshcfb5667b2aef375p19108cjsnc0e1113c7d39",
      "x-rapidapi-host": "ai-content-detector-ai-gpt.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: textInput,
    }),
  };

  try {
    resultDiv.style.display = "block";
    resultDiv.className = "analyzing";
    resultDiv.innerHTML = "Analyzing";

    const result = await handleApiRequest(url, options);

    console.log("API Response:", result);

    if (result.status) {
      const humanProbability = 100 - result.fakePercentage;
      resultDiv.className = "show";
      resultDiv.innerHTML = `
                <h3 class="fade-in">Analysis Results</h3>
                <p class="result-item" style="background: ${getGradientColor(
                  result.fakePercentage
                )}; animation-delay: 0.1s">
                    AI Generated Probability: ${result.fakePercentage.toFixed(
                      2
                    )}%
                </p>
                <p class="result-item" style="background: ${getGradientColor(
                  100 - result.fakePercentage
                )}; animation-delay: 0.2s">
                    Human Generated Probability: ${humanProbability.toFixed(2)}%
                </p>
                <p class="result-item" style="animation-delay: 0.3s">
                    AI Words Count: ${result.aiWords}
                </p>
                <p class="result-item" style="animation-delay: 0.4s">
                    Total Words: ${result.textWords}
                </p>
                <p class="result-item verdict" style="animation-delay: 0.5s; font-weight: 700">
                    ${getVerdict(result.isHuman)}
                </p>
            `;
    } else {
      throw new Error("Analysis failed");
    }
  } catch (error) {
    resultDiv.className = "show";
    resultDiv.innerHTML = "Error analyzing text. Please try again.";
    resultDiv.style.backgroundColor = "#fee2e2";
    console.error("Error:", error);
  } finally {
    // Hide loader when done
    loaderContainer.style.display = "none";
  }
}

// Update the gradient color function
function getGradientColor(percentage) {
  const isAI = percentage > 50;
  return `linear-gradient(135deg, 
        rgba(${isAI ? "37,99,235" : "96,165,250"}, 0.1),
        rgba(${isAI ? "37,99,235" : "96,165,250"}, 0.2))`;
}

// Update the verdict function with emojis
function getVerdict(isHuman) {
  return isHuman
    ? "💠 Human Generated Content 💠"
    : "🔷 AI Generated Content 🔷";
}
