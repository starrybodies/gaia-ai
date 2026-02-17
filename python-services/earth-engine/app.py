#!/usr/bin/env python3
"""
Earth Engine Python API Service
Provides real satellite data from Google Earth Engine
"""

import os
import json
import ee
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Earth Engine
def initialize_earth_engine():
    """Initialize Earth Engine with service account credentials"""
    try:
        # Load credentials from environment
        credentials_json = os.getenv('GOOGLE_EARTH_ENGINE_KEY')
        if not credentials_json:
            print("[ERROR] GOOGLE_EARTH_ENGINE_KEY not found in environment")
            return False

        credentials = json.loads(credentials_json)
        service_account = credentials['client_email']

        # Create credentials file
        credentials_file = '/tmp/ee-service-account.json'
        with open(credentials_file, 'w') as f:
            json.dump(credentials, f)

        # Initialize Earth Engine
        credentials_obj = ee.ServiceAccountCredentials(service_account, credentials_file)
        ee.Initialize(credentials_obj)

        print(f"[SUCCESS] Earth Engine initialized with {service_account}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to initialize Earth Engine: {e}")
        return False

# Initialize on startup
EE_INITIALIZED = initialize_earth_engine()


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'earth_engine': 'initialized' if EE_INITIALIZED else 'failed',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/ndvi', methods=['GET'])
def get_ndvi():
    """Get Sentinel-2 NDVI data"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Try progressively longer date ranges to find images
        end_date = datetime.utcnow()
        collection_size = 0
        date_ranges = [30, 90, 180, 365]  # Days to look back

        for days_back in date_ranges:
            start_date = end_date - timedelta(days=days_back)

            collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
                .filterBounds(point) \
                .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 80))

            collection_size = collection.size().getInfo()
            print(f"[INFO] Searching {days_back} days: found {collection_size} images")

            if collection_size > 0:
                break

        if collection_size == 0:
            print(f"[WARNING] No images found for {lat}, {lon} in last year")
            # Try one more time with no cloud filter
            start_date = end_date - timedelta(days=365)
            collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
                .filterBounds(point) \
                .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))

            collection_size = collection.size().getInfo()
            print(f"[INFO] No cloud filter: found {collection_size} images")

            if collection_size == 0:
                return jsonify({
                    'mean': 0,
                    'min': 0,
                    'max': 0,
                    'stdDev': 0,
                    'cloudCover': 0,
                    'timestamp': datetime.utcnow().isoformat(),
                    'source': 'Sentinel-2 SR Harmonized',
                    'info': f'No satellite images available for this location'
                })

        # Calculate NDVI
        def calc_ndvi(image):
            ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
            return ndvi

        ndvi_collection = collection.map(calc_ndvi)

        # Get median NDVI
        ndvi_median = ndvi_collection.median()

        # Calculate statistics
        stats = ndvi_median.reduceRegion(
            reducer=ee.Reducer.mean().combine(
                ee.Reducer.minMax(), '', True
            ).combine(
                ee.Reducer.stdDev(), '', True
            ),
            geometry=region,
            scale=10,
            maxPixels=1e9
        ).getInfo()

        # Get cloud cover
        cloud_cover = collection.aggregate_mean('CLOUDY_PIXEL_PERCENTAGE').getInfo()

        print(f"[INFO] NDVI - Mean: {stats.get('NDVI_mean', 0):.3f}, Cloud: {cloud_cover:.1f}%")

        return jsonify({
            'mean': round(stats.get('NDVI_mean', 0), 3),
            'min': round(stats.get('NDVI_min', 0), 3),
            'max': round(stats.get('NDVI_max', 0), 3),
            'stdDev': round(stats.get('NDVI_stdDev', 0), 3),
            'cloudCover': round(cloud_cover or 0, 1),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'Sentinel-2 SR Harmonized (Real Data)'
        })
    except Exception as e:
        print(f"[ERROR] NDVI calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/landcover', methods=['GET'])
def get_landcover():
    """Get ESA WorldCover land classification"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get ESA WorldCover 2021 (or 2020)
        try:
            worldcover = ee.ImageCollection('ESA/WorldCover/v200').first()
        except:
            worldcover = ee.ImageCollection('ESA/WorldCover/v100').first()

        # Land cover class names
        class_names = {
            10: 'Tree cover',
            20: 'Shrubland',
            30: 'Grassland',
            40: 'Cropland',
            50: 'Built-up',
            60: 'Bare/sparse vegetation',
            70: 'Snow and ice',
            80: 'Water bodies',
            90: 'Herbaceous wetland',
            95: 'Mangroves',
            100: 'Moss and lichen'
        }

        # Get frequency histogram - count pixels per class
        histogram = worldcover.select('Map').reduceRegion(
            reducer=ee.Reducer.frequencyHistogram(),
            geometry=region,
            scale=10,
            maxPixels=1e9
        ).getInfo()

        # Parse results
        class_counts = histogram.get('Map', {})
        total_pixels = sum(class_counts.values()) if class_counts else 0

        classes = {}
        for class_id, count in class_counts.items():
            class_num = int(class_id)
            percentage = (count / total_pixels * 100) if total_pixels > 0 else 0

            classes[class_id] = {
                'name': class_names.get(class_num, 'Unknown'),
                'percentage': round(percentage, 1),
                'pixel_count': int(count)
            }

        print(f"[INFO] Land cover - {len(classes)} classes found")

        return jsonify({
            'classes': classes,
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'ESA WorldCover v200'
        })
    except Exception as e:
        print(f"[ERROR] Land cover calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/temperature', methods=['GET'])
def get_temperature():
    """Get MODIS Land Surface Temperature"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent MODIS LST data (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)

        collection = ee.ImageCollection('MODIS/061/MOD11A1') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('LST_Day_1km')

        # Convert from Kelvin to Celsius and get mean
        def kelvin_to_celsius(image):
            return image.multiply(0.02).subtract(273.15)

        lst_celsius = collection.map(kelvin_to_celsius).median()

        # Calculate statistics
        stats = lst_celsius.reduceRegion(
            reducer=ee.Reducer.mean().combine(
                ee.Reducer.minMax(), '', True
            ),
            geometry=region,
            scale=1000,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'mean_celsius': round(stats.get('LST_Day_1km_mean', 0), 1),
            'min_celsius': round(stats.get('LST_Day_1km_min', 0), 1),
            'max_celsius': round(stats.get('LST_Day_1km_max', 0), 1),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'MODIS MOD11A1'
        })
    except Exception as e:
        print(f"[ERROR] Temperature calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/soil-moisture', methods=['GET'])
def get_soil_moisture():
    """Get SMAP Soil Moisture"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent SMAP data (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)

        collection = ee.ImageCollection('NASA/SMAP/SPL4SMGP/007') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('sm_surface')

        # Get median soil moisture
        sm_median = collection.median()

        # Calculate statistics
        stats = sm_median.reduceRegion(
            reducer=ee.Reducer.mean().combine(
                ee.Reducer.minMax(), '', True
            ),
            geometry=region,
            scale=11000,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'mean': round(stats.get('sm_surface_mean', 0), 3),
            'min': round(stats.get('sm_surface_min', 0), 3),
            'max': round(stats.get('sm_surface_max', 0), 3),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'SMAP SPL4SMGP',
            'unit': 'm³/m³'
        })
    except Exception as e:
        print(f"[ERROR] Soil moisture calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/precipitation', methods=['GET'])
def get_precipitation():
    """Get GPM IMERG Precipitation"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent precipitation data (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)

        collection = ee.ImageCollection('NASA/GPM_L3/IMERG_V06') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('precipitation')

        # Calculate total precipitation
        total_precip = collection.sum()

        # Calculate statistics
        stats = total_precip.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=11000,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'total_mm': round(stats.get('precipitation', 0), 2),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'GPM IMERG V06',
            'period': '30 days'
        })
    except Exception as e:
        print(f"[ERROR] Precipitation calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/evapotranspiration', methods=['GET'])
def get_evapotranspiration():
    """Get MODIS Evapotranspiration"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent ET data (last 60 days, MOD16A2 is 8-day composite)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=60)

        collection = ee.ImageCollection('MODIS/061/MOD16A2GF') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('ET')

        # Get median ET (scale factor 0.1)
        et_median = collection.median().multiply(0.1)

        # Calculate statistics
        stats = et_median.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=500,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'mean_mm_8day': round(stats.get('ET', 0), 2),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'MODIS MOD16A2GF',
            'unit': 'mm/8-day'
        })
    except Exception as e:
        print(f"[ERROR] Evapotranspiration calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/surface-water', methods=['GET'])
def get_surface_water():
    """Get JRC Global Surface Water"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get JRC surface water data
        water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')

        # Calculate water occurrence
        occurrence = water.select('occurrence')

        # Calculate statistics
        stats = occurrence.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=30,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'water_occurrence_pct': round(stats.get('occurrence', 0), 1),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'JRC Global Surface Water v1.4',
            'info': 'Percentage of time water was present (1984-2021)'
        })
    except Exception as e:
        print(f"[ERROR] Surface water calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/air-quality', methods=['GET'])
def get_air_quality():
    """Get Sentinel-5P TROPOMI Air Quality"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent NO2 data (last 7 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)

        collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('tropospheric_NO2_column_number_density')

        # Get median NO2
        no2_median = collection.median()

        # Calculate statistics
        stats = no2_median.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=1113,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'no2_mol_m2': stats.get('tropospheric_NO2_column_number_density', 0),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'Sentinel-5P TROPOMI',
            'pollutant': 'NO2',
            'unit': 'mol/m²'
        })
    except Exception as e:
        print(f"[ERROR] Air quality calculation failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/fire', methods=['GET'])
def get_fire():
    """Get MODIS/VIIRS Active Fires"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Get recent fire data (last 7 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)

        collection = ee.ImageCollection('MODIS/061/MOD14A1') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .select('MaxFRP')

        # Count fire detections
        fire_count = collection.count()

        # Calculate max fire radiative power
        stats = fire_count.reduceRegion(
            reducer=ee.Reducer.max(),
            geometry=region,
            scale=1000,
            maxPixels=1e9
        ).getInfo()

        return jsonify({
            'fire_detections': int(stats.get('MaxFRP', 0)),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'MODIS MOD14A1',
            'period': '7 days'
        })
    except Exception as e:
        print(f"[ERROR] Fire detection failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/environmental-assessment', methods=['GET'])
def get_environmental_assessment():
    """Get comprehensive environmental assessment with scoring"""
    if not EE_INITIALIZED:
        return jsonify({'error': 'Earth Engine not initialized'}), 500

    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10)) * 1000  # km to meters

        print(f"[INFO] Environmental assessment for {lat}, {lon}")

        # Create point and buffer
        point = ee.Geometry.Point([lon, lat])
        region = point.buffer(radius)

        # Initialize results
        results = {
            'coordinates': {'lat': lat, 'lon': lon},
            'radius_km': radius / 1000,
            'timestamp': datetime.utcnow().isoformat(),
            'metrics': {},
            'scores': {},
            'overall_score': 0,
            'health_grade': 'Unknown',
            'recommendations': []
        }

        # 1. NDVI (Vegetation Health)
        try:
            end_date = datetime.utcnow()
            for days_back in [30, 90, 180, 365]:
                start_date = end_date - timedelta(days=days_back)
                collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
                    .filterBounds(point) \
                    .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 80))
                if collection.size().getInfo() > 0:
                    ndvi_collection = collection.map(lambda img: img.normalizedDifference(['B8', 'B4']).rename('NDVI'))
                    ndvi_median = ndvi_collection.median()
                    stats = ndvi_median.reduceRegion(
                        reducer=ee.Reducer.mean(),
                        geometry=region,
                        scale=10,
                        maxPixels=1e9
                    ).getInfo()
                    ndvi_mean = stats.get('NDVI', 0)
                    results['metrics']['ndvi'] = {'value': round(ndvi_mean, 3), 'unit': 'index'}
                    # Score: 0.8-1.0 = 100, 0.6-0.8 = 80, 0.4-0.6 = 60, 0.2-0.4 = 40, <0.2 = 20
                    if ndvi_mean >= 0.8:
                        results['scores']['vegetation'] = 100
                    elif ndvi_mean >= 0.6:
                        results['scores']['vegetation'] = 60 + ((ndvi_mean - 0.6) / 0.2) * 40
                    elif ndvi_mean >= 0.4:
                        results['scores']['vegetation'] = 40 + ((ndvi_mean - 0.4) / 0.2) * 20
                    elif ndvi_mean >= 0.2:
                        results['scores']['vegetation'] = 20 + ((ndvi_mean - 0.2) / 0.2) * 20
                    else:
                        results['scores']['vegetation'] = max(0, ndvi_mean / 0.2 * 20)
                    break
        except Exception as e:
            print(f"[WARN] NDVI failed: {e}")
            results['metrics']['ndvi'] = {'value': 0, 'unit': 'index', 'error': str(e)}
            results['scores']['vegetation'] = 50  # Neutral score

        # 2. Land Cover Diversity
        try:
            worldcover = ee.ImageCollection('ESA/WorldCover/v200').first()
            histogram = worldcover.select('Map').reduceRegion(
                reducer=ee.Reducer.frequencyHistogram(),
                geometry=region,
                scale=10,
                maxPixels=1e9
            ).getInfo()
            class_counts = histogram.get('Map', {})
            total_pixels = sum(class_counts.values()) if class_counts else 0

            # Calculate natural land cover percentage
            natural_pct = 0
            class_names = {10: 'Tree cover', 20: 'Shrubland', 30: 'Grassland', 40: 'Cropland',
                          50: 'Built-up', 60: 'Bare/sparse vegetation', 70: 'Snow and ice',
                          80: 'Water bodies', 90: 'Herbaceous wetland', 95: 'Mangroves',
                          100: 'Moss and lichen'}

            for class_id, count in class_counts.items():
                p = count / total_pixels

                # Natural land cover (not built-up)
                if int(class_id) in [10, 20, 30, 80, 90, 95, 100]:
                    natural_pct += p * 100

            results['metrics']['landcover_diversity'] = {'value': len(class_counts), 'unit': 'classes'}
            results['metrics']['natural_landcover'] = {'value': round(natural_pct, 1), 'unit': '%'}

            # Score based on natural land cover percentage
            results['scores']['landcover'] = min(100, natural_pct)

        except Exception as e:
            print(f"[WARN] Land cover failed: {e}")
            results['scores']['landcover'] = 50

        # 3. Surface Water
        try:
            water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
            occurrence = water.select('occurrence')
            stats = occurrence.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=region,
                scale=30,
                maxPixels=1e9
            ).getInfo()
            water_pct = stats.get('occurrence', 0)
            results['metrics']['water_occurrence'] = {'value': round(water_pct, 1), 'unit': '%'}
            # Optimal water: 5-15% (balanced), score accordingly
            if 5 <= water_pct <= 15:
                results['scores']['water'] = 100
            elif water_pct < 5:
                results['scores']['water'] = max(20, water_pct / 5 * 100)
            else:
                results['scores']['water'] = max(20, 100 - ((water_pct - 15) / 85 * 80))
        except Exception as e:
            print(f"[WARN] Water failed: {e}")
            results['scores']['water'] = 50

        # Calculate overall score (weighted average)
        weights = {'vegetation': 0.4, 'landcover': 0.35, 'water': 0.25}
        overall = 0
        total_weight = 0

        for key, weight in weights.items():
            if key in results['scores']:
                overall += results['scores'][key] * weight
                total_weight += weight

        if total_weight > 0:
            results['overall_score'] = round(overall / total_weight, 1)

        # Assign health grade
        score = results['overall_score']
        if score >= 90:
            results['health_grade'] = 'Excellent'
            results['recommendations'].append('Ecosystem is thriving - continue conservation efforts')
        elif score >= 75:
            results['health_grade'] = 'Good'
            results['recommendations'].append('Healthy ecosystem with room for improvement')
        elif score >= 60:
            results['health_grade'] = 'Fair'
            results['recommendations'].append('Monitor environmental indicators and reduce human impact')
        elif score >= 40:
            results['health_grade'] = 'Poor'
            results['recommendations'].append('Ecosystem under stress - restoration efforts needed')
        else:
            results['health_grade'] = 'Critical'
            results['recommendations'].append('Immediate conservation and restoration required')

        # Add specific recommendations
        if results['scores'].get('vegetation', 50) < 60:
            results['recommendations'].append('Increase vegetation cover through reforestation')
        if results['scores'].get('landcover', 50) < 60:
            results['recommendations'].append('Reduce urban sprawl and preserve natural habitats')
        if results['metrics'].get('water_occurrence', {}).get('value', 10) < 3:
            results['recommendations'].append('Improve water retention and watershed management')

        return jsonify(results)

    except Exception as e:
        print(f"[ERROR] Environmental assessment failed: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
