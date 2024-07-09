export function getTime() {
    let date = new Date();
    let months = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
    return `${months[date.getMonth()]} ${date.getHours()}:${date.getMinutes()}`;
}

export function convertDate(d) {
    let date = new Date(d);
    let options = { month: 'short', day: '2-digit' };
    if (date.getFullYear() !== new Date().getFullYear())
        options.year = 'numeric'
    return date.toLocaleDateString('en-US', options);
}