-- Database Schema - Asistente Vial México
CREATE DATABASE asistente_vial;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners table
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    partner_id INTEGER REFERENCES partners(id),
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    description TEXT,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Emergency requests table
CREATE TABLE emergency_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    emergency_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    description TEXT,
    response_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password, name, phone, user_type) VALUES
('admin@asistentevial.mx', '$2b$10$example', 'Admin', '5551234567', 'admin'),
('user@example.com', '$2b$10$example', 'Usuario Demo', '5559876543', 'user');

INSERT INTO partners (name, business_type, address, phone, latitude, longitude, rating) VALUES
('Taller El Güero', 'taller', 'Av. Universidad 123, Naucalpan', '5551111111', 19.4969, -99.2356, 4.5),
('Grúas Rápidas 24/7', 'grua', 'Carretera México-Querétaro Km 15', '5552222222', 19.5033, -99.2342, 4.8),
('Refaccionaria La Central', 'refaccionaria', 'Eje Central 567, CDMX', '5553333333', 19.4326, -99.1332, 4.2);