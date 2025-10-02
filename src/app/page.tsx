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
      const { data } = matter(fileContents);
      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title || '無題の投稿',
      };
    }));
    return posts;
  } catch (error) {
    console.error("Could not read articles directory:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

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
          {posts.length > 0 ? (
            <ul>
              {posts.map(post => (
                <li key={post.slug} className="py-4">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-xl font-semibold text-blue-600 hover:underline dark:text-blue-400">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
