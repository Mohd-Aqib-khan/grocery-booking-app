INSERT INTO users (username, password, role) 
VALUES ('admin_user', '$2b$10$1hHSq3PMS0T3HWTc/ro9LeFHt2TmWLFPxMxROsHsROvBGhYxgsBtW', (SELECT id FROM role WHERE name = 'admin'));

INSERT INTO users (username, password, role) 
VALUES ('normal_user', '$2b$10$1hHSq3PMS0T3HWTc/ro9LeFHt2TmWLFPxMxROsHsROvBGhYxgsBtW', (SELECT id FROM role WHERE name = 'user'));