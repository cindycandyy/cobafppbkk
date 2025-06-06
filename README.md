# Tulisify Frontend

Frontend Next.js untuk aplikasi e-book Tulisify yang terintegrasi dengan backend Laravel.

## Fitur

- **Landing Page**: Halaman utama dengan logo dan navigasi ke login/register
- **Authentication**: Login dan register untuk user dan admin
- **Book Catalog**: Daftar buku dengan filter dan search
- **Book Download**: Download buku PDF untuk user yang login
- **Admin Panel**: Manajemen buku (CRUD) untuk admin
- **Responsive Design**: UI yang responsif untuk semua ukuran layar

## Teknologi

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Context untuk state management

## Instalasi

1. Clone repository
\`\`\`bash
git clone <repository-url>
cd tulisify-frontend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Setup environment variables
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` dan sesuaikan URL backend:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

4. Jalankan development server
\`\`\`bash
npm run dev
\`\`\`

5. Buka browser di `http://localhost:3000`

## Struktur Halaman

### Public Pages
- `/` - Landing page
- `/login` - Login user
- `/register` - Register user
- `/admin/login` - Login admin

### Protected Pages
- `/books` - Daftar buku (user)
- `/admin` - Dashboard admin

## Default Login

Setelah backend seeder dijalankan:

**Admin:**
- Email: admin@tulisify.com
- Password: password

**User:**
- Email: user@tulisify.com
- Password: password

## API Integration

Frontend ini terintegrasi dengan Laravel backend melalui:
- JWT Authentication
- RESTful API endpoints
- File upload/download
- Real-time error handling

## Development

Untuk development:
1. Pastikan backend Laravel berjalan di `http://localhost:8000`
2. Jalankan `npm run dev` untuk frontend
3. Akses aplikasi di `http://localhost:3000`

## Build Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

1. Build aplikasi untuk production
2. Deploy ke platform pilihan (Vercel, Netlify, dll)
3. Update environment variables untuk production API URL
