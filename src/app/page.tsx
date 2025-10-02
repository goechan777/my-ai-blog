import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 投稿一覧を取得する関数
async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/articles');
  try {
    const filenames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(filenames.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // 抜粋を生成（コンテンツの最初の100文字）
      const excerpt = content.substring(0, 100).replace(/\n/g, ' ') + '...';

      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title || '無題の投稿',
        date: data.date || new Date().toISOString(),
        excerpt: excerpt,
      };
    }));
    // 日付の新しい順にソート
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Could not read articles directory:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
          AI活用ブログ（仮）
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          最新のAIツール活用法やニュースを発信します。
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-left text-gray-900 dark:text-white mb-8">
          最新記事
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString('ja-JP')}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              まだ記事がありません。
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
