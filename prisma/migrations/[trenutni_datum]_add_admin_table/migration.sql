-- prisma/migrations/20240104143000_add_admin_table/migration.sql
-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert initial admin user
INSERT INTO `admins` (`email`, `password`, `name`, `createdAt`, `updatedAt`) 
VALUES (
    'admin@trebovanje.rs',
    '$2a$10$XG8xYOPdqzVe8p9kL9kX9O.T3lVwJoQG9PeGWyZ3Z2P2UTtKgNjSi', -- hashed password for 'admin123'
    'Admin',
    NOW(),
    NOW()
);
