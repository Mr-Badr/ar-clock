export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>

      <h2 className="text-2xl mb-4">
        الصفحة غير موجودة
      </h2>

      <p className="text-muted mb-6">
        الرابط الذي أدخلته غير صحيح.
      </p>

      <a
        href="/"
        className="btn btn-primary btn-lg"
      >
        العودة للرئيسية
      </a>
    </div>
  );
}