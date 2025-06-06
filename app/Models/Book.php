<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'author',
        'description',
        'category',
        'age_category',
        'cover_image',
        'pdf_file',
        'file_size',
        'pages',
        'published_year',
        'isbn',
        'language',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_year' => 'integer',
        'pages' => 'integer',
        'file_size' => 'integer',
    ];

    // Relationships
    public function downloads()
    {
        return $this->belongsToMany(User::class, 'book_downloads')->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByAgeCategory($query, $ageCategory)
    {
        return $query->where('age_category', $ageCategory);
    }

    // Accessors
    public function getCoverImageUrlAttribute()
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    public function getPdfFileUrlAttribute()
    {
        return $this->pdf_file ? asset('storage/' . $this->pdf_file) : null;
    }

    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size) return null;
        
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
