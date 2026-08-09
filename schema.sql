-- Database schema for Krishisetu Agricultural Data Platform

-- Table for pest data
CREATE TABLE IF NOT EXISTS pest_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    observation_year INT NOT NULL,
    standard_week INT NOT NULL,
    pest_value DECIMAL(10, 4),
    collection_type VARCHAR(100),
    maxt DECIMAL(10, 4),
    mint DECIMAL(10, 4),
    rh1_percent DECIMAL(10, 4),
    rh2_percent DECIMAL(10, 4),
    rf_mm DECIMAL(10, 4),
    ws_kmph DECIMAL(10, 4),
    ssh_hrs DECIMAL(10, 4),
    evp_mm DECIMAL(10, 4),
    pest_name VARCHAR(100),
    location VARCHAR(100),
    INDEX idx_observation_year (observation_year),
    INDEX idx_location (location),
    INDEX idx_pest_name (pest_name),
    INDEX idx_standard_week (standard_week)
);

-- Table for Bhandara weather data
CREATE TABLE IF NOT EXISTS bhandara_weather (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sr_no INT,
    date DATE,
    time TIME,
    wind_speed_ms DECIMAL(10, 4),
    wind_direction_n DECIMAL(10, 4),
    atmospheric_pressure_hpa DECIMAL(10, 4),
    temperature_celsius DECIMAL(10, 4),
    humidity_percent DECIMAL(10, 4),
    solar_radiation_wm2 DECIMAL(10, 4),
    battery_voltage_v DECIMAL(10, 4),
    INDEX idx_date (date),
    INDEX idx_sr_no (sr_no)
);

-- Table for Raigad weather data
CREATE TABLE IF NOT EXISTS raigad_weather (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sr_no INT,
    date DATE,
    time TIME,
    wind_speed_ms DECIMAL(10, 4),
    wind_direction_n DECIMAL(10, 4),
    atmospheric_pressure_hpa DECIMAL(10, 4),
    temperature_celsius DECIMAL(10, 4),
    humidity_percent DECIMAL(10, 4),
    solar_radiation_wm2 DECIMAL(10, 4),
    battery_voltage_v DECIMAL(10, 4),
    INDEX idx_date (date),
    INDEX idx_sr_no (sr_no)
);

-- Table for Ratnagiri weather data
CREATE TABLE IF NOT EXISTS ratnagiri_weather (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sr_no INT,
    date DATE,
    time TIME,
    wind_speed_ms DECIMAL(10, 4),
    wind_direction_n DECIMAL(10, 4),
    atmospheric_pressure_hpa DECIMAL(10, 4),
    temperature_celsius DECIMAL(10, 4),
    humidity_percent DECIMAL(10, 4),
    solar_radiation_wm2 DECIMAL(10, 4),
    battery_voltage_v DECIMAL(10, 4),
    INDEX idx_date (date),
    INDEX idx_sr_no (sr_no)
);