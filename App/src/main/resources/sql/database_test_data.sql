
-- 123456
-- $2a$10$9IXLCuQ0ds/eCZVhg0bDWuSRkp.FWHgpd2daihbtFostA3Bu32JKm

-- 12345
-- $2a$12$sDlIkYyL34rzFB78q.1Ls.ZAalBNn.oyrN1mIHMjqBee4ZTKNOp22

INSERT INTO users (first_name, last_name, email, role, username, password, created_at, updated_at) VALUES
('Jan', 'Kowalski', 'jan.kowalski@example.com', 'ADMIN', 'janek', '$2a$10$ypjWVSh5/TPTuiu81U2CyeXZ2e0KOrJObBAdv2PHotq6UNDFt13nK', NOW(), NOW()),
('Anna', 'Nowak', 'anna.nowak@example.com','USER', 'ania', '$2a$12$sDlIkYyL34rzFB78q.1Ls.ZAalBNn.oyrN1mIHMjqBee4ZTKNOp22', NOW(), NOW()),
('Piotr', 'Wiśniewski', 'piotr.wisniewski@example.com','USER', 'piotrek', '$2a$10$9IXLCuQ0ds/eCZVhg0bDWuSRkp.FWHgpd2daihbtFostA3Bu32JKm', NOW(), NOW()),
('Ewa', 'Zielińska', 'ewa.zielinska@example.com','USER', 'ewa123', '$2a$10$9IXLCuQ0ds/eCZVhg0bDWuSRkp.FWHgpd2daihbtFostA3Bu32JKm', NOW(), NOW()),
('Marek', 'Kowal', 'marek.kowal@example.com','USER', 'marekK', '$2a$10$9IXLCuQ0ds/eCZVhg0bDWuSRkp.FWHgpd2daihbtFostA3Bu32JKm', NOW(), NOW());


-- Statuses
INSERT INTO statuses (name, color) VALUES
('Do zrobienia', '#FF5733'),
('W trakcie', '#33B5FF'),
('Zakończone', '#28A745');

-- Categories
INSERT INTO categories (user_id, name) VALUES
(1, 'Praca'),
(1, 'Dom'),
(2, 'Studia');

-- Tasks
-- user_id = 1
INSERT INTO tasks (user_id, title, description, status_id, priority, due_date, created_at, updated_at) VALUES
(1, 'Raport miesięczny', 'Przygotować zestawienie sprzedaży za kwiecień', 2, 'High', '2026-05-15 12:00:00', NOW(), NOW()),
(1, 'Zakupy spożywcze', 'Chleb, mleko, jajka', 1, 'Medium', '2026-05-06 18:00:00', NOW(), NOW());
-- user_id = 2
INSERT INTO tasks (user_id, title, description, status_id, priority, due_date, created_at, updated_at) VALUES
(2, 'Projekt zaliczeniowy', 'Implementacja bazy danych w Pythonie', 1, 'High', '2026-06-01 23:59:59', NOW(), NOW());
