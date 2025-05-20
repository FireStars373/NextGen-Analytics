CREATE DATABASE IF NOT EXISTS kvs_krepsinio_analize;
USE kvs_krepsinio_analize;

-- Users table with premium status and subscription end date added
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    premium_status TINYINT DEFAULT 0, -- 1 if premium, 0 if free user
    subscription_end_date DATE DEFAULT NULL,
    Credit_count INT DEFAULT 0,
    phone_number VARCHAR(20),
    Date_Of_Birth DATE,
    terms_accepted TINYINT(1) DEFAULT 0 -- 1 if accepted, 0 if not
);

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number INT,
    team VARCHAR(255),
    position VARCHAR(50),
    photo VARCHAR(255),
    points FLOAT,
    rebounds FLOAT,
    assists FLOAT,
    minutes FLOAT,
    fg2_attempts FLOAT,
    fg2_made FLOAT,
    fg3_attempts FLOAT,
    fg3_made FLOAT,
    ft_attempts FLOAT,
    ft_made FLOAT,
    steals FLOAT,
    blocks FLOAT,
    turnovers FLOAT,
    fouls_committed FLOAT,
    fouls_received FLOAT,
    pir FLOAT,
    
    -- Total statistics across all matches
    total_games INT DEFAULT 0,
    total_points INT DEFAULT 0,
    total_rebounds INT DEFAULT 0,
    total_assists INT DEFAULT 0,
    total_steals INT DEFAULT 0,
    total_blocks INT DEFAULT 0,
    total_turnovers INT DEFAULT 0,
    total_minutes INT DEFAULT 0,
    season_pir FLOAT DEFAULT 0,
    
    -- Match-by-match statistics stored as text
    match_points TEXT DEFAULT '',  -- Format: "match_id:points,match_id:points,..."
    match_rebounds TEXT DEFAULT '',
    match_assists TEXT DEFAULT '',
    match_steals TEXT DEFAULT '',
    match_blocks TEXT DEFAULT '',
    match_turnovers TEXT DEFAULT '',
    match_minutes TEXT DEFAULT '',
    match_plus_minus TEXT DEFAULT '',
    match_pir TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    league VARCHAR(50) NOT NULL,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    points_per_game DECIMAL(5,1),
    points_allowed DECIMAL(5,1),
    rebounds DECIMAL(5,1),
    assists DECIMAL(5,1),
    steals DECIMAL(5,1),
    blocks DECIMAL(5,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Matches table to store basketball game information
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    match_date DATE NOT NULL,
    home_score INT,
    away_score INT,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    venue VARCHAR(255),
    mvp_player_id INT,
    match_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (mvp_player_id) REFERENCES players(id) ON DELETE SET NULL
);

-- Match player statistics table to store individual player performance in each match
CREATE TABLE IF NOT EXISTS match_player_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    minutes_played INT,
    points INT,
    rebounds INT,
    assists INT,
    steals INT,
    blocks INT,
    turnovers INT,
    fouls INT,
    fg2_attempts INT,
    fg2_made INT,
    fg3_attempts INT,
    fg3_made INT,
    ft_attempts INT,
    ft_made INT,
    plus_minus INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE KEY (match_id, player_id)
);

-- Sample data for users table
INSERT INTO users (username, email, password, premium_status, subscription_end_date, Credit_count, phone_number, Date_Of_Birth, terms_accepted) VALUES
('john_doe', 'john@example.com', '$2a$10$XYZ123...', 0, NULL, 0, '+37061234567', '1990-05-15', 1),
('jane_smith', 'jane@example.com', '$2a$10$ABC456...', 1, '2024-05-15', 100, '+37062345678', '1992-08-22', 1),
('coach_mike', 'mike@example.com', '$2a$10$DEF789...', 1, '2024-06-15', 150, '+37063456789', '1985-11-10', 1),
('basketball_fan', 'fan@example.com', '$2a$10$GHI101...', 0, NULL, 0, '+37064567890', '1995-03-30', 1),
('analyst_pro', 'analyst@example.com', '$2a$10$JKL112...', 1, '2024-07-15', 200, '+37065678901', '1988-07-04', 1);

-- Sample data for teams table
INSERT INTO teams (name, league, wins, losses, points_per_game, points_allowed, rebounds, assists, steals, blocks) VALUES
-- LKL Teams
/*id 1*/('Žalgiris Kaunas', 'LKL', 15, 5, 85.6, 78.2, 36.8, 18.5, 6.2, 3.8),
/*id 2*/('Rytas Vilnius', 'LKL', 12, 8, 82.3, 80.1, 35.2, 17.8, 7.1, 2.9),
/*id 3*/('Neptūnas Klaipėda', 'LKL', 10, 10, 79.8, 79.5, 33.7, 16.2, 5.8, 3.1),
/*id 4*/('Lietkabelis Panevėžys', 'LKL', 9, 11, 77.5, 78.9, 34.5, 15.8, 6.5, 2.7),
/*id 5*/('Juventus Utena', 'LKL', 8, 12, 76.2, 81.4, 32.9, 15.1, 5.3, 2.5),
/*id 6*/('CBet', 'LKL', 7, 13, 75.4, 80.6, 32.5, 14.9, 5.2, 2.3),
/*id 7*/('Šiauliai', 'LKL', 11, 9, 78.9, 77.8, 34.1, 16.7, 6.0, 2.8),
/*id 8*/('Pieno žvaigždės', 'LKL', 6, 14, 74.8, 82.3, 31.8, 14.5, 4.9, 2.0),
/*id 9*/('Nevėžis', 'LKL', 5, 15, 73.6, 83.1, 31.2, 14.2, 4.7, 1.9),
/*id 10*/('Dzūkija', 'LKL', 7, 13, 75.1, 81.2, 32.0, 14.7, 5.0, 2.2),
/*id 11*/('Labas GAS', 'LKL', 4, 16, 72.4, 84.0, 30.5, 13.8, 4.5, 1.8),
/*id 12*/('Wolves', 'LKL', 8, 12, 76.8, 80.3, 33.1, 15.4, 5.5, 2.6),
/*id 13*/('Jonava', 'LKL', 5, 15, 73.9, 82.5, 31.5, 14.3, 4.8, 2.1),

-- Euroleague Teams
/*id 14*/('Baskonia', 'Euroleague', 14, 8, 83.5, 79.2, 35.0, 17.2, 6.8, 3.2),
/*id 15*/('Real Madrid', 'Euroleague', 18, 4, 88.2, 75.3, 37.5, 19.1, 7.3, 3.9),
/*id 16*/('FC Barcelona', 'Euroleague', 17, 5, 86.9, 76.2, 36.9, 18.7, 7.0, 3.7),
/*id 17*/('CSKA Moscow', 'Euroleague', 16, 6, 85.3, 77.8, 36.2, 18.1, 6.9, 3.5),
/*id 18*/('Olympiacos', 'Euroleague', 15, 7, 84.1, 78.4, 35.8, 17.5, 6.5, 3.3),
/*id 19*/('Fenerbahçe', 'Euroleague', 14, 8, 83.8, 78.9, 35.5, 17.3, 6.4, 3.2),
/*id 20*/('Anadolu Efes', 'Euroleague', 15, 7, 84.5, 78.1, 35.9, 17.7, 6.7, 3.4),
/*id 21*/('Maccabi Tel Aviv', 'Euroleague', 13, 9, 82.7, 79.5, 34.8, 16.9, 6.3, 3.0),
/*id 22*/('Panathinaikos', 'Euroleague', 12, 10, 81.5, 80.3, 34.2, 16.4, 6.1, 2.9),
/*id 23*/('Bayern Munich', 'Euroleague', 11, 11, 80.4, 80.9, 33.8, 16.1, 5.9, 2.8),
/*id 24*/('ASVEL', 'Euroleague', 10, 12, 79.2, 81.8, 33.3, 15.7, 5.7, 2.6),
/*id 25*/('Olimpia Milano', 'Euroleague', 13, 9, 82.1, 79.8, 34.6, 16.7, 6.2, 3.0),
/*id 26*/('Partizan', 'Euroleague', 12, 10, 81.8, 80.1, 34.4, 16.5, 6.0, 2.8),
/*id 27*/('AS Monaco', 'Euroleague', 14, 8, 83.2, 79.4, 35.2, 17.0, 6.5, 3.1),
/*id 28*/('Virtus Bologna', 'Euroleague', 11, 11, 80.7, 80.5, 34.0, 16.3, 5.8, 2.7),
/*id 29*/('Valencia', 'Euroleague', 10, 12, 79.5, 81.2, 33.5, 15.9, 5.6, 2.5),
/*id 30*/('ALBA Berlin', 'Euroleague', 9, 13, 78.6, 82.1, 33.0, 15.5, 5.4, 2.4),
/*id 31*/('Zalgiris Kaunas', 'Euroleague', 8, 14, 77.8, 82.8, 32.7, 15.2, 5.2, 2.3);

-- Sample data for players table
INSERT INTO players (name, number, team, position, photo, points, rebounds, assists, minutes, fg2_attempts, fg2_made, fg3_attempts, fg3_made, ft_attempts, ft_made, steals, blocks, turnovers, fouls_committed, fouls_received, pir) VALUES
/*id 1*/('Lukas Lekavičius', 11, 'Žalgiris Kaunas', 'PG', 'lekavicius.jpg', 12.5, 2.3, 4.8, 24.5, 48, 25, 72, 28, 35, 30, 1.2, 0.3, 1.8, 2.1, 2.5, 14.2),
/*id 2*/('Marius Grigonis', 10, 'Žalgiris Kaunas', 'SG', 'grigonis.jpg', 14.8, 3.1, 3.2, 26.8, 52, 30, 84, 34, 42, 38, 0.9, 0.2, 1.5, 1.8, 3.1, 16.5),
/*id 3*/('Gytis Masiulis', 14, 'Žalgiris Kaunas', 'PF', 'masiulis.jpg', 8.3, 4.5, 1.1, 19.2, 38, 22, 45, 16, 28, 22, 0.7, 0.8, 0.9, 2.3, 1.8, 10.4),
/*id 4*/('Margiris Normantas', 4, 'Rytas Vilnius', 'PG', 'normantas.jpg', 10.2, 2.8, 5.3, 25.6, 45, 23, 68, 25, 32, 28, 1.4, 0.1, 2.0, 1.9, 2.7, 12.8),
/*id 5*/('Gytis Radzevičius', 15, 'Rytas Vilnius', 'SF', 'radzevicius.jpg', 11.7, 5.2, 2.1, 23.8, 50, 27, 58, 20, 30, 25, 0.8, 0.4, 1.3, 2.0, 2.2, 13.1),
/*id 6*/('Deividas Gailius', 21, 'Neptūnas Klaipėda', 'SG', 'gailius.jpg', 15.2, 3.6, 2.5, 27.5, 55, 32, 80, 30, 44, 40, 1.0, 0.3, 1.7, 1.9, 3.3, 17.3),
/*id 7*/('Žygimantas Janavičius', 13, 'Lietkabelis Panevėžys', 'PG', 'janavicius.jpg', 9.8, 2.4, 6.1, 26.2, 42, 20, 65, 22, 30, 26, 1.6, 0.2, 2.2, 2.0, 2.8, 11.5),
/*id 8*/('Paulius Valinskas', 20, 'Juventus Utena', 'SG', 'valinskas.jpg', 13.8, 2.9, 3.5, 25.1, 48, 26, 75, 28, 38, 32, 1.1, 0.2, 1.6, 1.7, 2.9, 15.2),
/*id 9*/('Tomas Dimša', 7, 'Neptūnas Klaipėda', 'PG', 'dimsa.jpg', 12.1, 2.6, 5.4, 25.7, 46, 24, 70, 26, 33, 29, 1.3, 0.1, 1.9, 1.8, 2.6, 13.2),
/*id 10*/('Mindaugas Girdžiūnas', 8, 'Lietkabelis Panevėžys', 'SG', 'girdziunas.jpg', 10.5, 2.5, 3.8, 24.2, 44, 22, 66, 23, 29, 25, 1.0, 0.2, 1.4, 1.6, 2.4, 12.3),

-- Euroleague Players
/*id 11*/('Arturs Kurucs', 0, 'TDS', 'PG', 'kurucs.jpg', 1.0, 0.4, 0.7, 6.8, 0.4, 0.1, 0.8, 0.2, 0.3, 0.2, 0.1, 0.0, 0.4, 1.2, 0.3, -0.1),
/*id 12*/('Mustafa Abi', 0, 'Anadolu Efes', 'SG', 'abi.jpg', 1.7, 1.1, 0.4, 12.7, 0.8, 0.4, 0.6, 0.2, 0.6, 0.3, 0.3, 0.0, 0.6, 2.1, 0.7, 0.3),
/*id 13*/('Petar Bozic', 0, 'Partizan', 'SG', 'bozic.jpg', 2.7, 1.0, 0.8, 11.4, 0.6, 0.2, 1.9, 0.7, 0.4, 0.3, 0.5, 0.1, 0.8, 2.7, 0.7, 0.6),
/*id 14*/('Sven Schultze', 0, 'Bayern Munich', 'PF', 'schultze.jpg', 3.2, 1.2, 0.4, 9.5, 1.4, 0.7, 1.4, 0.5, 0.5, 0.3, 0.2, 0.0, 0.7, 2.3, 0.7, 0.8),
/*id 15*/('Strahinja Milosevic', 0, 'Partizan', 'C', 'milosevic.jpg', 1.3, 1.0, 0.2, 5.7, 0.9, 0.5, 0.2, 0.0, 0.5, 0.3, 0.2, 0.1, 0.3, 1.2, 0.5, 0.8),
/*id 16*/('Birkan Batuk', 0, 'Anadolu Efes', 'SF', 'batuk.jpg', 3.2, 1.4, 0.3, 13.3, 0.9, 0.4, 2.0, 0.7, 0.5, 0.3, 0.4, 0.0, 0.3, 2.4, 0.6, 1.1),
/*id 17*/('Diego Flaccadori', 0, 'EA7 Milano', 'SG', 'flaccadori.jpg', 2.6, 0.7, 0.9, 9.4, 1.6, 0.7, 0.9, 0.3, 0.5, 0.4, 0.3, 0.0, 0.6, 1.2, 0.6, 1.4),
/*id 18*/('Jonas Mattisseck', 0, 'ALBA Berlin', 'PG', 'mattisseck.jpg', 2.8, 0.9, 0.7, 13.3, 0.6, 0.2, 2.0, 0.7, 0.3, 0.2, 0.4, 0.0, 0.4, 1.7, 0.9, 1.7),
/*id 19*/('Marco Carraretto', 0, 'Montepaschi Siena', 'SG', 'carraretto.jpg', 2.9, 0.8, 0.4, 10.4, 1.1, 0.5, 1.3, 0.5, 0.3, 0.3, 0.3, 0.0, 0.3, 1.2, 0.4, 1.8),
/*id 20*/('Dogus Balbay', 0, 'Anadolu Efes', 'PG', 'balbay.jpg', 1.6, 1.1, 0.9, 9.1, 1.1, 0.5, 0.5, 0.1, 0.2, 0.1, 0.5, 0.1, 0.4, 1.4, 0.5, 1.8),
/*id 21*/('Lorenzo Brown', 7, 'Maccabi Tel Aviv', 'PG', 'brown.jpg', 14.2, 3.5, 6.2, 28.5, 4.8, 2.6, 4.2, 1.6, 3.8, 3.2, 1.2, 0.3, 2.1, 1.8, 4.5, 18.3),
/*id 22*/('Shane Larkin', 0, 'Anadolu Efes', 'PG', 'larkin.jpg', 15.8, 2.9, 5.3, 31.2, 5.5, 2.9, 5.6, 2.2, 3.7, 3.3, 1.5, 0.2, 2.4, 2.1, 4.7, 19.5),
/*id 24*/('Mike James', 2, 'AS Monaco', 'PG', 'james.jpg', 17.3, 3.0, 4.8, 30.2, 6.4, 3.2, 5.8, 1.9, 5.1, 4.3, 0.8, 0.2, 2.9, 1.7, 4.8, 16.7),
/*id 25*/('Walter Tavares', 22, 'Real Madrid', 'C', 'tavares.jpg', 11.2, 8.2, 1.0, 25.8, 5.2, 3.8, 0.1, 0.0, 3.2, 2.4, 0.5, 2.8, 1.5, 2.6, 3.4, 20.9),
/*id 26*/('Sasha Vezenkov', 14, 'Olympiacos', 'PF', 'vezenkov.jpg', 17.6, 7.0, 1.9, 31.5, 7.6, 4.2, 5.5, 2.3, 3.8, 3.2, 1.0, 0.3, 1.8, 2.3, 4.5, 24.2),
/*id 27*/('Facundo Campazzo', 7, 'Real Madrid', 'PG', 'campazzo.jpg', 13.1, 2.2, 6.5, 28.3, 4.5, 2.1, 5.2, 1.7, 3.4, 2.9, 1.8, 0.1, 2.2, 2.4, 4.2, 17.6),
/*id 28*/('Vasilije Micic', 22, 'Anadolu Efes', 'PG', 'micic.jpg', 16.3, 2.8, 5.9, 30.1, 5.9, 2.8, 4.8, 1.8, 5.3, 4.5, 1.0, 0.1, 2.5, 2.2, 5.1, 19.2),
/*id 29*/('Kostas Sloukas', 16, 'Olympiacos', 'PG', 'sloukas.jpg', 12.8, 2.6, 4.8, 28.4, 3.8, 1.7, 3.5, 1.4, 4.9, 4.4, 0.7, 0.1, 1.8, 2.0, 4.5, 16.3),
/*id 30*/('Vincent Poirier', 17, 'Real Madrid', 'C', 'poirier.jpg', 10.5, 6.8, 0.9, 23.5, 5.3, 3.6, 0.2, 0.1, 2.8, 2.1, 0.8, 1.5, 1.4, 3.2, 3.6, 15.8),
/*id 31*/('Mathias Lessort', 14, 'Partizan', 'C', 'lessort.jpg', 13.8, 6.4, 1.1, 24.6, 7.3, 4.9, 0.1, 0.0, 5.2, 3.8, 0.9, 0.8, 1.9, 3.0, 5.5, 18.2),
/*id 32*/('Dzanan Musa', 8, 'Real Madrid', 'SF', 'musa.jpg', 15.1, 3.2, 2.6, 26.9, 5.8, 3.1, 4.5, 1.8, 3.5, 2.7, 0.9, 0.3, 1.7, 2.1, 3.9, 17.5),
/*id 33*/('Nicolo Melli', 4, 'EA7 Milano', 'PF', 'melli.jpg', 9.8, 5.9, 2.2, 26.8, 3.5, 1.9, 2.3, 0.9, 2.1, 1.7, 1.2, 0.8, 1.3, 2.7, 2.5, 15.4),
/*id 34*/('Kevin Punter', 0, 'Partizan', 'SG', 'punter.jpg', 14.7, 2.0, 2.3, 28.9, 5.4, 2.7, 4.6, 1.8, 4.2, 3.6, 0.7, 0.2, 1.6, 1.9, 3.8, 15.2),
/*id 35*/('Will Clyburn', 21, 'Anadolu Efes', 'SF', 'clyburn.jpg', 15.0, 4.3, 1.8, 27.6, 6.0, 3.0, 4.8, 1.7, 4.0, 3.3, 0.8, 0.4, 1.9, 2.2, 4.1, 16.8),

-- More Euroleague Players (Batch 1)
/*id 36*/('Nick Calathes', 33, 'FC Barcelona', 'PG', 'calathes.jpg', 7.3, 3.2, 6.8, 26.4, 2.8, 1.2, 2.1, 0.8, 2.5, 2.1, 1.4, 0.2, 2.2, 2.4, 3.2, 11.6),
/*id 37*/('Nigel Hayes-Davis', 10, 'Fenerbahce', 'SF', 'hayes.jpg', 12.5, 4.5, 1.2, 27.1, 4.6, 2.4, 3.8, 1.5, 3.0, 2.5, 0.8, 0.3, 1.4, 1.9, 3.5, 15.2),
/*id 38*/('Scottie Wilbekin', 1, 'Fenerbahce', 'PG', 'wilbekin.jpg', 13.4, 2.1, 3.3, 27.5, 2.8, 1.1, 5.7, 2.2, 2.7, 2.4, 1.0, 0.1, 1.7, 1.7, 3.9, 15.1),
/*id 39*/('Guerschon Yabusele', 18, 'Real Madrid', 'PF', 'yabusele.jpg', 10.8, 4.6, 0.9, 24.5, 4.5, 2.5, 2.8, 1.1, 2.3, 1.8, 0.7, 0.4, 1.3, 2.3, 3.1, 13.2),
/*id 40*/('Elijah Bryant', 0, 'Anadolu Efes', 'SG', 'bryant.jpg', 12.0, 3.1, 2.1, 26.1, 4.4, 2.3, 3.4, 1.3, 3.0, 2.5, 0.9, 0.2, 1.5, 2.0, 3.7, 14.1),
/*id 41*/('Shaquielle McKissic', 11, 'Olympiacos', 'SF', 'mckissic.jpg', 11.3, 3.0, 1.5, 25.3, 4.2, 2.2, 3.3, 1.2, 3.1, 2.6, 1.1, 0.3, 1.6, 2.1, 3.4, 13.5),
/*id 42*/('Tornike Shengelia', 7, 'Virtus Bologna', 'PF', 'shengelia.jpg', 14.2, 6.1, 2.8, 27.3, 7.2, 4.1, 1.8, 0.6, 4.4, 3.8, 1.0, 0.3, 2.3, 2.7, 5.4, 18.1),
/*id 43*/('Wade Baldwin IV', 4, 'Maccabi Tel Aviv', 'PG', 'baldwin.jpg', 15.5, 3.3, 3.5, 28.8, 5.8, 3.0, 4.3, 1.5, 5.0, 4.2, 1.1, 0.3, 2.5, 2.1, 4.9, 16.4),
/*id 44*/('Johannes Voigtmann', 7, 'Olimpia Milano', 'C', 'voigtmann.jpg', 8.1, 4.7, 2.1, 22.5, 3.2, 1.7, 2.8, 1.1, 1.2, 0.9, 0.6, 0.3, 1.1, 2.0, 2.2, 11.4),
/*id 45*/('Daniel Hackett', 23, 'Virtus Bologna', 'PG', 'hackett.jpg', 9.2, 2.9, 4.1, 25.3, 3.1, 1.5, 1.9, 0.7, 3.0, 2.6, 1.3, 0.1, 1.8, 2.6, 3.5, 12.3),
/*id 46*/('Isaiah Canaan', 0, 'Olympiacos', 'PG', 'canaan.jpg', 10.7, 1.8, 2.2, 23.5, 1.9, 0.8, 5.5, 2.1, 1.7, 1.5, 0.8, 0.1, 1.3, 1.8, 2.5, 10.1),
/*id 47*/('Clyburn Josh', 9, 'Bayern Munich', 'SF', 'josh_clyburn.jpg', 11.3, 5.2, 1.7, 25.8, 5.5, 3.0, 2.5, 0.9, 2.5, 2.1, 0.9, 0.4, 1.7, 2.2, 3.8, 15.5),
/*id 48*/('Tarik Black', 28, 'Zenit', 'C', 'black.jpg', 8.4, 5.7, 0.5, 19.6, 4.3, 2.8, 0.0, 0.0, 2.3, 1.8, 0.6, 1.1, 1.2, 2.8, 3.2, 12.1),
/*id 49*/('Darrun Hilliard', 31, 'Bayern Munich', 'SG', 'hilliard.jpg', 13.2, 2.5, 1.7, 26.3, 4.5, 2.2, 4.2, 1.6, 2.7, 2.3, 0.8, 0.2, 1.5, 1.8, 3.1, 13.7),
/*id 50*/('Kostas Papanikolaou', 16, 'Olympiacos', 'SF', 'papanikolaou.jpg', 7.5, 3.8, 2.1, 25.4, 2.4, 1.2, 2.6, 1.0, 1.1, 0.9, 1.2, 0.6, 1.0, 2.5, 2.0, 11.2),
/*id 51*/('Rodney McGruder', 5, 'Zalgiris Kaunas', 'SG', 'mcgruder.jpg', 11.8, 3.5, 1.4, 26.2, 4.1, 2.2, 3.7, 1.4, 2.9, 2.4, 0.7, 0.1, 1.2, 1.9, 3.2, 13.8),
/*id 52*/('Pierria Henry', 1, 'Baskonia', 'PG', 'henry.jpg', 9.3, 3.1, 6.3, 27.5, 3.2, 1.5, 1.8, 0.6, 3.8, 3.3, 1.9, 0.2, 2.1, 2.4, 4.2, 15.1),
/*id 53*/('Cory Higgins', 22, 'FC Barcelona', 'SG', 'higgins.jpg', 10.9, 2.3, 1.7, 24.6, 3.8, 2.0, 2.8, 1.1, 2.3, 2.0, 0.7, 0.1, 1.4, 1.5, 3.2, 12.1),
/*id 54*/('Oscar da Silva', 42, 'FC Barcelona', 'PF', 'dasilva.jpg', 8.7, 4.6, 1.2, 22.8, 4.5, 2.6, 0.8, 0.3, 2.3, 1.8, 0.8, 0.7, 0.9, 2.0, 2.9, 13.5),
/*id 55*/('Jordan Loyd', 20, 'Red Star', 'SG', 'loyd.jpg', 14.8, 2.6, 2.9, 29.1, 5.1, 2.6, 4.8, 1.9, 4.2, 3.5, 0.9, 0.1, 2.0, 1.8, 4.5, 15.6),
/*id 56*/('Shabazz Napier', 13, 'Red Star', 'PG', 'napier.jpg', 15.1, 2.7, 4.8, 28.5, 4.9, 2.4, 4.7, 1.8, 4.0, 3.4, 1.2, 0.1, 2.5, 1.9, 4.1, 15.5),
/*id 57*/('Carsen Edwards', 4, 'Baskonia', 'PG', 'edwards.jpg', 14.5, 2.2, 2.3, 26.7, 4.7, 2.2, 5.0, 2.0, 2.5, 2.2, 0.8, 0.0, 1.9, 1.7, 3.0, 14.2),
/*id 58*/('Paris Lee', 1, 'Monaco', 'PG', 'lee.jpg', 9.7, 2.0, 4.3, 25.1, 2.8, 1.3, 3.8, 1.5, 1.6, 1.4, 1.5, 0.1, 1.5, 2.0, 2.8, 12.6),
/*id 59*/('Chris Jones', 2, 'Partizan', 'PG', 'jones.jpg', 10.5, 2.8, 4.5, 26.8, 3.6, 1.8, 2.9, 1.1, 2.9, 2.5, 1.4, 0.1, 1.8, 2.1, 3.5, 13.9),
/*id 60*/('Johannes Thiemann', 32, 'Alba Berlin', 'PF', 'thiemann.jpg', 11.2, 5.5, 1.3, 24.3, 6.2, 3.8, 0.8, 0.3, 3.0, 2.4, 0.8, 0.5, 1.5, 2.6, 3.8, 15.4),
/*id 61*/('Dante Exum', 11, 'Partizan', 'SG', 'exum.jpg', 12.7, 3.2, 2.9, 26.5, 4.5, 2.3, 3.6, 1.4, 3.0, 2.5, 1.0, 0.2, 1.7, 2.0, 3.8, 15.0),
/*id 62*/('Luke Sikma', 43, 'Olympiacos', 'PF', 'sikma.jpg', 7.2, 4.8, 3.2, 24.6, 3.8, 2.0, 1.0, 0.4, 1.6, 1.2, 0.9, 0.4, 1.2, 2.1, 2.4, 12.5),
/*id 63*/('Rudy Fernandez', 5, 'Real Madrid', 'SF', 'fernandez.jpg', 6.8, 2.1, 1.6, 18.3, 1.6, 0.8, 3.5, 1.4, 0.5, 0.4, 0.9, 0.3, 0.8, 1.8, 1.3, 8.7),
/*id 64*/('Alec Peters', 25, 'Olympiacos', 'PF', 'peters.jpg', 9.5, 4.1, 0.8, 22.5, 3.1, 1.6, 3.5, 1.4, 1.3, 1.1, 0.5, 0.3, 0.9, 1.7, 2.0, 12.2),
/*id 65*/('Jordan Nwora', 13, 'Fenerbahçe', 'SF', 'nwora.jpg', 13.2, 3.8, 1.2, 25.3, 5.0, 2.6, 4.2, 1.6, 2.5, 2.1, 0.7, 0.3, 1.5, 2.2, 2.7, 13.7),


-- More Euroleague Players (Batch 2)
/*id 130*/('Marko Guduric', 23, 'Fenerbahçe', 'SG', 'guduric.jpg', 11.4, 2.8, 2.7, 26.5, 3.6, 1.8, 3.9, 1.5, 3.1, 2.5, 0.8, 0.2, 1.5, 2.0, 3.6, 13.1),
/*id 131*/('Thomas Walkup', 0, 'Olympiacos', 'PG', 'walkup.jpg', 7.8, 2.9, 3.2, 24.7, 3.3, 1.7, 1.3, 0.5, 1.1, 0.9, 1.1, 0.2, 1.1, 2.1, 1.7, 10.5),
/*id 132*/('Rokas Jokubaitis', 31, 'FC Barcelona', 'PG', 'jokubaitis.jpg', 8.1, 1.9, 3.5, 19.8, 3.2, 1.6, 1.3, 0.5, 1.8, 1.6, 0.7, 0.1, 1.4, 1.5, 2.3, 9.3),
/*id 133*/('Elie Okobo', 0, 'AS Monaco', 'PG', 'okobo.jpg', 11.8, 2.3, 3.1, 25.1, 4.1, 2.0, 3.5, 1.3, 2.9, 2.4, 0.8, 0.1, 1.8, 1.8, 3.3, 12.2),
/*id 134*/('Darius Thompson', 1, 'Anadolu Efes', 'SG', 'thompson.jpg', 10.2, 2.8, 3.7, 26.2, 3.5, 1.7, 3.0, 1.1, 2.7, 2.2, 1.0, 0.2, 1.6, 2.2, 3.0, 11.9),
/*id 135*/('Alpha Diallo', 11, 'AS Monaco', 'SF', 'diallo.jpg', 9.5, 4.7, 1.8, 24.8, 4.0, 2.1, 2.0, 0.8, 2.2, 1.8, 1.2, 0.3, 1.4, 2.1, 2.8, 12.9),
/*id 136*/('Donta Hall', 0, 'AS Monaco', 'C', 'hall.jpg', 8.2, 6.1, 0.6, 21.4, 4.3, 2.9, 0.1, 0.0, 2.4, 1.8, 0.7, 1.7, 1.0, 2.6, 3.2, 14.7),
/*id 137*/('Jabari Parker', 2, 'FC Barcelona', 'PF', 'parker.jpg', 12.4, 5.1, 1.3, 24.7, 5.5, 3.1, 2.5, 0.9, 2.9, 2.3, 0.8, 0.4, 1.7, 2.3, 3.5, 14.5),
/*id 138*/('Jan Vesely', 24, 'FC Barcelona', 'C', 'vesely.jpg', 9.5, 4.2, 1.7, 22.5, 4.9, 3.2, 0.0, 0.0, 2.5, 1.9, 1.0, 0.8, 1.3, 2.9, 3.1, 13.6),
/*id 139*/('Alex Abrines', 21, 'FC Barcelona', 'SF', 'abrines.jpg', 7.9, 2.1, 1.1, 19.8, 1.7, 0.8, 4.0, 1.7, 0.8, 0.7, 0.7, 0.2, 0.8, 1.6, 1.2, 8.5),
/*id 140*/('Tomas Satoransky', 13, 'FC Barcelona', 'PG', 'satoransky.jpg', 8.4, 3.5, 4.6, 24.2, 3.6, 1.8, 1.2, 0.4, 2.6, 2.2, 1.0, 0.3, 1.5, 2.3, 3.1, 12.7),
/*id 141*/('Sergio Llull', 23, 'Real Madrid', 'SG', 'llull.jpg', 9.2, 1.7, 2.3, 18.6, 2.3, 1.1, 4.1, 1.7, 1.4, 1.2, 0.5, 0.1, 1.2, 1.2, 2.0, 9.5),
/*id 142*/('Fabien Causeur', 1, 'Real Madrid', 'SG', 'causeur.jpg', 7.8, 2.1, 1.5, 19.3, 3.0, 1.5, 1.6, 0.6, 1.2, 1.0, 0.7, 0.1, 0.9, 1.7, 1.5, 8.2),
/*id 143*/('Gabriel Deck', 14, 'Real Madrid', 'SF', 'deck.jpg', 9.5, 3.8, 1.2, 21.6, 4.5, 2.5, 1.0, 0.3, 2.6, 2.1, 0.9, 0.2, 1.1, 2.0, 2.8, 11.1),
/*id 144*/('Mario Hezonja', 44, 'Real Madrid', 'SF', 'hezonja.jpg', 13.1, 4.6, 1.9, 25.3, 4.8, 2.5, 3.8, 1.5, 2.3, 1.9, 1.2, 0.3, 1.6, 2.3, 2.7, 14.5),
/*id 145*/('Moustapha Fall', 93, 'Olympiacos', 'C', 'fall.jpg', 7.2, 4.5, 1.1, 19.3, 3.8, 2.7, 0.0, 0.0, 1.8, 1.3, 0.4, 1.2, 1.0, 2.5, 2.4, 10.8),
/*id 146*/('Giorgos Papagiannis', 11, 'Fenerbahçe', 'C', 'papagiannis.jpg', 8.3, 5.1, 0.7, 20.1, 4.2, 2.8, 0.0, 0.0, 2.3, 1.7, 0.5, 1.5, 1.2, 2.7, 2.6, 11.4),
/*id 147*/('Filip Petrusev', 10, 'Red Star', 'C', 'petrusev.jpg', 10.8, 4.9, 0.8, 22.4, 5.7, 3.6, 0.7, 0.2, 2.5, 1.9, 0.6, 0.6, 1.3, 2.4, 2.9, 12.5),
/*id 148*/('Joffrey Lauvergne', 77, 'ASVEL', 'C', 'lauvergne.jpg', 9.7, 5.3, 1.0, 21.5, 5.1, 3.3, 0.2, 0.1, 2.6, 2.0, 0.5, 0.3, 1.4, 2.5, 3.0, 11.6),
/*id 149*/('Johnathan Motley', 35, 'Fenerbahçe', 'C', 'motley.jpg', 11.4, 6.2, 1.3, 23.7, 6.5, 4.2, 0.1, 0.0, 3.2, 2.4, 0.7, 0.9, 1.6, 2.8, 3.9, 14.8),
/*id 150*/('Nikola Milutinov', 33, 'Olympiacos', 'C', 'milutinov.jpg', 8.1, 6.7, 0.9, 21.3, 4.3, 2.9, 0.0, 0.0, 2.3, 1.7, 0.6, 0.7, 1.2, 2.6, 3.1, 12.9),
/*id 151*/('Isaiah Taylor', 11, 'Zalgiris Kaunas', 'PG', 'taylor.jpg', 10.2, 2.1, 4.5, 25.5, 3.7, 1.8, 1.5, 0.6, 3.2, 2.8, 1.1, 0.1, 1.9, 2.0, 3.6, 12.3),
/*id 152*/('Matt Thomas', 21, 'Panathinaikos', 'SG', 'thomas.jpg', 8.5, 1.8, 1.1, 20.3, 2.2, 1.1, 3.8, 1.6, 0.9, 0.8, 0.5, 0.0, 0.7, 1.3, 1.4, 9.2),
/*id 153*/('Kendrick Nunn', 12, 'Panathinaikos', 'SG', 'nunn.jpg', 14.1, 2.5, 2.3, 27.5, 5.2, 2.6, 4.3, 1.7, 3.0, 2.5, 0.9, 0.1, 1.8, 1.9, 3.4, 14.5),
/*id 155*/('Juancho Hernangomez', 41, 'Panathinaikos', 'PF', 'hernangomez.jpg', 9.1, 5.3, 1.2, 22.7, 3.7, 1.9, 2.5, 0.9, 1.6, 1.3, 0.6, 0.3, 1.1, 2.1, 2.2, 12.1),
/*id 157*/('Evan Fournier', 10, 'Olympiacos', 'SG', 'fournier.jpg', 11.5, 2.8, 2.1, 26.2, 3.9, 1.9, 3.7, 1.4, 2.5, 2.1, 0.9, 0.2, 1.5, 1.9, 2.9, 12.1),
/*id 158*/('James Nunnally', 21, 'Partizan', 'SF', 'nunnally.jpg', 10.8, 2.5, 1.8, 24.7, 3.6, 1.8, 3.4, 1.3, 2.2, 1.8, 0.7, 0.2, 1.2, 1.8, 2.6, 11.3),

-- More Euroleague Players (Batch 3)
/*id 159*/('Nikola Kalinic', 33, 'FC Barcelona', 'SF', 'kalinic.jpg', 7.5, 3.5, 2.6, 23.1, 2.9, 1.5, 1.8, 0.7, 1.8, 1.5, 1.1, 0.3, 1.2, 2.2, 2.3, 10.1),
/*id 160*/('Edgaras Ulanovas', 92, 'Zalgiris Kaunas', 'SF', 'ulanovas.jpg', 6.8, 3.2, 1.7, 21.5, 2.6, 1.3, 1.6, 0.6, 1.2, 1.0, 0.7, 0.2, 0.9, 1.9, 1.9, 8.5),
/*id 161*/('Jock Landale', 8, 'Partizan', 'C', 'landale.jpg', 10.2, 5.7, 0.9, 22.8, 5.4, 3.5, 0.4, 0.1, 2.9, 2.3, 0.5, 0.6, 1.4, 2.5, 3.2, 13.4),
/*id 162*/('Nemanja Nedovic', 16, 'Red Star', 'SG', 'nedovic.jpg', 11.5, 2.3, 2.5, 24.7, 3.9, 1.9, 3.3, 1.3, 2.8, 2.3, 0.8, 0.1, 1.7, 1.9, 3.1, 12.2),
/*id 163*/('Devin Booker', 31, 'FC Bayern', 'C', 'booker.jpg', 8.9, 5.1, 1.3, 21.6, 4.8, 3.0, 0.5, 0.2, 2.3, 1.8, 0.6, 0.5, 1.3, 2.4, 2.7, 11.5),
/*id 164*/('Zach LeDay', 2, 'Partizan', 'PF', 'leday.jpg', 11.8, 5.5, 1.2, 25.2, 5.6, 3.2, 2.2, 0.8, 3.1, 2.5, 0.8, 0.5, 1.5, 2.6, 3.8, 14.7),
/*id 165*/('Ognjen Dobric', 13, 'Red Star', 'SF', 'dobric.jpg', 8.1, 3.0, 1.5, 22.3, 3.0, 1.5, 2.1, 0.8, 1.5, 1.2, 0.9, 0.2, 1.0, 1.9, 2.0, 9.2),
/*id 166*/('Serge Ibaka', 9, 'Bayern Munich', 'C', 'ibaka.jpg', 11.3, 6.3, 1.0, 24.2, 5.4, 3.2, 1.8, 0.7, 2.8, 2.3, 0.7, 1.2, 1.3, 2.5, 3.2, 15.5),
/*id 167*/('Carlik Jones', 0, 'Bayern Munich', 'PG', 'jones_carlik.jpg', 13.2, 3.5, 5.8, 28.1, 4.8, 2.4, 2.7, 1.0, 3.9, 3.3, 1.4, 0.1, 2.3, 2.2, 4.4, 16.1),
/*id 168*/('Isaia Cordinier', 0, 'Virtus Bologna', 'SG', 'cordinier.jpg', 10.6, 3.8, 2.4, 25.3, 4.3, 2.2, 2.2, 0.8, 2.3, 1.9, 1.2, 0.3, 1.3, 2.1, 2.8, 13.2),
/*id 169*/('Devon Hall', 7, 'Olympiacos', 'SG', 'hall_devon.jpg', 9.5, 2.2, 1.6, 23.7, 3.1, 1.6, 3.0, 1.1, 1.7, 1.4, 0.7, 0.1, 1.1, 1.7, 2.1, 10.1),
/*id 170*/('Nicola Mirotic', 33, 'Armani Milano', 'PF', 'mirotic_milano.jpg', 16.0, 6.2, 1.0, 25.8, 6.0, 3.4, 4.2, 1.6, 4.5, 3.8, 0.8, 0.4, 1.5, 2.3, 4.9, 20.5),
/*id 171*/('Georgios Papagiannis', 34, 'Virtus Bologna', 'C', 'papagiannis_virtus.jpg', 8.0, 4.9, 0.8, 19.5, 4.0, 2.7, 0.0, 0.0, 2.2, 1.6, 0.4, 1.4, 1.1, 2.5, 2.5, 10.8),
/*id 172*/('Marcus Howard', 0, 'Baskonia', 'SG', 'howard.jpg', 12.8, 2.0, 1.8, 24.8, 3.5, 1.7, 5.4, 2.1, 2.1, 1.8, 0.6, 0.0, 1.6, 1.6, 2.5, 12.1),
/*id 173*/('Chima Moneke', 11, 'Baskonia', 'PF', 'moneke.jpg', 11.5, 5.8, 1.6, 24.3, 5.5, 3.2, 1.9, 0.7, 3.0, 2.4, 1.1, 0.5, 1.7, 2.7, 3.7, 14.2),
/*id 174*/('Usman Garuba', 16, 'Real Madrid', 'PF', 'garuba.jpg', 7.2, 6.0, 1.2, 19.8, 3.5, 2.0, 0.6, 0.2, 2.4, 1.9, 0.9, 1.0, 1.0, 2.3, 2.8, 12.3),
/*id 175*/('Quincy Acy', 4, 'Paris Basketball', 'PF', 'acy.jpg', 8.5, 4.2, 0.8, 21.1, 3.7, 2.1, 1.6, 0.6, 2.0, 1.6, 0.7, 0.4, 1.2, 2.2, 2.4, 10.2),
/*id 176*/('TJ Shorts', 10, 'Paris Basketball', 'PG', 'shorts.jpg', 15.2, 2.8, 5.5, 29.5, 6.1, 3.0, 1.9, 0.7, 4.3, 3.7, 1.3, 0.1, 2.4, 2.0, 4.8, 17.3),
/*id 177*/('Nadir Hifi', 9, 'Paris Basketball', 'PG', 'hifi.jpg', 12.3, 2.1, 2.4, 25.6, 4.2, 2.1, 4.4, 1.7, 2.5, 2.1, 0.8, 0.1, 1.8, 1.8, 2.8, 12.7),
/*id 178*/('Justin Anderson', 1, 'Zalgiris Kaunas', 'SF', 'anderson.jpg', 11.1, 3.6, 1.5, 24.2, 4.2, 2.2, 3.0, 1.1, 2.7, 2.2, 0.8, 0.3, 1.4, 2.1, 3.0, 12.4),
/*id 179*/('Bryant Dunston', 42, 'Anadolu Efes', 'C', 'dunston.jpg', 6.4, 4.2, 0.8, 17.5, 3.3, 2.2, 0.0, 0.0, 2.1, 1.5, 0.5, 0.9, 0.9, 2.3, 2.5, 9.7),
/*id 180*/('Zoran Dragic', 30, 'Zalgiris Kaunas', 'SG', 'dragic.jpg', 7.8, 2.3, 1.6, 20.7, 3.0, 1.5, 1.9, 0.7, 1.6, 1.3, 0.8, 0.1, 1.1, 1.8, 2.0, 8.5),
/*id 181*/('Kevarrius Hayes', 24, 'Zalgiris Kaunas', 'C', 'hayes_k.jpg', 6.5, 4.7, 0.5, 17.9, 3.2, 2.2, 0.0, 0.0, 2.0, 1.4, 0.6, 1.3, 0.8, 2.2, 2.3, 10.3),
/*id 182*/('Keenan Evans', 12, 'Zalgiris Kaunas', 'PG', 'evans.jpg', 11.8, 2.3, 3.7, 26.5, 4.3, 2.1, 2.8, 1.1, 3.2, 2.7, 1.0, 0.1, 1.8, 1.9, 3.5, 13.5),
/*id 184*/('Donatas Motiejunas', 20, 'AS Monaco', 'C', 'motiejunas.jpg', 9.1, 4.5, 1.2, 21.5, 4.6, 3.0, 0.7, 0.2, 2.4, 1.8, 0.6, 0.5, 1.3, 2.3, 2.9, 11.8);

-- Sample data for matches table
INSERT INTO matches (home_team_id, away_team_id, match_date, home_score, away_score, status, venue, mvp_player_id) VALUES
(1, 2, '2023-09-15', 88, 82, 'completed', 'Žalgirio Arena', 1),
(3, 4, '2023-09-18', 75, 79, 'completed', 'Švyturio Arena', 7),
(2, 5, '2023-09-22', 91, 78, 'completed', 'Siemens Arena', 5),
(4, 1, '2023-09-25', 80, 92, 'completed', 'Cido Arena', 3),
(5, 3, '2023-09-28', 83, 87, 'completed', 'Utenos Arena', 6),
(1, 3, '2023-10-02', 86, 74, 'completed', 'Žalgirio Arena', 2),
(2, 4, '2023-10-05', 85, 81, 'completed', 'Siemens Arena', 4),
(3, 1, '2023-10-09', 79, 88, 'completed', 'Švyturio Arena', 1),
(5, 2, '2023-10-12', 76, 84, 'completed', 'Utenos Arena', 5),
(1, 5, '2023-11-15', 94, 77, 'scheduled', 'Žalgirio Arena', NULL),

-- Euroleague matches
(14, 15, '2023-10-05', 78, 86, 'completed', 'Fernando Buesa Arena', NULL),
(16, 17, '2023-10-06', 92, 84, 'completed', 'Palau Blaugrana', NULL),
(18, 19, '2023-10-12', 81, 76, 'completed', 'Peace and Friendship Stadium', NULL),
(20, 21, '2023-10-13', 88, 79, 'completed', 'Sinan Erdem Dome', NULL),
(22, 23, '2023-10-19', 83, 76, 'completed', 'OAKA Arena', NULL),
(24, 25, '2023-10-20', 71, 85, 'completed', 'Astroballe', NULL),
(15, 16, '2023-10-26', 89, 82, 'completed', 'WiZink Center', NULL),
(17, 18, '2023-10-27', 77, 80, 'completed', 'Megasport Arena', NULL),
(19, 20, '2023-11-02', 84, 89, 'completed', 'Ülker Sports Arena', NULL),
(21, 22, '2023-11-03', 91, 87, 'completed', 'Menora Mivtachim Arena', NULL),
(23, 24, '2023-11-09', 79, 68, 'completed', 'Audi Dome', NULL),
(25, 14, '2023-11-10', 82, 76, 'completed', 'Mediolanum Forum', NULL),
(16, 19, '2023-11-16', 85, 77, 'completed', 'Palau Blaugrana', NULL),
(17, 20, '2023-11-17', 81, 92, 'completed', 'Megasport Arena', NULL),
(15, 18, '2023-11-23', 79, 85, 'completed', 'WiZink Center', NULL),
(22, 25, '2023-11-24', 88, 82, 'completed', 'OAKA Arena', NULL),
(14, 17, '2023-12-07', 72, 68, 'completed', 'Fernando Buesa Arena', NULL),
(21, 15, '2023-12-08', 86, 93, 'completed', 'Menora Mivtachim Arena', NULL),
(19, 16, '2023-12-14', 75, 88, 'completed', 'Ülker Sports Arena', NULL),
(23, 22, '2023-12-15', 82, 91, 'completed', 'Audi Dome', NULL);

-- Sample data for match_player_stats table
INSERT INTO match_player_stats (match_id, player_id, team_id, minutes_played, points, rebounds, assists, steals, blocks, turnovers, fouls, fg2_attempts, fg2_made, fg3_attempts, fg3_made, ft_attempts, ft_made, plus_minus) VALUES
-- Match 1: Žalgiris vs Rytas
(1, 1, 1, 28, 18, 3, 6, 2, 0, 2, 2, 5, 3, 6, 3, 5, 3, 8),
(1, 2, 1, 30, 16, 4, 3, 1, 0, 1, 3, 6, 4, 5, 2, 2, 2, 12),
(1, 3, 1, 24, 10, 8, 1, 1, 1, 1, 3, 4, 3, 2, 1, 2, 1, 6),
(1, 4, 2, 32, 14, 3, 7, 2, 0, 3, 2, 4, 2, 6, 2, 6, 4, -6),
(1, 5, 2, 27, 12, 6, 2, 1, 0, 2, 4, 5, 3, 3, 1, 4, 3, -8),

-- Additional Žalgiris Kaunas players (team_id 1)
(1, 87, 1, 22, 14, 5, 2, 0, 1, 2, 1, 5, 3, 4, 2, 2, 2, 10),
(1, 88, 1, 19, 9, 2, 3, 1, 0, 1, 2, 3, 2, 2, 1, 2, 2, 5),
(1, 89, 1, 16, 8, 4, 0, 0, 0, 0, 3, 4, 3, 0, 0, 2, 2, 4),
(1, 90, 1, 14, 7, 3, 1, 1, 0, 1, 1, 3, 2, 1, 1, 0, 0, 3),
(1, 91, 1, 10, 4, 2, 2, 0, 0, 1, 2, 2, 1, 1, 0, 2, 2, 2),
(1, 92, 1, 7, 2, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1),
(1, 93, 1, 5, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Rytas Vilnius players (team_id 2)
(1, 94, 2, 25, 16, 4, 2, 1, 1, 2, 3, 6, 3, 5, 3, 1, 1, -5),
(1, 95, 2, 20, 10, 5, 1, 0, 1, 1, 2, 5, 3, 1, 0, 4, 4, -4),
(1, 96, 2, 18, 8, 2, 3, 1, 0, 2, 1, 3, 1, 3, 2, 0, 0, -3),
(1, 97, 2, 15, 6, 4, 0, 0, 0, 1, 3, 3, 2, 0, 0, 2, 2, -2),
(1, 98, 2, 13, 5, 2, 2, 0, 0, 1, 1, 2, 1, 1, 1, 0, 0, -1),
(1, 99, 2, 10, 7, 1, 1, 0, 0, 0, 2, 2, 1, 2, 1, 2, 2, 0),
(1, 100, 2, 8, 4, 1, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, -1),
(1, 101, 2, 6, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),

-- Match 2: Neptūnas vs Lietkabelis
(2, 6, 3, 29, 20, 4, 3, 1, 0, 2, 3, 7, 5, 7, 3, 3, 3, -4),
(2, 9, 3, 31, 15, 3, 8, 2, 0, 3, 2, 5, 3, 5, 2, 3, 3, -4),
(2, 7, 4, 30, 18, 3, 7, 3, 0, 1, 2, 6, 4, 4, 2, 4, 4, 4),
(2, 8, 4, 28, 14, 3, 2, 0, 0, 1, 3, 5, 3, 4, 2, 2, 2, 3),

-- Additional Neptūnas players (team_id 3)
(2, 102, 3, 25, 12, 5, 2, 1, 1, 2, 2, 5, 3, 3, 2, 0, 0, -2),
(2, 103, 3, 22, 10, 6, 1, 0, 0, 1, 3, 4, 2, 3, 2, 0, 0, -3),
(2, 104, 3, 19, 8, 3, 0, 1, 1, 0, 2, 3, 2, 2, 1, 1, 1, -1),
(2, 105, 3, 17, 6, 4, 2, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 0),
(2, 106, 3, 14, 4, 2, 1, 1, 0, 2, 3, 1, 0, 3, 1, 1, 1, -2),
(2, 107, 3, 12, 0, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, -3),
(2, 108, 3, 6, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Lietkabelis players (team_id 4)
(2, 109, 4, 24, 15, 6, 2, 1, 1, 2, 2, 6, 4, 2, 1, 4, 4, 5),
(2, 110, 4, 22, 12, 4, 1, 0, 0, 1, 2, 5, 3, 3, 2, 0, 0, 3),
(2, 111, 4, 20, 9, 5, 1, 1, 0, 2, 3, 3, 1, 3, 2, 1, 1, 2),
(2, 112, 4, 16, 7, 3, 0, 0, 2, 0, 2, 3, 2, 0, 0, 3, 3, 1),
(2, 113, 4, 14, 4, 2, 2, 1, 0, 1, 1, 2, 1, 1, 0, 2, 2, 0),
(2, 114, 4, 10, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -1),
(2, 115, 4, 6, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1),


-- Match 3: Rytas vs Juventus
(3, 4, 2, 29, 16, 3, 6, 2, 0, 2, 1, 6, 4, 4, 2, 2, 2, 10),
(3, 5, 2, 26, 18, 7, 3, 1, 1, 1, 2, 7, 5, 3, 2, 2, 2, 13),
(3, 8, 5, 30, 16, 4, 5, 2, 0, 2, 3, 6, 3, 5, 3, 1, 1, -13),
-- Additional Rytas players (team_id 2)
(3, 94, 2, 24, 14, 5, 2, 0, 0, 2, 2, 5, 3, 3, 2, 2, 2, 11),
(3, 95, 2, 22, 12, 3, 4, 1, 0, 1, 3, 4, 2, 3, 2, 2, 2, 9),
(3, 96, 2, 20, 10, 2, 1, 1, 0, 2, 2, 4, 2, 2, 1, 3, 3, 7),
(3, 97, 2, 17, 8, 4, 0, 0, 1, 1, 1, 3, 2, 1, 1, 1, 1, 5),
(3, 98, 2, 14, 7, 1, 2, 1, 0, 0, 2, 3, 2, 1, 1, 0, 0, 4),
(3, 99, 2, 12, 4, 0, 1, 0, 0, 1, 2, 2, 1, 1, 0, 2, 2, 3),
(3, 100, 2, 10, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2),

-- Additional Juventus players (team_id 5)
(3, 116, 5, 29, 14, 6, 3, 1, 0, 1, 2, 5, 3, 4, 2, 2, 2, -10),
(3, 117, 5, 26, 12, 5, 2, 0, 1, 2, 3, 5, 2, 3, 2, 2, 2, -11),
(3, 118, 5, 23, 10, 3, 1, 1, 0, 1, 2, 4, 2, 2, 1, 3, 3, -9),
(3, 119, 5, 19, 9, 4, 0, 0, 0, 2, 1, 3, 2, 1, 1, 2, 2, -7),
(3, 120, 5, 16, 8, 2, 1, 0, 0, 1, 2, 3, 2, 2, 1, 1, 1, -5),
(3, 121, 5, 14, 6, 1, 0, 1, 0, 0, 3, 2, 1, 1, 1, 1, 1, -3),
(3, 122, 5, 10, 3, 0, 1, 0, 0, 1, 2, 1, 0, 2, 1, 0, 0, -2),
(3, 123, 5, 8, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),


-- Match 4: Lietkabelis vs Žalgiris
(4, 7, 4, 28, 12, 3, 8, 2, 0, 3, 2, 4, 2, 5, 2, 2, 2, -12),
(4, 10, 4, 25, 15, 4, 3, 1, 1, 2, 3, 6, 3, 4, 3, 0, 0, -10),
(4, 1, 1, 26, 14, 2, 5, 1, 0, 1, 1, 5, 3, 4, 2, 2, 2, 9),
(4, 2, 1, 29, 20, 5, 4, 2, 0, 2, 2, 7, 5, 5, 3, 1, 1, 14),
(4, 3, 1, 22, 8, 9, 1, 0, 2, 0, 4, 3, 2, 1, 0, 4, 4, 10),-- Additional Lietkabelis players (team_id 4)
(4, 109, 4, 26, 14, 5, 2, 0, 0, 2, 2, 5, 3, 3, 2, 2, 2, -9),
(4, 110, 4, 23, 11, 3, 1, 1, 0, 1, 3, 4, 2, 3, 2, 1, 1, -8),
(4, 111, 4, 20, 9, 2, 0, 0, 1, 2, 2, 4, 2, 1, 1, 2, 2, -7),
(4, 112, 4, 18, 7, 6, 1, 0, 0, 1, 1, 3, 2, 1, 1, 0, 0, -5),
(4, 113, 4, 14, 5, 2, 1, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, -3),
(4, 114, 4, 10, 2, 1, 0, 1, 0, 1, 2, 1, 1, 0, 0, 0, 0, -2),
(4, 115, 4, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Žalgiris players (team_id 1)
(4, 87, 1, 24, 12, 4, 3, 0, 0, 2, 2, 4, 2, 4, 2, 2, 2, 8),
(4, 88, 1, 21, 10, 5, 2, 1, 0, 1, 3, 4, 2, 2, 1, 3, 3, 7),
(4, 89, 1, 19, 8, 3, 1, 1, 1, 0, 2, 3, 2, 1, 1, 1, 1, 6),
(4, 90, 1, 16, 7, 2, 0, 0, 0, 1, 1, 3, 2, 1, 1, 0, 0, 5),
(4, 91, 1, 14, 6, 4, 1, 0, 0, 0, 2, 2, 1, 2, 1, 0, 0, 4),
(4, 92, 1, 11, 5, 1, 0, 0, 1, 1, 3, 2, 1, 1, 1, 0, 0, 3),
(4, 93, 1, 8, 2, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 2),

-- Euroleague Match 11: Baskonia vs Real Madrid
(11, 11, 14, 29, 8, 2, 5, 1, 0, 3, 2, 3, 1, 4, 2, 2, 2, -8),
(11, 13, 15, 32, 18, 7, 2, 1, 0, 1, 2, 7, 4, 6, 3, 1, 1, 8),
(11, 15, 15, 29, 12, 9, 0, 0, 3, 2, 3, 6, 5, 0, 0, 2, 2, 6),
(11, 17, 15, 33, 15, 3, 6, 2, 0, 2, 2, 5, 2, 5, 3, 2, 2, 7),
(11, 19, 15, 25, 10, 7, 1, 1, 1, 1, 3, 5, 4, 0, 0, 2, 2, 5),
(11, 21, 15, 26, 12, 2, 4, 0, 0, 1, 1, 4, 2, 3, 2, 2, 2, 9),
-- Additional Baskonia players (team_id 14)
(11, 124, 14, 26, 14, 4, 3, 1, 0, 2, 2, 6, 3, 2, 1, 5, 5, -6),
(11, 125, 14, 23, 12, 6, 2, 0, 1, 1, 3, 5, 3, 3, 2, 0, 0, -5),
(11, 126, 14, 20, 10, 3, 1, 1, 0, 2, 2, 4, 2, 3, 2, 0, 0, -4),
(11, 127, 14, 18, 8, 2, 0, 0, 0, 1, 1, 3, 2, 1, 1, 1, 1, -3),
(11, 128, 14, 16, 5, 4, 1, 0, 1, 0, 2, 2, 1, 1, 1, 0, 0, -2),
(11, 129, 14, 12, 3, 1, 0, 0, 0, 1, 3, 1, 0, 2, 1, 0, 0, -1),
(11, 130, 14, 8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),

-- Additional Real Madrid players (team_id 15)
(11, 131, 15, 24, 9, 4, 3, 0, 0, 1, 2, 3, 2, 2, 1, 2, 2, 4),
(11, 132, 15, 20, 6, 3, 2, 1, 0, 0, 1, 2, 1, 2, 1, 0, 0, 3),
(11, 133, 15, 17, 4, 5, 1, 0, 0, 1, 2, 1, 0, 2, 1, 1, 1, 2),
(11, 134, 15, 14, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1),

-- Euroleague Match 12: Barcelona vs CSKA Moscow
(12, 13, 16, 34, 20, 8, 2, 0, 1, 2, 3, 8, 5, 5, 3, 1, 1, 8),
(12, 17, 17, 32, 16, 3, 8, 2, 0, 3, 2, 5, 2, 6, 3, 3, 3, -8),
(12, 18, 17, 30, 12, 2, 6, 1, 0, 2, 3, 3, 1, 4, 2, 4, 4, -4),
(12, 24, 16, 27, 10, 6, 3, 1, 1, 1, 2, 4, 2, 3, 1, 3, 3, 5),
(12, 28, 16, 25, 15, 4, 2, 0, 0, 2, 2, 6, 3, 4, 3, 0, 0, 6),

-- Additional Barcelona players (team_id 16)
(12, 135, 16, 24, 12, 3, 5, 1, 0, 1, 2, 5, 3, 2, 1, 3, 3, 7),
(12, 136, 16, 22, 10, 5, 2, 0, 0, 1, 3, 4, 2, 3, 2, 0, 0, 5),
(12, 137, 16, 19, 8, 2, 1, 2, 0, 2, 2, 3, 1, 3, 2, 0, 0, 4),
(12, 138, 16, 16, 7, 4, 2, 1, 1, 1, 1, 3, 2, 1, 1, 0, 0, 3),
(12, 139, 16, 14, 5, 1, 0, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, 2),
(12, 140, 16, 10, 3, 0, 1, 0, 0, 1, 3, 1, 0, 2, 1, 0, 0, 1),
(12, 141, 16, 9, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),

-- Additional CSKA Moscow players (team_id 17)
(12, 142, 17, 26, 14, 3, 2, 0, 0, 2, 2, 6, 3, 2, 1, 5, 4, -7),
(12, 143, 17, 23, 12, 6, 1, 1, 1, 1, 3, 5, 3, 2, 1, 3, 3, -6),
(12, 144, 17, 21, 10, 5, 0, 0, 0, 2, 2, 4, 2, 3, 2, 0, 0, -5),
(12, 145, 17, 18, 8, 2, 3, 1, 0, 1, 1, 3, 2, 1, 1, 1, 1, -3),
(12, 146, 17, 15, 5, 3, 1, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, -2),
(12, 147, 17, 12, 3, 0, 0, 0, 0, 1, 3, 1, 0, 2, 1, 0, 0, -1),
(12, 148, 17, 8, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),

-- Euroleague Match 13: Olympiacos vs Fenerbahçe
(13, 16, 18, 33, 19, 8, 2, 1, 0, 2, 2, 7, 4, 6, 3, 2, 2, 5),
(13, 18, 19, 30, 14, 3, 5, 0, 0, 3, 3, 5, 2, 5, 3, 1, 1, -5),
(13, 20, 19, 28, 11, 2, 5, 2, 0, 2, 2, 3, 1, 5, 3, 0, 0, -2),
(13, 23, 18, 31, 12, 3, 4, 1, 0, 1, 2, 4, 2, 4, 2, 2, 2, 4),
(13, 25, 19, 27, 8, 2, 3, 0, 0, 1, 3, 3, 2, 2, 1, 1, 1, -3),

-- Additional Olympiacos players (team_id 18)
(13, 149, 18, 29, 15, 6, 1, 0, 1, 2, 2, 6, 3, 4, 3, 0, 0, 6),
(13, 150, 18, 25, 12, 3, 0, 0, 0, 1, 3, 5, 3, 2, 1, 3, 3, 5),
(13, 151, 18, 21, 9, 5, 2, 1, 0, 0, 2, 3, 1, 4, 2, 1, 1, 3),
(13, 152, 18, 17, 6, 2, 0, 0, 1, 1, 1, 3, 2, 0, 0, 2, 2, 2),
(13, 153, 18, 15, 5, 4, 1, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, 1),
(13, 154, 18, 12, 3, 0, 0, 1, 0, 1, 3, 1, 0, 2, 1, 0, 0, 0),
(13, 155, 18, 7, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Fenerbahçe players (team_id 19)
(13, 156, 19, 26, 13, 4, 2, 1, 0, 1, 2, 5, 3, 3, 2, 1, 1, -4),
(13, 157, 19, 23, 12, 5, 1, 0, 1, 2, 3, 5, 3, 2, 1, 3, 3, -3),
(13, 158, 19, 20, 10, 2, 0, 0, 0, 1, 2, 4, 2, 3, 2, 0, 0, -2),
(13, 159, 19, 18, 8, 6, 1, 1, 0, 0, 1, 3, 2, 1, 1, 1, 1, -1),
(13, 160, 19, 15, 4, 2, 0, 0, 0, 1, 2, 2, 1, 1, 0, 2, 2, 0),
(13, 161, 19, 9, 2, 0, 1, 0, 0, 0, 3, 1, 1, 0, 0, 0, 0, 1),
(13, 162, 19, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),

-- Euroleague Match 14: Anadolu Efes vs Maccabi Tel Aviv
(14, 12, 20, 34, 18, 3, 6, 2, 0, 3, 2, 6, 3, 6, 3, 3, 3, 9),
(14, 18, 20, 31, 15, 2, 7, 1, 0, 2, 3, 5, 2, 6, 3, 2, 2, 6),
(14, 20, 20, 28, 12, 1, 4, 0, 0, 1, 2, 4, 2, 4, 2, 2, 2, 8),
(14, 11, 21, 32, 14, 4, 7, 1, 0, 2, 2, 4, 2, 5, 2, 4, 4, -9),
(14, 29, 21, 30, 16, 2, 3, 0, 0, 2, 3, 6, 3, 5, 3, 1, 1, -6),

-- Additional Anadolu Efes players (team_id 20)
(14, 163, 20, 26, 14, 6, 2, 0, 1, 1, 2, 6, 3, 3, 2, 2, 2, 7),
(14, 164, 20, 22, 10, 3, 1, 1, 0, 2, 3, 4, 2, 3, 2, 0, 0, 5),
(14, 165, 20, 19, 9, 5, 0, 0, 0, 1, 2, 3, 1, 4, 2, 1, 1, 4),
(14, 166, 20, 16, 7, 2, 1, 0, 1, 0, 1, 3, 2, 1, 1, 0, 0, 3),
(14, 167, 20, 14, 5, 4, 0, 1, 0, 1, 2, 2, 1, 1, 1, 0, 0, 2),
(14, 168, 20, 10, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1),

-- Additional Maccabi Tel Aviv players (team_id 21)
(14, 169, 21, 28, 13, 5, 2, 1, 0, 1, 2, 5, 3, 3, 2, 1, 1, -8),
(14, 170, 21, 24, 12, 3, 1, 0, 1, 2, 3, 4, 2, 4, 2, 2, 2, -7),
(14, 171, 21, 21, 10, 4, 0, 0, 0, 1, 2, 4, 2, 3, 2, 0, 0, -5),
(14, 172, 21, 18, 8, 3, 1, 1, 0, 0, 1, 3, 2, 1, 1, 1, 1, -3),
(14, 173, 21, 15, 5, 2, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, -2),
(14, 174, 21, 11, 1, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 1, 1, -1),
(14, 175, 21, 6, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0),

-- Euroleague Match 15: Panathinaikos vs Bayern Munich
(15, 23, 22, 29, 13, 2, 4, 1, 0, 2, 2, 4, 2, 4, 2, 3, 3, 7),
(15, 25, 22, 28, 10, 3, 2, 0, 0, 1, 3, 4, 2, 2, 1, 3, 3, 5),
(15, 28, 22, 26, 14, 5, 1, 1, 0, 2, 2, 5, 3, 3, 2, 2, 2, 6),
(15, 14, 23, 30, 12, 4, 1, 0, 1, 1, 3, 5, 3, 2, 1, 3, 3, -6),
(15, 17, 23, 27, 9, 2, 6, 2, 0, 2, 2, 2, 1, 3, 1, 4, 4, -7),

-- Additional Panathinaikos players (team_id 22)
(15, 176, 22, 25, 16, 6, 2, 0, 1, 1, 2, 6, 3, 5, 3, 1, 1, 8),
(15, 177, 22, 22, 12, 4, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 4),
(15, 178, 22, 19, 8, 3, 0, 0, 0, 1, 2, 3, 2, 1, 1, 1, 1, 3),
(15, 179, 22, 16, 6, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, 2),
(15, 180, 22, 14, 4, 1, 0, 1, 1, 1, 2, 2, 1, 1, 0, 2, 2, 1),
(15, 181, 22, 11, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),

-- Additional Bayern Munich players (team_id 23)
(15, 182, 23, 26, 16, 5, 2, 1, 0, 1, 2, 6, 3, 4, 3, 1, 1, -5),
(15, 183, 23, 24, 14, 3, 1, 0, 0, 2, 3, 5, 3, 3, 2, 2, 2, -4),
(15, 184, 23, 21, 12, 6, 0, 1, 1, 1, 2, 5, 3, 2, 1, 3, 3, -3),
(15, 152, 23, 19, 8, 2, 3, 0, 0, 0, 1, 3, 2, 1, 1, 1, 1, -2),
(15, 153, 23, 16, 5, 4, 1, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, -1),
(15, 154, 23, 12, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
(15, 155, 23, 5, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0),

-- Euroleague Match 16: ASVEL vs Olimpia Milano
(16, 19, 24, 31, 8, 2, 4, 1, 0, 2, 3, 3, 1, 3, 2, 0, 0, -14),
(16, 22, 24, 29, 12, 3, 5, 0, 0, 3, 2, 4, 2, 4, 2, 2, 2, -10),
(16, 17, 25, 34, 19, 7, 3, 2, 0, 1, 2, 6, 3, 7, 4, 1, 1, 14),
(16, 23, 25, 30, 14, 4, 2, 1, 1, 2, 3, 5, 3, 3, 2, 2, 2, 12),
(16, 27, 25, 28, 15, 6, 3, 1, 1, 1, 2, 6, 4, 2, 1, 4, 4, 10),

-- Additional ASVEL players (team_id 24)
(16, 156, 24, 28, 15, 5, 3, 1, 0, 2, 2, 6, 3, 4, 3, 0, 0, -12),
(16, 157, 24, 25, 12, 4, 2, 0, 1, 1, 3, 5, 3, 2, 1, 3, 3, -9),
(16, 158, 24, 22, 10, 2, 1, 0, 0, 2, 2, 4, 2, 3, 2, 0, 0, -8),
(16, 159, 24, 19, 8, 6, 0, 1, 0, 1, 1, 3, 2, 1, 1, 1, 1, -6),
(16, 160, 24, 16, 5, 3, 1, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, -5),
(16, 161, 24, 12, 2, 0, 0, 0, 0, 1, 3, 1, 1, 0, 0, 0, 0, -3),
(16, 162, 24, 8, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Olimpia Milano players (team_id 25)
(16, 163, 25, 26, 13, 5, 2, 0, 0, 1, 2, 5, 3, 3, 2, 1, 1, 9),
(16, 164, 25, 23, 10, 4, 1, 1, 0, 2, 3, 4, 2, 2, 1, 3, 3, 8),
(16, 165, 25, 20, 8, 3, 0, 0, 1, 1, 2, 3, 1, 3, 2, 0, 0, 7),
(16, 166, 25, 17, 6, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, 5),
(16, 167, 25, 14, 3, 1, 0, 0, 0, 1, 2, 1, 0, 2, 1, 0, 0, 2),
(16, 168, 25, 8, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1),

-- Euroleague Match 17: Real Madrid vs Barcelona
(17, 15, 15, 32, 14, 10, 0, 0, 4, 1, 3, 7, 5, 0, 0, 4, 4, 7),
(17, 17, 15, 34, 15, 3, 8, 2, 0, 3, 2, 4, 2, 5, 3, 2, 2, 4),
(17, 19, 15, 28, 12, 8, 1, 1, 2, 2, 3, 6, 5, 0, 0, 2, 2, 6),
(17, 13, 16, 33, 18, 7, 1, 0, 0, 1, 2, 7, 4, 4, 3, 1, 1, -7),
(17, 21, 16, 29, 13, 3, 3, 0, 0, 2, 3, 5, 3, 3, 2, 1, 1, -2),

-- Additional Real Madrid players (team_id 15)
(17, 127, 15, 25, 10, 7, 2, 0, 1, 1, 2, 4, 2, 3, 2, 0, 0, 5),
(17, 141, 15, 22, 8, 4, 3, 1, 0, 0, 3, 3, 2, 1, 1, 1, 1, 3),
(17, 142, 15, 19, 7, 2, 1, 0, 0, 1, 2, 3, 2, 1, 1, 0, 0, 2),
(17, 143, 15, 16, 5, 5, 1, 1, 0, 0, 1, 2, 1, 1, 1, 0, 0, 1),
(17, 144, 15, 14, 4, 2, 0, 0, 1, 1, 2, 2, 1, 0, 0, 2, 2, 0),
(17, 103, 15, 10, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, -1),

-- Additional Barcelona players (team_id 16)
(17, 208, 16, 28, 16, 6, 2, 1, 0, 1, 2, 6, 3, 5, 3, 1, 1, -8),
(17, 209, 16, 25, 12, 4, 1, 0, 0, 2, 3, 5, 3, 2, 1, 3, 3, -5),
(17, 210, 16, 21, 10, 3, 0, 0, 1, 1, 2, 4, 2, 3, 2, 0, 0, -4),
(17, 211, 16, 18, 8, 2, 1, 1, 0, 0, 1, 3, 2, 1, 1, 1, 1, -3),
(17, 212, 16, 15, 5, 4, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, -1),
(17, 213, 16, 10, 3, 0, 0, 0, 0, 0, 3, 1, 0, 2, 1, 0, 0, 0),
(17, 214, 16, 6, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1),

-- Euroleague Match 18: CSKA Moscow vs Olympiacos
(18, 15, 17, 28, 9, 2, 6, 1, 0, 3, 2, 3, 1, 3, 2, 1, 1, -5),
(18, 19, 17, 30, 11, 1, 5, 0, 0, 2, 3, 4, 2, 3, 2, 1, 1, -3),
(18, 16, 18, 33, 18, 9, 2, 1, 0, 1, 2, 7, 5, 4, 2, 2, 2, 5),
(18, 23, 18, 31, 13, 2, 5, 1, 0, 2, 2, 4, 2, 5, 3, 0, 0, 4),
(18, 28, 18, 29, 14, 6, 1, 0, 1, 2, 3, 6, 4, 2, 1, 3, 3, 3),

-- Additional CSKA Moscow players (team_id 17)
(18, 169, 17, 26, 13, 4, 2, 0, 0, 1, 2, 5, 3, 3, 2, 1, 1, -4),
(18, 170, 17, 24, 10, 5, 1, 1, 0, 2, 3, 4, 2, 3, 2, 0, 0, -2),
(18, 104, 17, 21, 8, 3, 0, 0, 1, 1, 2, 3, 1, 3, 2, 0, 0, -1),
(18, 105, 17, 18, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),
(18, 106, 17, 15, 5, 4, 0, 1, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(18, 107, 17, 10, 3, 1, 0, 0, 0, 0, 3, 1, 0, 2, 1, 0, 0, 0),
(18, 108, 17, 8, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Olympiacos players (team_id 18)
(18, 222, 18, 27, 12, 5, 3, 0, 0, 1, 2, 5, 3, 2, 1, 2, 2, 2),
(18, 223, 18, 24, 10, 4, 1, 1, 0, 2, 3, 4, 2, 3, 2, 0, 0, 1),
(18, 224, 18, 20, 8, 3, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, 0),
(18, 225, 18, 17, 5, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 0, 0, -1),
(18, 226, 18, 13, 3, 1, 0, 0, 0, 1, 2, 1, 0, 2, 1, 0, 0, -2),
(18, 227, 18, 6, 2, 0, 0, 0, 0, 0, 3, 1, 1, 0, 0, 0, 0, -3),

-- Euroleague Match 19: Fenerbahçe vs Anadolu Efes
(19, 20, 19, 32, 15, 3, 7, 2, 0, 3, 2, 5, 2, 6, 3, 2, 2, -5),
(19, 24, 19, 30, 10, 2, 3, 0, 0, 1, 3, 4, 2, 2, 1, 3, 3, -3),
(19, 12, 20, 34, 20, 3, 6, 2, 0, 2, 2, 7, 4, 6, 3, 3, 3, 5),
(19, 18, 20, 31, 17, 2, 8, 1, 0, 3, 3, 6, 3, 5, 3, 2, 2, 3),
(19, 30, 20, 28, 16, 5, 2, 1, 0, 2, 2, 7, 4, 4, 2, 2, 2, 4),

-- Additional Fenerbahçe players (team_id 19)
(19, 228, 19, 28, 14, 5, 2, 1, 1, 1, 2, 6, 3, 4, 2, 2, 2, -4),
(19, 229, 19, 25, 12, 3, 1, 0, 0, 2, 3, 5, 3, 3, 2, 0, 0, -2),
(19, 230, 19, 22, 9, 6, 0, 1, 0, 1, 2, 4, 2, 2, 1, 2, 2, -1),
(19, 231, 19, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),
(19, 232, 19, 15, 5, 4, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(19, 233, 19, 11, 3, 1, 0, 0, 0, 0, 3, 1, 0, 2, 1, 0, 0, 0),
(19, 234, 19, 8, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Anadolu Efes players (team_id 20)
(19, 235, 20, 26, 14, 4, 3, 1, 0, 2, 2, 5, 3, 4, 2, 2, 2, 2),
(19, 236, 20, 22, 10, 6, 1, 0, 0, 1, 3, 4, 2, 3, 2, 0, 0, 1),
(19, 237, 20, 19, 8, 2, 0, 0, 1, 0, 2, 3, 1, 2, 1, 3, 3, 0),
(19, 238, 20, 16, 6, 3, 0, 1, 0, 1, 1, 3, 2, 0, 0, 2, 2, -1),
(19, 239, 20, 13, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2),
(19, 240, 20, 11, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, -3),

-- Euroleague Match 20: Maccabi Tel Aviv vs Panathinaikos
(20, 11, 21, 33, 19, 4, 8, 2, 0, 3, 2, 6, 3, 6, 3, 4, 4, 4),
(20, 29, 21, 31, 17, 3, 2, 1, 0, 2, 3, 7, 4, 4, 3, 0, 0, 5),
(20, 23, 22, 32, 16, 4, 5, 1, 0, 2, 2, 6, 3, 5, 3, 1, 1, -4),
(20, 28, 22, 30, 14, 7, 2, 0, 0, 1, 3, 6, 3, 4, 2, 2, 2, -3),
(20, 25, 22, 28, 12, 2, 3, 0, 0, 1, 2, 5, 3, 3, 2, 0, 0, -6),

-- Additional Maccabi Tel Aviv players (team_id 21)
(20, 241, 21, 28, 14, 5, 3, 1, 0, 2, 2, 5, 3, 4, 2, 2, 2, 6),
(20, 242, 21, 25, 12, 3, 1, 0, 1, 1, 3, 5, 3, 2, 1, 3, 3, 3),
(20, 243, 21, 22, 10, 6, 0, 0, 0, 2, 2, 4, 2, 3, 2, 0, 0, 2),
(20, 244, 21, 19, 8, 2, 1, 1, 0, 1, 1, 3, 2, 1, 1, 1, 1, 1),
(20, 245, 21, 16, 6, 4, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 0),
(20, 246, 21, 13, 0, 1, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, -1),
(20, 247, 21, 8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -2),

-- Additional Panathinaikos players (team_id 22)
(20, 152, 22, 27, 15, 6, 2, 1, 0, 1, 2, 6, 3, 4, 3, 0, 0, -5),
(20, 153, 22, 24, 13, 3, 1, 0, 0, 2, 3, 5, 3, 3, 2, 1, 1, -2),
(20, 154, 22, 21, 10, 5, 0, 0, 1, 1, 2, 4, 2, 3, 2, 0, 0, -1),
(20, 155, 22, 18, 7, 2, 1, 0, 0, 0, 1, 3, 1, 1, 1, 2, 2, 0),
(20, 156, 22, 14, 5, 3, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(20, 121, 22, 12, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 2),
(20, 122, 22, 8, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 3),

-- Additional Barcelona players (team_id 16)
(17, 51, 16, 28, 16, 6, 2, 1, 0, 1, 2, 6, 3, 5, 3, 1, 1, -8),
(17, 52, 16, 25, 12, 4, 1, 0, 0, 2, 3, 5, 3, 2, 1, 3, 3, -5),
(17, 53, 16, 21, 10, 3, 0, 0, 1, 1, 2, 4, 2, 3, 2, 0, 0, -4),
(17, 54, 16, 18, 8, 2, 1, 1, 0, 0, 1, 3, 2, 1, 1, 1, 1, -3),
(17, 55, 16, 15, 5, 4, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, -1),
(17, 56, 16, 10, 3, 0, 0, 0, 0, 0, 3, 1, 0, 2, 1, 0, 0, 0),
(17, 57, 16, 6, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1),

-- Additional Olympiacos players (team_id 18)
(18, 58, 18, 27, 12, 5, 3, 0, 0, 1, 2, 5, 3, 2, 1, 2, 2, 2),
(18, 59, 18, 24, 10, 4, 1, 1, 0, 2, 3, 4, 2, 3, 2, 0, 0, 1),
(18, 60, 18, 20, 8, 3, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, 0),
(18, 61, 18, 17, 5, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 0, 0, -1),
(18, 62, 18, 13, 3, 1, 0, 0, 0, 1, 2, 1, 0, 2, 1, 0, 0, -2),
(18, 63, 18, 6, 2, 0, 0, 0, 0, 0, 3, 1, 1, 0, 0, 0, 0, -3),

-- Additional Fenerbahçe players (team_id 19)
(19, 64, 19, 28, 14, 5, 2, 1, 1, 1, 2, 6, 3, 4, 2, 2, 2, -4),
(19, 65, 19, 25, 12, 3, 1, 0, 0, 2, 3, 5, 3, 3, 2, 0, 0, -2),
(19, 66, 19, 22, 9, 6, 0, 1, 0, 1, 2, 4, 2, 2, 1, 2, 2, -1),
(19, 67, 19, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),
(19, 68, 19, 15, 5, 4, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(19, 69, 19, 11, 3, 1, 0, 0, 0, 0, 3, 1, 0, 2, 1, 0, 0, 0),
(19, 70, 19, 8, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1),

-- Additional Anadolu Efes players (team_id 20)
(19, 71, 20, 26, 14, 4, 3, 1, 0, 2, 2, 5, 3, 4, 2, 2, 2, 2),
(19, 72, 20, 22, 10, 6, 1, 0, 0, 1, 3, 4, 2, 3, 2, 0, 0, 1),
(19, 73, 20, 19, 8, 2, 0, 0, 1, 0, 2, 3, 1, 2, 1, 3, 3, 0),
(19, 74, 20, 16, 6, 3, 0, 1, 0, 1, 1, 3, 2, 0, 0, 2, 2, -1),
(19, 75, 20, 13, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2),
(19, 76, 20, 11, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, -3),

-- Additional Maccabi Tel Aviv players (team_id 21)
(20, 77, 21, 28, 14, 5, 3, 1, 0, 2, 2, 5, 3, 4, 2, 2, 2, 6),
(20, 78, 21, 25, 12, 3, 1, 0, 1, 1, 3, 5, 3, 2, 1, 3, 3, 3),
(20, 79, 21, 22, 10, 6, 0, 0, 0, 2, 2, 4, 2, 3, 2, 0, 0, 2),
(20, 80, 21, 19, 8, 2, 1, 1, 0, 1, 1, 3, 2, 1, 1, 1, 1, 1),
(20, 81, 21, 16, 6, 4, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 0),
(20, 82, 21, 13, 0, 1, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, -1),
(20, 83, 21, 8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -2),

-- Additional Panathinaikos players (team_id 22)
(20, 84, 22, 27, 15, 6, 2, 1, 0, 1, 2, 6, 3, 4, 3, 0, 0, -5),
(20, 85, 22, 24, 13, 3, 1, 0, 0, 2, 3, 5, 3, 3, 2, 1, 1, -2),
(20, 86, 22, 21, 10, 5, 0, 0, 1, 1, 2, 4, 2, 3, 2, 0, 0, -1),
(20, 87, 22, 18, 7, 2, 1, 0, 0, 0, 1, 3, 1, 1, 1, 2, 2, 0),
(20, 88, 22, 14, 5, 3, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(20, 89, 22, 12, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 2),
(20, 90, 22, 8, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 3);

-- Add more match player stats entries for the remaining Euroleague matches as needed 

-- Create a new table for aggregate player statistics across matches
CREATE TABLE IF NOT EXISTS player_aggregate_stats (
    player_id INT NOT NULL,
    total_games INT NOT NULL DEFAULT 0,
    total_points INT NOT NULL DEFAULT 0,
    total_rebounds INT NOT NULL DEFAULT 0,
    total_assists INT NOT NULL DEFAULT 0,
    total_steals INT NOT NULL DEFAULT 0,
    total_blocks INT NOT NULL DEFAULT 0,
    total_turnovers INT NOT NULL DEFAULT 0,
    total_minutes INT NOT NULL DEFAULT 0,
    match_points TEXT NOT NULL DEFAULT '',  -- Format: "match_id:points,match_id:points,..."
    match_rebounds TEXT NOT NULL DEFAULT '',
    match_assists TEXT NOT NULL DEFAULT '',
    match_steals TEXT NOT NULL DEFAULT '',
    match_blocks TEXT NOT NULL DEFAULT '',
    match_turnovers TEXT NOT NULL DEFAULT '',
    match_minutes TEXT NOT NULL DEFAULT '',
    match_plus_minus TEXT NOT NULL DEFAULT '',
    average_pir FLOAT NOT NULL DEFAULT 0,
    PRIMARY KEY (player_id),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Create a new table for Euroleague Teams
CREATE TABLE IF NOT EXISTS EuroleagueTeams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    points_per_game FLOAT NOT NULL DEFAULT 0,
    points_allowed FLOAT NOT NULL DEFAULT 0,
    rebounds FLOAT NOT NULL DEFAULT 0,
    assists FLOAT NOT NULL DEFAULT 0,
    steals FLOAT NOT NULL DEFAULT 0,
    blocks FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Euroleague teams into the new table
INSERT INTO EuroleagueTeams (name, wins, losses, points_per_game, points_allowed, rebounds, assists, steals, blocks) VALUES
('Baskonia', 14, 8, 83.5, 79.2, 35.0, 17.2, 6.8, 3.2),
('Real Madrid', 18, 4, 88.2, 75.3, 37.5, 19.1, 7.3, 3.9),
('FC Barcelona', 17, 5, 86.9, 76.2, 36.9, 18.7, 7.0, 3.7),
('CSKA Moscow', 16, 6, 85.3, 77.8, 36.2, 18.1, 6.9, 3.5),
('Olympiacos', 15, 7, 84.1, 78.4, 35.8, 17.5, 6.5, 3.3),
('Fenerbahçe', 14, 8, 83.8, 78.9, 35.5, 17.3, 6.4, 3.2),
('Anadolu Efes', 15, 7, 84.5, 78.1, 35.9, 17.7, 6.7, 3.4),
('Maccabi Tel Aviv', 13, 9, 82.7, 79.5, 34.8, 16.9, 6.3, 3.0),
('Panathinaikos', 12, 10, 81.5, 80.3, 34.2, 16.4, 6.1, 2.9),
('Bayern Munich', 11, 11, 80.4, 80.9, 33.8, 16.1, 5.9, 2.8),
('ASVEL', 10, 12, 79.2, 81.8, 33.3, 15.7, 5.7, 2.6),
('Olimpia Milano', 13, 9, 82.1, 79.8, 34.6, 16.7, 6.2, 3.0),
('Partizan', 12, 10, 81.8, 80.1, 34.4, 16.5, 6.0, 2.8),
('AS Monaco', 14, 8, 83.2, 79.4, 35.2, 17.0, 6.5, 3.1),
('Virtus Bologna', 11, 11, 80.7, 80.5, 34.0, 16.3, 5.8, 2.7),
('Valencia', 10, 12, 79.5, 81.2, 33.5, 15.9, 5.6, 2.5),
('ALBA Berlin', 9, 13, 78.6, 82.1, 33.0, 15.5, 5.4, 2.4),
('Žalgiris Kaunas', 8, 14, 77.8, 82.8, 32.7, 15.2, 5.2, 2.3);

-- Create a new table for Euroleague Matches
CREATE TABLE IF NOT EXISTS EuroleagueMatches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    match_date DATE NOT NULL,
    home_score INT,
    away_score INT,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    venue VARCHAR(255),
    mvp_player_id INT,
    match_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (home_team_id) REFERENCES EuroleagueTeams(id) ON DELETE CASCADE,
    FOREIGN KEY (away_team_id) REFERENCES EuroleagueTeams(id) ON DELETE CASCADE
);

-- Insert Euroleague matches into the new table
INSERT INTO EuroleagueMatches (home_team_id, away_team_id, match_date, home_score, away_score, status, venue) VALUES
(1, 3, '2024-01-05', 79, 85, 'completed', 'Fernando Buesa Arena'),
(2, 4, '2024-01-06', 88, 76, 'completed', 'WiZink Center'),
(5, 6, '2024-01-12', 84, 80, 'completed', 'Peace and Friendship Stadium'),
(7, 8, '2024-01-13', 91, 85, 'completed', 'Sinan Erdem Dome'),
(9, 10, '2024-01-19', 87, 79, 'completed', 'OAKA Arena'),
(11, 12, '2024-01-20', 76, 83, 'completed', 'Astroballe'),
(2, 5, '2024-01-26', 92, 87, 'completed', 'WiZink Center'),
(4, 7, '2024-01-27', 80, 86, 'completed', 'Megasport Arena'),
(6, 9, '2024-02-02', 82, 78, 'completed', 'Ülker Sports Arena'),
(8, 11, '2024-02-03', 89, 81, 'completed', 'Menora Mivtachim Arena'),
(3, 10, '2024-02-09', 88, 82, 'completed', 'Palau Blaugrana'),
(5, 12, '2024-02-10', 83, 77, 'completed', 'Peace and Friendship Stadium'),
(1, 8, '2024-02-16', 85, 79, 'completed', 'Fernando Buesa Arena'),
(2, 6, '2024-02-17', 90, 83, 'completed', 'WiZink Center'),
(4, 9, '2024-02-23', 78, 85, 'completed', 'Megasport Arena'),
(7, 10, '2024-02-24', 87, 81, 'completed', 'Sinan Erdem Dome'),
(3, 5, '2024-03-01', 82, 78, 'completed', 'Palau Blaugrana'),
(6, 11, '2024-03-02', 84, 76, 'completed', 'Ülker Sports Arena'),
(1, 4, '2024-03-08', 79, 85, 'completed', 'Fernando Buesa Arena'),
(2, 7, '2024-03-09', 92, 86, 'completed', 'WiZink Center');

-- Create a new table for Euroleague Match Player statistics
CREATE TABLE IF NOT EXISTS EuroleagueMatchPlayers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    minutes_played INT,
    points INT,
    rebounds INT,
    assists INT,
    steals INT,
    blocks INT,
    turnovers INT,
    fouls INT,
    fg2_attempts INT,
    fg2_made INT,
    fg3_attempts INT,
    fg3_made INT,
    ft_attempts INT,
    ft_made INT,
    plus_minus INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES EuroleagueMatches(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES EuroleagueTeams(id) ON DELETE CASCADE,
    UNIQUE KEY (match_id, player_id)
);

-- Insert Euroleague match player statistics into the new table
INSERT INTO EuroleagueMatchPlayers (match_id, player_id, team_id, minutes_played, points, rebounds, assists, steals, blocks, turnovers, fouls, fg2_attempts, fg2_made, fg3_attempts, fg3_made, ft_attempts, ft_made, plus_minus) VALUES
-- Match 1: Baskonia vs Barcelona
(1, 11, 1, 32, 18, 4, 7, 2, 0, 3, 2, 6, 3, 5, 3, 3, 3, -6),
(1, 52, 1, 30, 15, 5, 2, 1, 0, 2, 3, 5, 3, 4, 2, 2, 2, -4),
(1, 13, 3, 33, 22, 6, 4, 1, 1, 2, 2, 8, 5, 6, 3, 3, 3, 8),
(1, 36, 3, 30, 17, 5, 3, 0, 0, 1, 3, 6, 3, 5, 3, 2, 2, 6),
(1, 57, 1, 28, 12, 3, 1, 0, 0, 1, 2, 4, 2, 3, 2, 2, 2, -3),
(1, 124, 1, 25, 10, 4, 3, 1, 0, 2, 3, 4, 2, 2, 1, 3, 3, -2),
(1, 125, 1, 22, 8, 5, 1, 0, 1, 1, 2, 3, 1, 2, 1, 3, 3, -1),
(1, 126, 1, 18, 6, 2, 0, 1, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0),
(1, 127, 1, 15, 4, 1, 1, 0, 0, 1, 2, 1, 0, 2, 1, 1, 1, -1),
(1, 128, 1, 10, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, -2),
(1, 53, 3, 27, 13, 4, 2, 0, 0, 1, 2, 5, 3, 2, 1, 4, 4, 5),
(1, 54, 3, 24, 10, 6, 0, 1, 0, 2, 3, 4, 2, 2, 1, 3, 3, 4),
(1, 68, 3, 21, 8, 2, 1, 0, 1, 1, 2, 3, 1, 2, 1, 3, 3, 3),
(1, 135, 3, 18, 6, 3, 0, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, 2),
(1, 136, 3, 15, 4, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 2, 2, 1),
(1, 137, 3, 12, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),

-- Match 2: Real Madrid vs CSKA Moscow
(2, 23, 2, 31, 20, 7, 3, 1, 0, 2, 2, 7, 4, 6, 3, 3, 3, 10),
(2, 27, 2, 29, 16, 3, 8, 2, 0, 3, 3, 5, 2, 5, 3, 3, 3, 8),
(2, 15, 4, 32, 14, 6, 4, 0, 1, 2, 2, 5, 3, 3, 2, 2, 2, -9),
(2, 19, 4, 29, 12, 5, 2, 1, 0, 1, 3, 4, 2, 3, 2, 2, 2, -7),
(2, 25, 2, 28, 14, 9, 1, 0, 3, 1, 2, 6, 4, 0, 0, 6, 6, 9),
(2, 30, 2, 25, 12, 5, 2, 0, 1, 2, 3, 5, 3, 2, 1, 3, 3, 7),
(2, 32, 2, 22, 10, 3, 1, 1, 0, 1, 2, 4, 2, 2, 1, 3, 3, 6),
(2, 39, 2, 19, 8, 2, 0, 0, 0, 0, 1, 4, 3, 0, 0, 2, 2, 5),
(2, 63, 2, 16, 6, 2, 1, 1, 0, 1, 2, 2, 1, 1, 1, 1, 1, 4),
(2, 94, 2, 10, 2, 1, 0, 0, 0, 0, 3, 1, 1, 0, 0, 0, 0, 2),
(2, 142, 4, 27, 10, 4, 3, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, -6),
(2, 143, 4, 24, 8, 3, 1, 1, 0, 2, 3, 3, 1, 2, 1, 3, 3, -5),
(2, 144, 4, 21, 6, 4, 0, 0, 0, 1, 2, 3, 2, 0, 0, 2, 2, -4),
(2, 145, 4, 18, 4, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 2, 2, -3),
(2, 146, 4, 15, 2, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, -2),
(2, 147, 4, 9, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, -1),
-- Match 3: Olympiacos vs Fenerbahçe
(3, 26, 5, 33, 19, 8, 2, 1, 0, 2, 2, 7, 5, 4, 2, 3, 3, 6),
(3, 29, 5, 30, 15, 4, 6, 1, 0, 1, 3, 5, 2, 5, 3, 2, 2, 4),
(3, 37, 6, 32, 16, 5, 3, 0, 0, 2, 2, 6, 3, 4, 3, 1, 1, -5),
(3, 38, 6, 29, 14, 3, 4, 1, 0, 3, 3, 4, 2, 5, 3, 2, 1, -3),
(3, 41, 5, 28, 13, 4, 2, 1, 0, 1, 2, 5, 3, 2, 1, 4, 4, 5),
(3, 50, 5, 25, 11, 3, 1, 0, 0, 2, 3, 4, 2, 3, 2, 1, 1, 3),
(3, 62, 5, 22, 9, 5, 0, 0, 1, 1, 2, 4, 2, 1, 1, 2, 2, 2),
(3, 64, 5, 18, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),
(3, 67, 5, 15, 5, 1, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 0),
(3, 149, 5, 9, 3, 0, 0, 0, 0, 0, 3, 1, 0, 1, 1, 0, 0, -1),
(3, 65, 6, 28, 12, 5, 2, 0, 0, 1, 2, 5, 3, 2, 1, 3, 3, -4),
(3, 66, 6, 25, 10, 3, 1, 1, 0, 2, 3, 4, 2, 2, 1, 3, 3, -3),
(3, 156, 6, 22, 8, 4, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, -2),
(3, 157, 6, 19, 6, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, -1),
(3, 158, 6, 15, 4, 1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 2, 2, 0),
(3, 159, 6, 10, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1),

-- Match 4: Anadolu Efes vs Maccabi Tel Aviv
(4, 22, 7, 32, 22, 4, 7, 2, 0, 3, 2, 8, 5, 6, 3, 3, 3, 7),
(4, 28, 7, 30, 18, 3, 6, 1, 0, 2, 3, 6, 3, 5, 3, 3, 3, 5),
(4, 21, 8, 33, 17, 5, 9, 2, 0, 2, 2, 6, 3, 5, 3, 2, 2, -4),
(4, 43, 8, 30, 15, 3, 4, 1, 0, 3, 3, 5, 2, 5, 3, 2, 2, -6),
(4, 35, 7, 28, 14, 5, 2, 0, 0, 1, 2, 6, 3, 3, 2, 2, 2, 6),
(4, 40, 7, 25, 12, 3, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 4),
(4, 86, 7, 22, 10, 4, 0, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, 3),
(4, 160, 7, 19, 8, 1, 1, 0, 0, 0, 1, 3, 1, 2, 1, 3, 3, 2),
(4, 161, 7, 16, 5, 2, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(4, 162, 7, 10, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
(4, 163, 8, 27, 13, 4, 2, 0, 0, 1, 2, 5, 3, 2, 1, 4, 4, -3),
(4, 164, 8, 24, 11, 2, 1, 1, 0, 2, 3, 4, 2, 3, 2, 1, 1, -2),
(4, 165, 8, 21, 9, 3, 0, 0, 0, 1, 2, 4, 2, 1, 1, 2, 2, -1),
(4, 166, 8, 18, 7, 1, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),
(4, 167, 8, 15, 5, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(4, 168, 8, 9, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, -2),
-- Match 5: Panathinaikos vs Bayern Munich
(5, 33, 9, 31, 18, 6, 3, 1, 0, 2, 2, 7, 4, 5, 3, 1, 1, 7),
(5, 45, 9, 29, 15, 4, 5, 0, 0, 1, 3, 5, 3, 4, 2, 3, 3, 5),
(5, 14, 10, 32, 16, 5, 2, 0, 0, 2, 2, 6, 3, 4, 3, 1, 1, -6),
(5, 49, 10, 30, 14, 6, 3, 1, 0, 2, 3, 5, 2, 5, 3, 1, 1, -8),
(5, 169, 9, 28, 13, 5, 2, 0, 0, 1, 2, 5, 3, 2, 1, 4, 4, 6),
(5, 170, 9, 25, 11, 3, 1, 1, 0, 2, 3, 4, 2, 3, 2, 1, 1, 4),
(5, 171, 9, 22, 9, 4, 0, 0, 0, 1, 2, 4, 2, 1, 1, 2, 2, 3),
(5, 172, 9, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 2),
(5, 173, 9, 16, 5, 1, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 1),
(5, 174, 9, 10, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
(5, 47, 10, 28, 12, 6, 2, 0, 0, 1, 2, 5, 3, 2, 1, 3, 3, -5),
(5, 60, 10, 25, 10, 4, 1, 0, 0, 2, 3, 4, 2, 2, 1, 3, 3, -4),
(5, 78, 10, 21, 8, 3, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, -3),
(5, 175, 10, 18, 6, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, -2),
(5, 176, 10, 15, 4, 1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 2, 2, -1),
(5, 177, 10, 11, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),

(6, 178, 11, 32, 16, 4, 5, 2, 0, 2, 2, 6, 3, 5, 3, 1, 1, -7),
(6, 179, 11, 30, 14, 6, 2, 1, 0, 3, 3, 5, 2, 4, 2, 4, 4, -5),
(6, 180, 11, 28, 12, 5, 3, 0, 0, 1, 2, 5, 3, 2, 1, 3, 3, -4),
(6, 181, 11, 25, 10, 3, 1, 1, 0, 2, 3, 4, 2, 2, 1, 3, 3, -3),
(6, 17, 12, 33, 20, 7, 4, 1, 0, 2, 2, 7, 4, 6, 3, 3, 3, 8),
(6, 44, 12, 31, 17, 5, 3, 0, 0, 1, 3, 6, 3, 5, 3, 2, 2, 7),
(6, 186, 12, 28, 14, 6, 2, 1, 1, 2, 2, 5, 2, 4, 2, 4, 4, 6),
(6, 187, 12, 25, 12, 4, 1, 0, 0, 1, 3, 5, 3, 2, 1, 3, 3, 5),
(6, 182, 11, 22, 8, 4, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, -2),
(6, 183, 11, 19, 6, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, -1),
(6, 188, 12, 22, 10, 3, 0, 0, 0, 2, 2, 4, 2, 2, 1, 3, 3, 4),
(6, 189, 12, 19, 6, 2, 1, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 3),


(7, 25, 2, 33, 16, 9, 2, 0, 2, 1, 2, 6, 4, 0, 0, 8, 8, 7),
(7, 27, 2, 31, 18, 3, 9, 2, 0, 3, 3, 5, 2, 6, 3, 5, 5, 6),
(7, 32, 2, 29, 15, 5, 2, 1, 0, 2, 2, 6, 3, 4, 2, 3, 3, 5),
(7, 39, 2, 27, 13, 6, 1, 0, 1, 1, 3, 5, 3, 2, 1, 4, 4, 4),
(7, 26, 5, 32, 17, 8, 2, 1, 1, 2, 2, 6, 3, 5, 3, 2, 2, -5),
(7, 29, 5, 30, 15, 4, 7, 1, 0, 3, 3, 5, 2, 5, 3, 2, 2, -4),
(7, 41, 5, 28, 13, 5, 2, 0, 0, 1, 2, 5, 3, 2, 1, 4, 4, -3),
(7, 50, 5, 25, 11, 3, 1, 1, 0, 2, 3, 4, 2, 3, 2, 1, 1, -2),
(7, 63, 2, 24, 11, 3, 0, 1, 0, 2, 2, 4, 2, 3, 2, 1, 1, 3),
(7, 94, 2, 21, 9, 4, 1, 0, 0, 1, 1, 4, 2, 1, 1, 2, 2, 2),
(7, 62, 5, 22, 9, 6, 0, 0, 0, 1, 2, 4, 2, 1, 1, 2, 2, -1),
(7, 64, 5, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 0),

(8, 15, 4, 31, 14, 5, 5, 1, 0, 2, 2, 5, 2, 4, 2, 4, 4, -6),
(8, 19, 4, 29, 12, 6, 3, 0, 0, 1, 3, 5, 3, 2, 1, 3, 3, -5),
(8, 142, 4, 27, 10, 4, 2, 0, 0, 2, 2, 4, 2, 2, 1, 3, 3, -4),
(8, 143, 4, 25, 8, 3, 1, 1, 0, 1, 3, 3, 1, 2, 1, 3, 3, -3),
(8, 22, 7, 33, 20, 4, 6, 2, 0, 2, 2, 7, 4, 6, 3, 3, 3, 6),
(8, 28, 7, 31, 18, 3, 7, 1, 0, 3, 3, 6, 3, 6, 3, 3, 3, 5),
(8, 35, 7, 28, 15, 6, 2, 0, 0, 1, 2, 6, 3, 4, 2, 3, 3, 4),
(8, 40, 7, 25, 12, 5, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 3),
(8, 144, 4, 22, 6, 5, 0, 0, 0, 2, 2, 3, 2, 0, 0, 2, 2, -2),
(8, 145, 4, 19, 5, 2, 1, 0, 0, 1, 1, 2, 1, 1, 1, 0, 0, -1),
(8, 86, 7, 22, 10, 3, 0, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, 2),
(8, 160, 7, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 1),

(9, 37, 6, 32, 18, 5, 3, 1, 0, 2, 2, 7, 4, 4, 2, 4, 4, 4),
(9, 38, 6, 30, 16, 3, 5, 2, 0, 3, 3, 5, 2, 6, 3, 3, 3, 3),
(9, 65, 6, 28, 14, 6, 2, 0, 0, 1, 2, 6, 3, 3, 2, 2, 2, 2),
(9, 66, 6, 25, 12, 4, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 1),
(9, 33, 9, 31, 16, 7, 4, 0, 0, 2, 2, 6, 3, 5, 3, 2, 2, -4),
(9, 45, 9, 29, 14, 5, 5, 1, 0, 3, 3, 5, 2, 5, 3, 2, 2, -3),
(9, 169, 9, 27, 12, 6, 2, 0, 0, 1, 2, 5, 3, 2, 1, 3, 3, -2),
(9, 170, 9, 24, 10, 4, 1, 0, 0, 2, 3, 4, 2, 2, 1, 3, 3, -1),
(9, 156, 6, 22, 10, 3, 0, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, 0),
(9, 157, 6, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, -1),
(9, 171, 9, 21, 8, 3, 0, 0, 0, 1, 2, 3, 1, 2, 1, 3, 3, 0),
(9, 172, 9, 18, 6, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 2, 2, 1),

(10, 21, 8, 33, 19, 4, 8, 2, 0, 2, 2, 7, 4, 5, 3, 2, 2, 8),
(10, 43, 8, 31, 17, 3, 4, 1, 0, 3, 3, 6, 3, 5, 3, 2, 2, 7),
(10, 163, 8, 28, 15, 5, 2, 0, 0, 1, 2, 6, 3, 4, 2, 3, 3, 6),
(10, 164, 8, 25, 13, 4, 1, 1, 0, 2, 3, 5, 3, 2, 1, 4, 4, 5),
(10, 178, 11, 32, 14, 5, 4, 1, 0, 2, 2, 5, 2, 5, 3, 1, 1, -8),
(10, 179, 11, 30, 12, 7, 2, 0, 0, 3, 3, 5, 3, 2, 1, 3, 3, -7),
(10, 180, 11, 27, 10, 4, 3, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, -6),
(10, 181, 11, 24, 8, 3, 1, 1, 0, 2, 3, 3, 1, 2, 1, 3, 3, -5),
(10, 165, 8, 22, 10, 3, 0, 0, 0, 1, 2, 4, 2, 2, 1, 3, 3, 4),
(10, 166, 8, 19, 7, 2, 1, 0, 0, 0, 1, 3, 2, 1, 1, 0, 0, 3),
(10, 182, 11, 21, 7, 5, 0, 0, 0, 1, 2, 3, 1, 1, 1, 2, 2, -4),
(10, 183, 11, 18, 5, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 0, 0, -3),

(11, 13, 3, 33, 21, 7, 4, 1, 1, 1, 2, 8, 5, 5, 3, 2, 2, 8),
(11, 36, 3, 31, 18, 4, 3, 0, 0, 2, 3, 6, 3, 6, 3, 3, 3, 6),
(11, 53, 3, 28, 14, 5, 2, 1, 0, 1, 2, 6, 3, 3, 2, 2, 2, 5),
(11, 54, 3, 25, 12, 7, 1, 0, 0, 2, 3, 5, 3, 2, 1, 3, 3, 4),
(11, 14, 10, 31, 17, 5, 3, 0, 0, 2, 2, 7, 4, 4, 2, 3, 3, -7),
(11, 49, 10, 29, 15, 6, 2, 1, 0, 3, 3, 5, 2, 5, 3, 2, 2, -6),
(11, 47, 10, 27, 13, 4, 1, 0, 0, 1, 2, 5, 3, 2, 1, 4, 4, -5),
(11, 60, 10, 24, 11, 3, 0, 1, 0, 2, 3, 4, 2, 3, 2, 1, 1, -4),

(12, 26, 5, 32, 20, 8, 3, 1, 0, 2, 2, 7, 4, 6, 3, 3, 3, 8),
(12, 29, 5, 30, 17, 5, 7, 1, 0, 3, 3, 6, 3, 5, 3, 2, 2, 6),
(12, 41, 5, 28, 15, 6, 2, 0, 0, 1, 2, 6, 3, 4, 2, 3, 3, 5),
(12, 50, 5, 25, 12, 4, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 4),
(12, 17, 12, 31, 18, 7, 4, 0, 0, 2, 2, 6, 3, 6, 3, 3, 3, -7),
(12, 44, 12, 29, 15, 4, 3, 1, 0, 3, 3, 5, 2, 5, 3, 2, 2, -6),
(12, 186, 12, 27, 13, 5, 2, 0, 1, 1, 2, 5, 3, 2, 1, 4, 4, -5),
(12, 187, 12, 24, 11, 3, 1, 0, 0, 2, 3, 4, 2, 3, 2, 1, 1, -4),

(13, 11, 1, 33, 19, 4, 8, 2, 0, 3, 2, 7, 4, 5, 3, 2, 2, 8),
(13, 52, 1, 31, 17, 5, 3, 1, 0, 2, 3, 6, 3, 5, 3, 2, 2, 6),
(13, 57, 1, 28, 14, 4, 2, 0, 0, 1, 2, 6, 3, 3, 2, 3, 3, 5),
(13, 124, 1, 25, 12, 6, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 4),
(13, 15, 4, 32, 15, 5, 6, 1, 0, 2, 2, 6, 3, 4, 2, 3, 3, -6),
(13, 19, 4, 30, 13, 4, 3, 0, 0, 3, 3, 5, 2, 4, 2, 3, 3, -5),
(13, 142, 4, 27, 11, 6, 2, 0, 0, 1, 2, 5, 3, 2, 1, 2, 2, -4),
(13, 143, 4, 24, 9, 3, 1, 1, 0, 2, 3, 4, 2, 2, 1, 2, 2, -3),

(14, 23, 2, 33, 22, 7, 4, 1, 0, 2, 2, 8, 5, 6, 3, 3, 3, 9),
(14, 27, 2, 31, 18, 3, 8, 2, 0, 3, 3, 6, 3, 6, 3, 3, 3, 7),
(14, 25, 2, 28, 15, 8, 2, 0, 2, 1, 2, 7, 4, 0, 0, 7, 7, 6),
(14, 30, 2, 25, 13, 5, 1, 0, 1, 2, 3, 5, 3, 2, 1, 4, 4, 5),
(14, 22, 7, 32, 20, 5, 7, 2, 0, 2, 2, 7, 4, 6, 3, 3, 3, -8),
(14, 28, 7, 30, 18, 4, 5, 1, 0, 3, 3, 6, 3, 6, 3, 3, 3, -6),
(14, 35, 7, 27, 15, 6, 2, 0, 0, 1, 2, 6, 3, 4, 2, 3, 3, -5),
(14, 40, 7, 24, 13, 3, 1, 1, 0, 2, 3, 5, 3, 2, 1, 4, 4, -4),

(15, 37, 6, 32, 19, 5, 4, 1, 0, 2, 2, 7, 4, 5, 3, 2, 2, 6),
(15, 38, 6, 30, 17, 3, 6, 2, 0, 3, 3, 6, 3, 5, 3, 2, 2, 5),
(15, 65, 6, 27, 14, 6, 2, 0, 0, 1, 2, 6, 3, 3, 2, 2, 2, 4),
(15, 66, 6, 24, 12, 4, 1, 1, 0, 2, 3, 5, 3, 2, 1, 3, 3, 3),
(15, 13, 3, 31, 20, 7, 3, 0, 1, 2, 2, 7, 4, 6, 3, 3, 3, -5),
(15, 36, 3, 29, 18, 5, 3, 1, 0, 3, 3, 6, 3, 6, 3, 3, 3, -4),
(15, 53, 3, 26, 15, 4, 2, 0, 0, 1, 2, 6, 3, 4, 2, 3, 3, -3),
(15, 54, 3, 23, 12, 6, 1, 0, 0, 2, 3, 5, 3, 2, 1, 3, 3, -2);