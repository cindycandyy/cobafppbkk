<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::active();

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        // Filter by age category
        if ($request->has('age_category') && $request->age_category) {
            $query->byAgeCategory($request->age_category);
        }

        // Search by title or author
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $books = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    public function show($id)
    {
        $book = Book::active()->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $book
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'age_category' => 'required|in:children,teen,adult,all',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'pdf_file' => 'required|file|mimes:pdf|max:50000', // 50MB max
            'published_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'isbn' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:50',
            'pages' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $bookData = $request->only([
            'title', 'author', 'description', 'category', 'age_category',
            'published_year', 'isbn', 'language', 'pages'
        ]);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $coverImage = $request->file('cover_image');
            $coverImageName = 'covers/' . Str::uuid() . '.' . $coverImage->getClientOriginalExtension();
            $coverImage->storeAs('public', $coverImageName);
            $bookData['cover_image'] = $coverImageName;
        }

        // Handle PDF file upload
        if ($request->hasFile('pdf_file')) {
            $pdfFile = $request->file('pdf_file');
            $pdfFileName = 'books/' . Str::uuid() . '.pdf';
            $pdfFile->storeAs('public', $pdfFileName);
            $bookData['pdf_file'] = $pdfFileName;
            $bookData['file_size'] = $pdfFile->getSize();
        }

        $bookData['is_active'] = true;

        $book = Book::create($bookData);

        return response()->json([
            'success' => true,
            'message' => 'Book created successfully',
            'data' => $book
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'age_category' => 'sometimes|required|in:children,teen,adult,all',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'pdf_file' => 'nullable|file|mimes:pdf|max:50000',
            'published_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'isbn' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:50',
            'pages' => 'nullable|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $bookData = $request->only([
            'title', 'author', 'description', 'category', 'age_category',
            'published_year', 'isbn', 'language', 'pages', 'is_active'
        ]);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover image
            if ($book->cover_image) {
                Storage::delete('public/' . $book->cover_image);
            }

            $coverImage = $request->file('cover_image');
            $coverImageName = 'covers/' . Str::uuid() . '.' . $coverImage->getClientOriginalExtension();
            $coverImage->storeAs('public', $coverImageName);
            $bookData['cover_image'] = $coverImageName;
        }

        // Handle PDF file upload
        if ($request->hasFile('pdf_file')) {
            // Delete old PDF file
            if ($book->pdf_file) {
                Storage::delete('public/' . $book->pdf_file);
            }

            $pdfFile = $request->file('pdf_file');
            $pdfFileName = 'books/' . Str::uuid() . '.pdf';
            $pdfFile->storeAs('public', $pdfFileName);
            $bookData['pdf_file'] = $pdfFileName;
            $bookData['file_size'] = $pdfFile->getSize();
        }

        $book->update($bookData);

        return response()->json([
            'success' => true,
            'message' => 'Book updated successfully',
            'data' => $book->fresh()
        ]);
    }

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        // Delete files from storage
        if ($book->cover_image) {
            Storage::delete('public/' . $book->cover_image);
        }
        if ($book->pdf_file) {
            Storage::delete('public/' . $book->pdf_file);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book deleted successfully'
        ]);
    }

    public function download($id)
    {
        $book = Book::active()->find($id);

        if (!$book || !$book->pdf_file) {
            return response()->json([
                'success' => false,
                'message' => 'Book or file not found'
            ], 404);
        }

        $filePath = storage_path('app/public/' . $book->pdf_file);

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found on server'
            ], 404);
        }

        // Record download
        if (auth()->check()) {
            $user = auth()->user();
            if (!$user->downloads()->where('book_id', $book->id)->exists()) {
                $user->downloads()->attach($book->id);
            }
        }

        return response()->download($filePath, $book->title . '.pdf');
    }

    public function categories()
    {
        $categories = Book::active()
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function ageCategories()
    {
        $ageCategories = [
            'children' => 'Children',
            'teen' => 'Teen',
            'adult' => 'Adult',
            'all' => 'All Ages'
        ];

        return response()->json([
            'success' => true,
            'data' => $ageCategories
        ]);
    }
}
