export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
          AI活用ブログ（仮）
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          最新のAIツール活用法やニュースを発信します。
        </p>
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-left text-gray-900 dark:text-white">
          最新記事
        </h2>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          {/* 今後、ここに記事の一覧が動的に表示されます */}
          <p className="text-gray-500 dark:text-gray-400">
            ここに記事の一覧が表示されます。
          </p>
        </div>
      </div>
    </main>
  );
}
