const express = require('express');
const axios = require('axios').default;
const router = express.Router();



  //findCitiesById 
  router.get("/:zipCode", async (req , res , next) =>{
    const zipCode = req.params.zipCode;

    if (!zipCode || typeof zipCode !== 'string') {
        return res.status(400).json({ error: "Zip code must be a non-empty string." });
    }

    const apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${zipCode}`;

    try {
         await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            
            const cities = response.data;

            if (cities.length > 0) {
                const cityNames = cities.map(city => city.nom);
    
                res.json({ success: true,  cities: cityNames });
    
            } else {
                res.status(404).json({ success: false, error: "No cities found for the provided postal code" });
            }
          });;
        
    } catch (error) {
        console.error('Error details:', error); 
        if (error.response) {
            // API responded with an error status
            console.error(`API error: ${error.response.status} - ${error.response.statusText}`);
            res.status(error.response.status).json({
                success: false,
                error: `API error: ${error.response.data.message || error.response.statusText}`
            });
        } else if (error.request) {
            // Request has been made but no reply has been received
            console.error('No response received from the API:', error.request);
            res.status(502).json({ success: false, error: "No response received from the API" });
        } else {
            // Another error occurred when configuring the request
            console.error('Request error:', error.message);
            res.status(500).json({ success: false, error: `Request error: ${error.message}` });
        }
    }
  });
  

module.exports = router ;