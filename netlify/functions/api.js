/**
 * Netlify Function to serve character data with embedded data
 * This version embeds the character data directly to avoid file system issues
 */

// Import the character data directly (this will be generated)
const { charactersData } = require('./characters-data.js');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { httpMethod, path } = event;
    
    // Parse the path to determine the endpoint
    const pathParts = path.split('/').filter(Boolean);
    const endpoint = pathParts[pathParts.length - 1];

    switch (httpMethod) {
      case 'GET':
        if (endpoint === 'characters') {
          // Return all characters
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(charactersData.characters),
          };
        } else if (pathParts.includes('characters') && pathParts.length > 2) {
          // Get specific character by ID
          const characterId = pathParts[pathParts.length - 1];
          const character = charactersData.characters.find(char => char.id === characterId);
          
          if (!character) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Character not found' }),
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(character),
          };
        }
        break;

      case 'POST':
        if (endpoint === 'characters') {
          // Create new character
          const newCharacter = JSON.parse(event.body);
          newCharacter.id = `char_${Date.now()}`;
          charactersData.characters.push(newCharacter);
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newCharacter),
          };
        }
        break;

      case 'PUT':
        if (pathParts.includes('characters') && pathParts.length > 2) {
          // Update character
          const characterId = pathParts[pathParts.length - 1];
          const characterIndex = charactersData.characters.findIndex(char => char.id === characterId);
          
          if (characterIndex === -1) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Character not found' }),
            };
          }
          
          const updatedCharacter = JSON.parse(event.body);
          charactersData.characters[characterIndex] = { ...updatedCharacter, id: characterId };
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(charactersData.characters[characterIndex]),
          };
        }
        break;

      case 'DELETE':
        if (pathParts.includes('characters') && pathParts.length > 2) {
          // Delete character
          const characterId = pathParts[pathParts.length - 1];
          const characterIndex = charactersData.characters.findIndex(char => char.id === characterId);
          
          if (characterIndex === -1) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Character not found' }),
            };
          }
          
          charactersData.characters.splice(characterIndex, 1);
          
          return {
            statusCode: 204,
            headers,
            body: '',
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // If no route matches, return 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };

  } catch (error) {
    console.error('Error in API function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
