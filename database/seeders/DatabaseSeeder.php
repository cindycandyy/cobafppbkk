<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin Tulisify',
            'email' => 'admin@tulisify.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'User Demo',
            'email' => 'user@tulisify.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create sample books
        $books = [
            [
                'title' => 'Belajar Laravel untuk Pemula',
                'author' => 'John Doe',
                'description' => 'Panduan lengkap belajar Laravel dari dasar hingga mahir.',
                'category' => 'Programming',
                'age_category' => 'adult',
                'published_year' => 2023,
                'language' => 'Indonesian',
                'pages' => 250,
            ],
            [
                'title' => 'Cerita Anak Nusantara',
                'author' => 'Jane Smith',
                'description' => 'Kumpulan cerita rakyat Indonesia untuk anak-anak.',
                'category' => 'Children Story',
                'age_category' => 'children',
                'published_year' => 2022,
                'language' => 'Indonesian',
                'pages' => 120,
            ],
            [
                'title' => 'Panduan Remaja Sukses',
                'author' => 'Ahmad Rahman',
                'description' => 'Tips dan trik untuk remaja meraih kesuksesan.',
                'category' => 'Self Development',
                'age_category' => 'teen',
                'published_year' => 2023,
                'language' => 'Indonesian',
                'pages' => 180,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
