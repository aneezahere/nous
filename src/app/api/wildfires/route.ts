import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const response = await fetch(
      `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${process.env.NEXT_PUBLIC_NASA_FIRMS_API_KEY}/USA/1/${currentDate}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`NASA FIRMS API returned ${response.status}`);
    }

    const text = await response.text();
    // Skip header row and parse CSV
    const lines = text.split('\n').slice(1);
    const parsedData = lines
      .filter(line => line.trim())
      .map(line => {
        const [
          latitude, 
          longitude, 
          brightness, 
          scan, 
          track, 
          acq_date, 
          acq_time,
          satellite,
          confidence
        ] = line.split(',');

        return {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          acquisition_date: `${acq_date} ${acq_time}`,
          confidence: parseFloat(confidence),
          brightness: parseFloat(brightness)
        };
      });

    return NextResponse.json({ 
      status: 'success',
      data: parsedData 
    });

  } catch (error) {
    console.error('Error fetching wildfire data:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch wildfire data',
        // For development, include error details
        error: (error as Error).message
      }, 
      { status: 500 }
    );
  }
}