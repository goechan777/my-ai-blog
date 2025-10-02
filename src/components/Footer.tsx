export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-8 py-4">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AI活用ブログ（仮）. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
