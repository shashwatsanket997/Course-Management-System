// All the utility functions are listed here 

module.exports.getAuthToken = () => {
    /*
    Summary. It generates a random string of length 16, will be 
        used for authentication  
    @return: {String} 
    */
    let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
    return token;
}
