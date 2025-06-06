<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->text('description');
            $table->string('category');
            $table->enum('age_category', ['children', 'teen', 'adult', 'all'])->default('all');
            $table->string('cover_image')->nullable();
            $table->string('pdf_file');
            $table->bigInteger('file_size')->nullable(); // in bytes
            $table->integer('pages')->nullable();
            $table->year('published_year')->nullable();
            $table->string('isbn', 20)->nullable();
            $table->string('language', 50)->default('Indonesian');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'age_category']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
