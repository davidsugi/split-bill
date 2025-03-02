<script>
// @ts-nocheck

    
    let video;
    
    let canvas;
    
    let fileInput;
    
    let stream;
  
    import { onMount } from 'svelte';
    import { createWorker } from 'tesseract.js';
  
  import Button from '../common/Button.svelte';
  
    
    let imageFile = null;
    let ocrText = "";
    let status = "";
    let matches=[]
  
    
    
    function handleFileChange(e) {
      imageFile = e.target.files[0];
      ocrText = "";
      status = "";
    }
    
    async function processImage() {
  
  if (!fileInput) return;
  status = "Processing...";

  const worker = await createWorker('eng+ind');
  try {
    await worker.setParameters({
      
      tessedit_pageseg_mode: 4, // try different modes if needed
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:/-()%$Rp ',
    });
    const { data: { text } } = await worker.recognize(fileInput);
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
    
    // Start the webcam and stream it to the video element.
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        video.srcObject = stream;
        
        await video.play();
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  
    // Capture a frame from the video, convert it to a Blob,
    // create a File, and simulate a file input selection.
    function capture() {
      
      if (!video.videoWidth || !video.videoHeight) {
        console.error("Video not ready.");
        return;
      }
  
      // Set canvas dimensions to match the video feed.
      
      canvas.width = video.videoWidth;
      
      canvas.height = video.videoHeight;
  
      
      const context = canvas.getContext("2d");
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert the canvas image to a Blob (PNG in this example)
      
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the Blob.
          const file = new File([blob], "captured.png", { type: "image/png" });
          
          // Use DataTransfer to simulate file selection.
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          
          fileInput.files = dataTransfer.files;
  
          // (Optional) For debugging, log the file list.
          
          console.log("File Input Files:", fileInput.files);
        }
      }, "image/png");
    }
  
    // Stop the camera stream when done.
    function stopCamera() {
      
      if (stream) {
        
        stream.getTracks().forEach(track => track.stop());
      }
    }

    
  </script>
  
  <style>
    video, canvas {
      max-width: 100%;
      border: 1px solid #ccc;
      margin-bottom: 1em;
    }
  </style>
  
  <div>
    <!-- Button to start the webcam -->
    <button on:click={startCamera}>Start Camera</button>
    
    <!-- Video element to display the webcam feed -->
    <video bind:this={video} autoplay playsinline></video>
    
    <!-- Button to capture a photo -->
    <button on:click={capture}>Capture Photo</button>
    
    <!-- Hidden canvas for processing the captured image -->
    <canvas bind:this={canvas} style="display:none;"></canvas>
    
    <!-- Hidden file input that will hold the captured image file -->
    <input type="file" bind:this={fileInput} style="display:none;" />
    
    <!-- (Optional) Button to stop the camera -->
    <button on:click={stopCamera}>Stop Camera</button>



  {#if fileInput}
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
  </div>
  