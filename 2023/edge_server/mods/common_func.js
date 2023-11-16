// start and end are objects with latitude and longitude
//decimals (default 2) is number of decimals in the output
//return is distance in kilometers.
const getDistance = (start, end, decimals) => {
    if (typeof Number.prototype.toRad === "undefined") {
      Number.prototype.toRad = function () {
        return (this * Math.PI) / 180;
      };
    }
  
    decimals = decimals || 2;
    var earthRadius = 6371; // km
    lat1 = parseFloat(start[0]);
    lat2 = parseFloat(end[0]);
    lon1 = parseFloat(start[1]);
    lon2 = parseFloat(end[1]);
  
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();
  
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

module.exports = { getDistance };