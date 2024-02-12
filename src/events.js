function dictionary() {
	fetch('/data')
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    // return response.json();
		return response.json();
  })
  .then(data => {
    // Handle the JSON data
    console.log('Data received:', data);
		return data;
  })
  .catch(error => {
    // Handle any errors that occur during the fetch operation
    console.error('Fetch error:', error);
  });

}
