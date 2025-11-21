import type { NOAAResponse, ClimateData, NOAADataPoint } from "@/types/climate";

// Convert NOAA data format to simplified climate data
export function transformClimateData(
  data: NOAAResponse,
  location: string,
  locationId: string,
  startDate: string,
  endDate: string
): ClimateData {
  // Group data points by date
  const dataByDate = new Map<string, {
    tempMax?: number;
    tempMin?: number;
    tempAvg?: number;
    precipitation?: number;
    snow?: number;
  }>();

  data.results.forEach((point: NOAADataPoint) => {
    const date = point.date.split("T")[0]; // Extract date part
    const existing = dataByDate.get(date) || {};

    // NOAA stores temps in tenths of degrees C, precip in tenths of mm
    switch (point.datatype) {
      case "TMAX":
        existing.tempMax = point.value / 10;
        break;
      case "TMIN":
        existing.tempMin = point.value / 10;
        break;
      case "TAVG":
        existing.tempAvg = point.value / 10;
        break;
      case "PRCP":
        existing.precipitation = point.value / 10;
        break;
      case "SNOW":
        existing.snow = point.value / 10;
        break;
    }

    dataByDate.set(date, existing);
  });

  // Convert to array and sort by date
  const timeSeries = Array.from(dataByDate.entries())
    .map(([date, values]) => ({
      date,
      ...values,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate summary statistics
  let sumTempMax = 0;
  let countTempMax = 0;
  let sumTempMin = 0;
  let countTempMin = 0;
  let totalPrecipitation = 0;

  timeSeries.forEach((point) => {
    if (point.tempMax !== undefined) {
      sumTempMax += point.tempMax;
      countTempMax++;
    }
    if (point.tempMin !== undefined) {
      sumTempMin += point.tempMin;
      countTempMin++;
    }
    if (point.precipitation !== undefined) {
      totalPrecipitation += point.precipitation;
    }
  });

  return {
    location,
    locationId,
    startDate,
    endDate,
    timeSeries,
    summary: {
      avgTempMax: countTempMax > 0 ? sumTempMax / countTempMax : 0,
      avgTempMin: countTempMin > 0 ? sumTempMin / countTempMin : 0,
      totalPrecipitation,
      dataPoints: timeSeries.length,
    },
  };
}

// Generate mock climate data for demo mode
export function getMockClimateData(location: string): ClimateData {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1); // 1 year of data

  const timeSeries = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfYear = Math.floor(
      (current.getTime() - new Date(current.getFullYear(), 0, 0).getTime()) /
        86400000
    );

    // Sinusoidal temperature pattern
    const baseTemp = 15 + 10 * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2);
    const variation = Math.random() * 6 - 3;

    timeSeries.push({
      date: current.toISOString().split("T")[0],
      tempMax: Math.round((baseTemp + 5 + variation) * 10) / 10,
      tempMin: Math.round((baseTemp - 5 + variation) * 10) / 10,
      tempAvg: Math.round((baseTemp + variation) * 10) / 10,
      precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 50 * 10) / 10 : 0,
    });

    current.setDate(current.getDate() + 7); // Weekly data points
  }

  const avgTempMax =
    timeSeries.reduce((sum, p) => sum + (p.tempMax || 0), 0) / timeSeries.length;
  const avgTempMin =
    timeSeries.reduce((sum, p) => sum + (p.tempMin || 0), 0) / timeSeries.length;
  const totalPrecipitation = timeSeries.reduce(
    (sum, p) => sum + (p.precipitation || 0),
    0
  );

  return {
    location,
    locationId: "MOCK:CITY",
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    timeSeries,
    summary: {
      avgTempMax: Math.round(avgTempMax * 10) / 10,
      avgTempMin: Math.round(avgTempMin * 10) / 10,
      totalPrecipitation: Math.round(totalPrecipitation * 10) / 10,
      dataPoints: timeSeries.length,
    },
  };
}
