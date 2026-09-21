const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPBOX_PUBLIC_API || process.env.MAPBOX_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!apiKey) {
        throw new Error('Mapbox API key is missing. Please set MAPBOX_PUBLIC_API in .env');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.features && response.data.features.length > 0) {
            const [lng, lat] = response.data.features[0].center;
            return {
                ltd: lat,
                lng: lng
            };
        } else {
            throw new Error('Coordinates not found for the given address');
        }
    } catch (error) {
        console.error('Mapbox Geocoding Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.MAPBOX_PUBLIC_API || process.env.MAPBOX_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!apiKey) {
        throw new Error('Mapbox API key is missing. Please set MAPBOX_PUBLIC_API in .env');
    }

    try {
        // First resolve address strings into coordinates
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        // Mapbox Directions API expects: {lng},{lat};{lng},{lat}
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.ltd};${destinationCoords.lng},${destinationCoords.ltd}?geometries=geojson&access_token=${apiKey}`;

        const response = await axios.get(url);
        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: route.distance
                },
                duration: {
                    text: `${Math.round(route.duration / 60)} mins`,
                    value: route.duration
                }
            };
        } else {
            throw new Error('Distance and time not found for the given route');
        }
    } catch (error) {
        console.error('Mapbox Directions Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

module.exports.getSuggestions = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const apiKey = process.env.MAPBOX_PUBLIC_API || process.env.MAPBOX_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!apiKey) {
        throw new Error('Mapbox API key is missing. Please set MAPBOX_PUBLIC_API in .env');
    }

    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}`;

        const response = await axios.get(url);
        if (response.data && response.data.features && response.data.features.length > 0) {
            const suggestions = response.data.features.map(feature => ({
                name: feature.place_name,
                coordinates: feature.center
            }));
            return suggestions;
        } else {
            throw new Error('Suggestions not found for the given address');
        }
    } catch (error) {
        console.error('Mapbox Geocoding Error:', error.response?.data?.message || error.message);
        throw error;
    }
};