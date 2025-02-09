<script lang="ts">
    import '../app.css';
    import TextArea from '../components/TextArea.svelte';
    import Button from '../components/Button.svelte';
    let textValue = '';
    let members: string[] = []; 

     function processInput() {
      console.log('Input value:', textValue);
      members = textValue.split(',').map(member => member.trim());
      console.log('Members:', members);
      // Add your processing logic here
    }

    let headers = ['Name', 'Age', 'City'];
    type Row = {
        [key: string]: string | number;
        Name: string;
        Age: number;
        City: string;
    };

    let rows: Row[] = [
        { Name: 'John', Age: 25, City: 'New York' },
        { Name: 'Jane', Age: 30, City: 'Los Angeles' }
    ];

    function addRow() {
        rows = [...rows, { Name: '', Age: 0, City: '' }];
    }

    function getTableData() {
        console.log(rows); // This will log the table data as an array of objects
    }
  </script>
  
  <main class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-blue-600">Bayar Dewe Dewe</h1>
    <p class="mt-4 text-gray-700">Easy split bill apps with 100% data privacy, all data stored in user's device.</p>
    <br />
    <TextArea placeholder="Type all the member seperated with comma..." bind:value={textValue} />
    <Button label="Add All Member" onClick={processInput} />

      <ul class="mt-4 list-disc list-inside">   
        {#each members as member}
          <li>{member}</li>
        {/each}
      </ul>    

<table class="mt-4 border-collapse border border-gray-300 w-full">
  <thead>
    <tr>
      {#each headers as header}
        <th class="border border-gray-300 p-2">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i}
      <tr>
        {#each headers as header}
          <td class="border border-gray-300 p-2">
            <input class="w-full p-1" bind:value={row[header]} placeholder={header} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<Button label="Add Row" onClick={addRow} />
<Button label="Get Table Data" onClick={getTableData} />
  </main>