/* Main page */
import MainClock from '@/components/clocks/main-clock';
import Header from '@/components/layout/header';

export default function HomePage() {
  return (
    <div className="min-h-screen text-primary" dir="rtl">
      <Header />

      <main className="pt-16 min-h-screen flex flex-col justify-center pb-20">
        <h1 className="sr-only">ساعة عربية - الوقت الآن في جميع أنحاء العالم</h1>
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="text-center mb-12">
            <MainClock timezone={null} />
          </div>
        </div>
      </main>
    </div>
  );
}