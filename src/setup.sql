--ORGANIZATION
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM organization;


--PROJECT
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

--BrightFuture Builders
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Painting and repairing walls at the local youth center.', '123 Main St', '2026-04-10'),
(1, 'Park Bench Installation', 'Building and installing new eco-friendly benches.', 'Central Park', '2026-04-18'),
(1, 'Roof Repair Workshop', 'Teaching volunteers basic roof maintenance for community homes.', '45 Elm St', '2026-05-02'),
(1, 'Accessibility Ramp Build', 'Constructing a wheelchair ramp for a community library.', '89 Library Ln', '2026-05-15'),
(1, 'Neighborhood Cleanup Drive', 'Removing debris and painting over graffiti.', 'Eastside District', '2026-06-01');

--GreenHarvest Growers
INSERT INTO project (organization_id, title, description, location, date) VALUES
(2, 'Urban Garden Setup', 'Setting up raised garden beds in vacant lots.', '742 Evergreen Terrace', '2026-04-05'),
(2, 'Composting 101 Workshop', 'Educating residents on organic waste management.', 'Greenharvest Center', '2026-04-22'),
(2, 'Spring Planting Day', 'Planting seasonal vegetables and herbs.', 'Community Plot B', '2026-05-05'),
(2, 'Harvest Fest & Market', 'Gathering crops and distributing fresh produce to families.', 'Downtown Plaza', '2026-05-20'),
(2, 'Rain Barrel Installation', 'Installing water conservation systems for urban plots.', 'Northside Garden', '2026-06-10');

--UnityServe Volunteers
INSERT INTO project (organization_id, title, description, location, date) VALUES
(3, 'Food Drive Sorting', 'Sorting and packing donated non-perishable food items.', 'Unity Hall', '2026-04-12'),
(3, 'Senior Tech Support', 'Helping elderly residents learn how to use smartphones and computers.', 'Senior Living Center', '2026-04-25'),
(3, 'Winter Coat Distribution', 'Handing out warm coats to unhoused community members.', 'City Square', '2026-05-08'),
(3, 'After-School Tutoring', 'Assisting kids with math and reading assignments.', 'Community Library', '2026-05-22'),
(3, 'Charity Run Support', 'Handing out water and guiding runners along the marathon route.', 'Memorial Parkway', '2026-06-15');

SELECT * FROM project;



--CATEGORY
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name) VALUES 
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

SELECT * FROM category;



--PROJETC_CATEGORY
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id) 
        REFERENCES project(project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id) 
        REFERENCES category(category_id) 
        ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), (1, 2),  -- Project 1 - Community Service & Educational
(2, 1),          -- Project 2 - Environmental
(3, 2),          -- Project 3 - Educational
(4, 3),          -- Project 4 - Community Service
(5, 1),          -- Project 5 - Environmental
(6, 1), (6, 2),  -- Project 6 - Environmental & Educational
(7, 2),          -- Project 7 - Educational
(8, 1),          -- Project 8 - Environmental
(9, 3),          -- Project 9 - Community Service
(10, 1),         -- Project 10 - Environmental
(11, 3),         -- Project 11 - Community Service
(12, 2), (12, 4),-- Project 12 - Educational & Health and Wellness
(13, 3),         -- Project 13 - Community Service
(14, 2),         -- Project 14 - Educational
(15, 3);		 -- Project 15 - Community Service

SELECT * FROM project_category;

--ROLES
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

--ROLES
INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

SELECT * FROM roles;

--USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';