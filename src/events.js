var dict = null;

function get_dictionary(){
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
		dict = data
		return data;
  })
  .catch(error => {
    // Handle any errors that occur during the fetch operation
    console.error('Fetch error:', error);
  });
}

function dictionary() {
	if (dict == null){
		get_dictionary();
	}
	return dict;
}

function weather(){
  return null
}