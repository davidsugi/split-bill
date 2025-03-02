<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { createWorker } from 'tesseract.js';
  import Button from '../common/Button.svelte';
  
    // @ts-ignore
    let imageFile = null;
    let ocrText = "";
    let status = "";
    let matches=[]
  
    // @ts-ignore
    function handleFileChange(e) {
      imageFile = e.target.files[0];
      ocrText = "";
      status = "";
    }
    async function processImage() {
  if (!imageFile) return;
  status = "Processing...";

  const worker = await createWorker('eng+ind');
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: 4, // try different modes if needed
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:/-()%$Rp ',
    });
    const { data: { text } } = await worker.recognize(imageFile);
    console.log("Raw OCR text:", text);

    // Replace newlines with a delimiter and then split – sometimes Tesseract doesn’t add clear newlines
    const lines = text.split(/\n/).map(line => line.trim()).filter(Boolean);

    // Filter lines that contain a price (assume prices are formatted like "53,000" or "62,000")
    const transactionLines = lines.filter(line => /\d{1,3}(?:,\d{3})+/.test(line));
    
    // Now, for each line, assume that the last number is the price and the rest is the name
    const transactions = transactionLines.map(line => {
      // Match everything until the last number with comma separators
      // This regex grabs the transaction name and then the last number in the line
    const match = line.match(/(.*?)(\d{1,3}(?:,\d{3})+(?:\.\d+)?)(?!.*\d)/);
      if (match) {
        return {
          name: match[1].trim(),
          price: match[2]
        };
      }
      return null;
    }).filter(Boolean);

    // Log transactions
    matches= transactions.forEach(({ name, price }) => {
      console.log(`Item: ${name}, Price: ${price}`);
    });

    status = "Completed";
  } catch (err) {
    console.error("Error during OCR:", err);
    status = "Error during OCR";
  } finally {
    await worker.terminate();
  }
}
    // Ensure that this code runs only on the client
    onMount(() => {
      // All OCR code (like processImage) will now be called only after mounting
    });
  </script>
  
  <input type="file" accept="image/*" on:change={handleFileChange} />
  
  {#if imageFile}
    <Button onClick={processImage} label="Upload Recipt" />
  {/if}
  
  <p>Status: {status}</p>
  {#if matches.length > 0}
    <h2 class="text-2xl text-blue-500">Scanned item</h2>
    {#each matches as match}
        <span class="text-gray-500"> {match}</span> <br />
    {/each}
  {/if}
  {#if ocrText}
    <div>
      <h3>Extracted Text:</h3>
      <p>{ocrText}</p>
    </div>
  {/if}
  
  