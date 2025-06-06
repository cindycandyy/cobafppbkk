<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_books' => Book::count(),
            'active_books' => Book::active()->count(),
            'total_users' => User::where('role', 'user')->count(),
            'total_downloads' => \DB::table('book_downloads')->count(),
            'recent_books' => Book::latest()->take(5)->get(),
            'recent_users' => User::where('role', 'user')->latest()->take(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function allBooks(Request $request)
    {
        $query = Book::withTrashed();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            switch ($request->status) {
                case 'active':
                    $query->where('is_active', true)->whereNull('deleted_at');
                    break;
                case 'inactive':
                    $query->where('is_active', false)->whereNull('deleted_at');
                    break;
                case 'deleted':
                    $query->onlyTrashed();
                    break;
            }
        }

        $perPage = $request->get('per_page', 15);
        $books = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    public function users(Request $request)
    {
        $query = User::where('role', 'user');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $users = $query->withCount('downloads')->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function downloadStats()
    {
        $stats = \DB::table('book_downloads')
            ->join('books', 'book_downloads.book_id', '=', 'books.id')
            ->select('books.title', 'books.author', \DB::raw('COUNT(*) as download_count'))
            ->groupBy('books.id', 'books.title', 'books.author')
            ->orderBy('download_count', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
