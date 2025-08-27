-- Adding sample data for testing the billing system
-- Insert sample customers
INSERT INTO customers (name, email, phone, address, tax_id) VALUES
('Empresa ABC S.L.', 'contacto@empresaabc.com', '+34 912 345 678', 'Calle Mayor 123, 28001 Madrid', 'B12345678'),
('Consultoría XYZ', 'info@consultoriaxyz.com', '+34 934 567 890', 'Passeig de Gràcia 456, 08007 Barcelona', 'B87654321'),
('Tienda Online DEF', 'ventas@tiendadef.com', '+34 954 321 098', 'Avenida de la Constitución 789, 41001 Sevilla', 'B11223344');

-- Insert sample products
INSERT INTO products (name, description, price, tax_rate, unit) VALUES
('Consultoría de Marketing', 'Servicio de consultoría especializada en marketing digital', 150.00, 21.00, 'hora'),
('Desarrollo Web', 'Desarrollo de sitio web corporativo', 2500.00, 21.00, 'proyecto'),
('Mantenimiento Mensual', 'Servicio de mantenimiento y soporte técnico', 200.00, 21.00, 'mes'),
('Diseño Gráfico', 'Diseño de identidad corporativa completa', 800.00, 21.00, 'proyecto'),
('Hosting Anual', 'Servicio de hosting web por un año', 120.00, 21.00, 'año');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, issue_date, due_date, subtotal, tax_amount, total, status) VALUES
('FAC-2024-001', 1, '2024-01-15', '2024-02-14', 2500.00, 525.00, 3025.00, 'paid'),
('FAC-2024-002', 2, '2024-01-20', '2024-02-19', 1200.00, 252.00, 1452.00, 'sent'),
('FAC-2024-003', 3, '2024-01-25', '2024-02-24', 800.00, 168.00, 968.00, 'draft');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, tax_rate, line_total) VALUES
(1, 2, 'Desarrollo Web', 1, 2500.00, 21.00, 2500.00),
(2, 1, 'Consultoría de Marketing', 8, 150.00, 21.00, 1200.00),
(3, 4, 'Diseño Gráfico', 1, 800.00, 21.00, 800.00);
