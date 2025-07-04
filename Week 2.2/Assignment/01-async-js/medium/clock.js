function pad(n) {
     return n < 10 ? "0" + n : n;
}

function displayTime() {
  const now = new Date();

    const hours24 = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const timeIn24 = `${hours24}:${minutes}:${seconds}`;
    const amORpm = (now.getHours()<12) ? "AM" : "PM";
    
    let hours12 = now.getHours() % 12;
    if(hours12 === 0) hours12 = 12;

    
    const timeIn12 = `${hours12}:${minutes}:${seconds} ${amORpm}`;
    
    
    //24 hour format -> HH:MM::SS (Eg. 13:45:23)
    console.log(timeIn24)
    //12 hour format -> HH:MM::SS (Eg 01:45:23 PM)
    console.log(timeIn12)


    
}

setInterval(displayTime, 1000);