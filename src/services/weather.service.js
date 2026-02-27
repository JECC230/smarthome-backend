//Servicio para obtener clima de Open-Meteo (API Externa)
 
 
export async function getWeatherData(city = 'Chihuahua') {
  try {
    // Coordenadas aproximadas de Chihuahua
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=28.63&longitude=-106.08&current_weather=true`);
    const data = await response.json();
    
    if (!data.current_weather) throw new Error('No se pudo obtener el clima');
    
    return {
      temp: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      condition: "Sincronizado con SmartHome",
      unit: "°C"
    };
  } catch (error) {
    console.error('⚠️ Error API Clima:', error.message);
    // Valor de respaldo para que el Front no se quede vacío
    return { temp: 22, condition: "Modo Offline", unit: "°C" }; 
  }
}