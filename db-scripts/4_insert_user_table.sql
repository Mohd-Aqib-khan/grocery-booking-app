INSERT INTO users (username, password, role) 
VALUES ('admin_user', 'admin123', (SELECT id FROM role WHERE name = 'admin'));

INSERT INTO users (username, password, role) 
VALUES ('normal_user', 'user123', (SELECT id FROM role WHERE name = 'user'));