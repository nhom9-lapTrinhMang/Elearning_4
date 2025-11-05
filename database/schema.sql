-- Vue 3 Blog Application Database Schema
-- This SQL script creates the database structure for the Vue 3 Blog Application

-- Create database (uncomment if needed)
-- CREATE DATABASE vue3_blog_app;
-- USE vue3_blog_app;

-- Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(500) NULL,
    bio TEXT NULL,
    website VARCHAR(500) NULL,
    twitter VARCHAR(255) NULL,
    linkedin VARCHAR(500) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_token (token)
);

-- Categories table
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_name (name)
);

-- Tags table
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_name (name)
);

-- Blogs table
CREATE TABLE blogs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT NULL,
    featured_image VARCHAR(500) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    views_count INT UNSIGNED DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_published_at (published_at),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (title, content, excerpt)
);

-- Blog tags pivot table
CREATE TABLE blog_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    blog_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_blog_tag (blog_id, tag_id),
    INDEX idx_blog_id (blog_id),
    INDEX idx_tag_id (tag_id)
);

-- Comments table (for future implementation)
CREATE TABLE comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    blog_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    parent_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_blog_id (blog_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
);

-- Contact messages table
CREATE TABLE contact_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Media files table (for file uploads)
CREATE TABLE media_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT UNSIGNED NOT NULL,
    path VARCHAR(1000) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    uploaded_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_mime_type (mime_type),
    INDEX idx_created_at (created_at)
);

-- User sessions table (for authentication tracking)
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- Settings table (for application configuration)
CREATE TABLE settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value LONGTEXT NULL,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key_name (key_name)
);

-- Insert default data

-- Default admin user (password: admin123)
INSERT INTO users (name, email, password, role, created_at) VALUES 
('Admin User', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNipm1LLhpxGe', 'admin', NOW());

-- Default categories
INSERT INTO categories (name, slug, description, color, created_at) VALUES
('Technology', 'technology', 'Posts about technology and programming', '#3B82F6', NOW()),
('Web Development', 'web-development', 'Web development tutorials and tips', '#10B981', NOW()),
('Vue.js', 'vuejs', 'Vue.js related content', '#4ADE80', NOW()),
('JavaScript', 'javascript', 'JavaScript programming', '#F59E0B', NOW()),
('Tutorial', 'tutorial', 'Step-by-step tutorials', '#8B5CF6', NOW()),
('News', 'news', 'Latest news and updates', '#EF4444', NOW());

-- Default tags
INSERT INTO tags (name, slug, created_at) VALUES
('Vue 3', 'vue-3', NOW()),
('JavaScript', 'javascript', NOW()),
('TypeScript', 'typescript', NOW()),
('Frontend', 'frontend', NOW()),
('Backend', 'backend', NOW()),
('API', 'api', NOW()),
('Tutorial', 'tutorial', NOW()),
('Beginner', 'beginner', NOW()),
('Advanced', 'advanced', NOW()),
('Tips', 'tips', NOW()),
('Best Practices', 'best-practices', NOW()),
('Performance', 'performance', NOW());

-- Sample blog posts
INSERT INTO blogs (title, slug, content, excerpt, status, author_id, category_id, published_at, created_at) VALUES
(
    'Getting Started with Vue 3 Composition API',
    'getting-started-vue-3-composition-api',
    '<h2>Introduction</h2><p>Vue 3 introduced the Composition API, a new way to write Vue components that provides better TypeScript support and more flexible component organization.</p><h2>What is the Composition API?</h2><p>The Composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.</p><h2>Basic Example</h2><pre><code>import { ref, computed } from ''vue''\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubleCount = computed(() => count.value * 2)\n    \n    return {\n      count,\n      doubleCount\n    }\n  }\n}</code></pre><p>This new approach offers several advantages over the Options API...</p>',
    'Learn how to use Vue 3 Composition API to write more maintainable and reusable components.',
    'published',
    1,
    3,
    NOW(),
    NOW()
),
(
    'Building a Modern Blog with Vue 3 and Vite',
    'building-modern-blog-vue-3-vite',
    '<h2>Project Setup</h2><p>In this tutorial, we''ll create a modern blog application using Vue 3, Vite, and other modern tools.</p><h2>Why Vue 3 and Vite?</h2><p>Vue 3 offers improved performance, better TypeScript support, and the Composition API. Vite provides lightning-fast development experience with instant hot module replacement.</p><h2>Getting Started</h2><pre><code>npm create vue@latest my-blog\ncd my-blog\nnpm install\nnpm run dev</code></pre><p>This will create a new Vue 3 project with Vite as the build tool...</p>',
    'Step-by-step guide to building a blog application with Vue 3, Vite, and modern development tools.',
    'published',
    1,
    2,
    NOW(),
    NOW()
),
(
    'Vue 3 State Management with Pinia',
    'vue-3-state-management-pinia',
    '<h2>Introduction to Pinia</h2><p>Pinia is the official state management library for Vue 3. It provides a simple and intuitive API for managing application state.</p><h2>Installation</h2><pre><code>npm install pinia</code></pre><h2>Creating a Store</h2><pre><code>import { defineStore } from ''pinia''\n\nexport const useCounterStore = defineStore(''counter'', {\n  state: () => ({\n    count: 0\n  }),\n  actions: {\n    increment() {\n      this.count++\n    }\n  }\n})</code></pre><p>Pinia stores are much simpler than Vuex stores...</p>',
    'Learn how to manage application state in Vue 3 using Pinia, the official state management library.',
    'draft',
    1,
    3,
    NULL,
    NOW()
);

-- Link blogs with tags
INSERT INTO blog_tags (blog_id, tag_id) VALUES
(1, 1), (1, 2), (1, 7), (1, 8),
(2, 1), (2, 2), (2, 4), (2, 7),
(3, 1), (3, 2), (3, 9), (3, 11);

-- Default application settings
INSERT INTO settings (key_name, value, type, description) VALUES
('site_name', 'Vue 3 Blog', 'string', 'Application name'),
('site_description', 'A modern blog application built with Vue 3', 'string', 'Application description'),
('posts_per_page', '10', 'number', 'Number of posts to display per page'),
('allow_registration', 'true', 'boolean', 'Allow new user registration'),
('allow_comments', 'true', 'boolean', 'Allow comments on blog posts'),
('moderate_comments', 'true', 'boolean', 'Moderate comments before publishing'),
('mail_driver', 'smtp', 'string', 'Email driver configuration'),
('mail_host', 'smtp.gmail.com', 'string', 'SMTP host'),
('mail_port', '587', 'number', 'SMTP port'),
('upload_max_size', '5242880', 'number', 'Maximum upload file size in bytes (5MB)'),
('allowed_image_types', '["jpg", "jpeg", "png", "gif", "webp"]', 'json', 'Allowed image file types');

-- Create indexes for better performance
CREATE INDEX idx_blogs_search ON blogs(status, published_at DESC, created_at DESC);
CREATE INDEX idx_blogs_author_status ON blogs(author_id, status, created_at DESC);
CREATE INDEX idx_users_email_role ON users(email, role);

-- Views for common queries

-- View for published blogs with author information
CREATE VIEW published_blogs_view AS
SELECT 
    b.id,
    b.title,
    b.slug,
    b.content,
    b.excerpt,
    b.featured_image,
    b.views_count,
    b.published_at,
    b.created_at,
    b.updated_at,
    u.name as author_name,
    u.avatar as author_avatar,
    c.name as category_name,
    c.slug as category_slug,
    c.color as category_color
FROM blogs b
LEFT JOIN users u ON b.author_id = u.id
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.status = 'published'
ORDER BY b.published_at DESC;

-- View for blog statistics
CREATE VIEW blog_stats_view AS
SELECT 
    COUNT(*) as total_blogs,
    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_blogs,
    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_blogs,
    SUM(views_count) as total_views,
    AVG(views_count) as avg_views_per_blog
FROM blogs;

-- Stored procedures for common operations

DELIMITER //

-- Procedure to increment blog view count
CREATE PROCEDURE IncrementBlogViews(IN blog_id BIGINT UNSIGNED)
BEGIN
    UPDATE blogs 
    SET views_count = views_count + 1 
    WHERE id = blog_id AND status = 'published';
END //

-- Procedure to get blog with tags
CREATE PROCEDURE GetBlogWithTags(IN blog_id BIGINT UNSIGNED)
BEGIN
    -- Get blog details
    SELECT 
        b.*,
        u.name as author_name,
        u.avatar as author_avatar,
        c.name as category_name,
        c.slug as category_slug
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.id = blog_id;
    
    -- Get blog tags
    SELECT t.id, t.name, t.slug
    FROM tags t
    INNER JOIN blog_tags bt ON t.id = bt.tag_id
    WHERE bt.blog_id = blog_id;
END //

-- Function to generate unique slug
CREATE FUNCTION GenerateUniqueSlug(base_slug VARCHAR(500), table_name VARCHAR(100))
RETURNS VARCHAR(500)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE counter INT DEFAULT 0;
    DECLARE new_slug VARCHAR(500);
    DECLARE slug_exists INT DEFAULT 1;
    
    SET new_slug = base_slug;
    
    WHILE slug_exists > 0 DO
        IF table_name = 'blogs' THEN
            SELECT COUNT(*) INTO slug_exists FROM blogs WHERE slug = new_slug;
        ELSEIF table_name = 'categories' THEN
            SELECT COUNT(*) INTO slug_exists FROM categories WHERE slug = new_slug;
        ELSEIF table_name = 'tags' THEN
            SELECT COUNT(*) INTO slug_exists FROM tags WHERE slug = new_slug;
        END IF;
        
        IF slug_exists > 0 THEN
            SET counter = counter + 1;
            SET new_slug = CONCAT(base_slug, '-', counter);
        END IF;
    END WHILE;
    
    RETURN new_slug;
END //

DELIMITER ;

-- Triggers for automatic slug generation and timestamps

DELIMITER //

-- Trigger to auto-generate slug for new blogs
CREATE TRIGGER blogs_before_insert
BEFORE INSERT ON blogs
FOR EACH ROW
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        SET NEW.slug = GenerateUniqueSlug(
            LOWER(REPLACE(REPLACE(REPLACE(NEW.title, ' ', '-'), '--', '-'), '---', '-')), 
            'blogs'
        );
    END IF;
    
    IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
        SET NEW.published_at = NOW();
    END IF;
END //

-- Trigger to auto-generate slug for new categories
CREATE TRIGGER categories_before_insert
BEFORE INSERT ON categories
FOR EACH ROW
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        SET NEW.slug = GenerateUniqueSlug(
            LOWER(REPLACE(REPLACE(REPLACE(NEW.name, ' ', '-'), '--', '-'), '---', '-')), 
            'categories'
        );
    END IF;
END //

-- Trigger to auto-generate slug for new tags
CREATE TRIGGER tags_before_insert
BEFORE INSERT ON tags
FOR EACH ROW
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        SET NEW.slug = GenerateUniqueSlug(
            LOWER(REPLACE(REPLACE(REPLACE(NEW.name, ' ', '-'), '--', '-'), '---', '-')), 
            'tags'
        );
    END IF;
END //

DELIMITER ;

-- Final optimizations
ANALYZE TABLE users, blogs, categories, tags, blog_tags, comments;

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON vue3_blog_app.* TO 'blog_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- FLUSH PRIVILEGES;