export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        404
      </h1>

      <h2 className="text-2xl mb-4">
        الصفحة غير موجودة
      </h2>

      <p className="text-muted mb-6">
        ربما تم حذف المناسبة أو أن الرابط غير صحيح.
      </p>

      <a
        href="/holidays"
        className="btn btn-primary btn-lg"
      >
        العودة إلى المناسبات
      </a>
    </div>
  );
}