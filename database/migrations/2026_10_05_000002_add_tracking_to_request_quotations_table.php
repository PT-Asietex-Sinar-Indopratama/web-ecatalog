<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('request_quotations', function (Blueprint $table) {
            // Tracking perubahan status
            $table->string('closed_reason')->nullable()->after('status'); // won, lost, invalid
            $table->text('admin_notes')->nullable()->after('closed_reason');

            // Pelacak siapa & kapan mengubah status
            $table->foreignId('status_changed_by')->nullable()->after('admin_notes')->constrained('users')->nullOnDelete();
            $table->timestamp('status_changed_at')->nullable()->after('status_changed_by');
        });
    }

    public function down(): void
    {
        Schema::table('request_quotations', function (Blueprint $table) {
            $table->dropColumn(['closed_reason', 'admin_notes', 'status_changed_by', 'status_changed_at']);
        });
    }
};
