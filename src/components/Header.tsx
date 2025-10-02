import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <Link href="/">
              AI活用ブログ（仮）
            </Link>
          </div>
          <div className="flex items-center">
            {/* 将来的にナビゲーションリンクを追加する場所 */}
            {/* <Link href="/about"><span className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">About</span></Link> */}
          </div>
        </div>
      </nav>
    </header>
  );
}
