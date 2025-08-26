chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("[Land Capture] Message received in content.js:", message);
  if (message.type === "CAPTURE_LISTING") {
    try {
      alert("Capture triggered on page. Processing...");
      const url = window.location.href;
      const price = document.body.innerText.match(/\$[0-9,.]+/)?.[0].replace(/[^0-9.]/g, "") || "";
      const address = document.body.innerText.match(/\d{1,5} .+, [A-Z]{2} \d{5}/)?.[0] || "";
      const description = document.querySelector("meta[name='description']")?.content || document.body.innerText.slice(0, 1000);

      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a structured data formatter for off-grid land datasets. Output ONLY a single TSV row with NO commentary. Use the exact field order provided."
          },
          {
            role: "user",
            content: `Format the following property listing into a **single TSV row** with these fields, in this exact order:

      **Field standards for consistency:**

      - LISTING_URL: Full URL of listing
      - TAX_URL: Url of tax statements. (i need you to get a url to the county parcel search, i can perform the actual search)
      - MLS_NUMBER: Number
      - PARCEL_ID: String
      - OFFGRIDNESS: (leave empty for user input)
      - BUDGET: (leave empty for user input)
      - price: Number, e.g., 5500, 149000 (no $ or commas)
      - address: Full address if available; else “0 Unknown Rd, City, State ZIP”
      - coordinates: these are lat/longs, use 
      - state: 2-letter code (WA, OR, ID, etc.)
      - county: Full county name
      - city: Full city or closest city
      - ISLAND_STATUS: “Mainland” or “Island”
      - acres: Float, e.g., 5.0
      - ZONING_CODE: “RR5”, “EFU”, “UZ” or “Unknown-Code”
      - ZONING: “Residential”, “Rural-Residential”, “RR5”, “Forest-Range”, “EFU”, “UZ”, “Commercial”, or “Unknown-zone”
      - region: e.g., Estimate this from the County “Western-Washington”, “Eastern-Washington”, “Olympic-Peninsula”, “Central-Oregon”
      - desert: “Desert”, “Rains” (this can be estimated from County)
      - PLANTING_HARDINESS_ZONE: e.g., “8a”, “6b” (to be estimated from County)
      - SQUARE_FEET_OF_HOUSING: Integer, e.g., 0 if vacant land
      - STREET_STATUS: “Paved, public road”, “Paved, private road”, “Gravel-public-road”, “Gravel-private-road”, “Dirt-private-road”, “Unknown-streeting”, “Streetless”, “Landlocked”, “River-access-only”
      - PUBLIC_ROAD_ACCESS: “Public-road-accessible”, “Public-road-inaccessible”
      - PRIVATE_ROAD_ACCESS: “Private-road-accessible”, “Public-road-inaccessible”
      - EASEMENT_STATUS: “No-easement”, “Formal-easement”
      - wooded: “Heavily-wooded”, “Partially-wooded”, “Treeless”
      - POWER_STATUS: “Power-available”, “Power-unavailable”
      - water: “City-water-available”, “No-water-service”
      - well: “Well-installed”, “No-well”
      - WELL_PERMITS: “Water-permit-in-place”, “No-water-permit”
      - hoa: “None”, “Optional-HOA”, “Mandatory-HOA”
      - sewer: “City-sewer-available”, “City-sewer-available-nearby”, “Septic-needed”, “No-sewer”
      - wetlands: “Wetland-classified”, “Non-wetland”
      - gas: “Natural-gas-service”, “No-gas-service”
      - septic: “Installed”, “Needed”, “None”
      - PERCOLATION_TEST: “Percolation-test-passed”, “Percolation-test-failed”, “Unknown-percolation-test”
      - HOURS_FROM_SEATTLE: Float, e.g., 2, 4.5, 7

      ---

      Using the listing text provided below, fill in as many fields as possible, using 'Unknown' where unavailable, while adhering to the type and value constraints above. Output ONLY a **single TSV line**, with each field separated by tabs, and no extra commentary:

      Listing text:
      URL: ${url},
      Price: ${price},
      Address: ${address},
      Description: ${description}`
          }
        ]
      };


      const OPENAI_API_KEY = (await chrome.storage.sync.get("OPENAI_API_KEY")).OPENAI_API_KEY;

      
      console.log("[Land Capture] Sending fetch to OpenAI API...");
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
          console.log("[Land Capture] OpenAI response received:", data);

          if (data.error) {
              console.error("[Land Capture] OpenAI API error:", data.error);
              alert("OpenAI API error: " + data.error.message);
              return;
          }
          if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
              console.error("[Land Capture] Unexpected OpenAI response format:", data);
              alert("Unexpected response from OpenAI API. Check console for details.");
              return;
          }
          const tsv = data.choices[0].message.content.trim();
          console.log("[Land Capture] TSV received:", tsv);

          navigator.clipboard.writeText(tsv).then(() => {
              alert("TSV copied to clipboard successfully!");
          }).catch(err => {
              console.error("[Land Capture] Clipboard error:", err);
              alert("Failed to copy TSV to clipboard: " + err);
          });
      })
      .catch(err => {
          console.error("[Land Capture] Fetch error:", err);
          alert("Error fetching GPT data: " + err);
      });

    } catch (error) {
      console.error("[Land Capture] Unexpected error:", error);
      alert("Unexpected error during capture: " + error.message);
    }
  }
});