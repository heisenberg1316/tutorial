let counter = 0;

function countUp() {
  console.log(counter);
  counter++;

  // Schedule the next count after 1 second
  setTimeout(countUp, 1000);
}

countUp(); // Start the counter
