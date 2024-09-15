function date() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, '0'); // Day
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month (January is 0)
    const yyyy = currentDate.getFullYear(); // Year

    let time ;
    if(Number(currentDate.getHours()) <= 12){
        time = currentDate.getHours() + ":" + currentDate.getMinutes() + " AM";
    }
    else{
        time = currentDate.getHours() + ":" + currentDate.getMinutes() + " PM";
    }

    const formattedDate = `${dd}/${mm}/${yyyy}`; // Format as mm/dd/yyyy
    const dateString = days[currentDate.getDay()] + ", " + months[currentDate.getMonth()] + " " + dd + " at " + time;
    return {
        formattedDate,
        dateString
    };
}

export {
    date
}