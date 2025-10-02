import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';

// 投稿を取得する関数
async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/articles');
  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml)
      .process(content);
    const contentHtml = processedContent.toString();

    return { ...data, contentHtml, date: data.date || new Date().toISOString() };
  } catch (error) {
    return null;
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{post.title}</h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          公開日: {new Date(post.date).toLocaleDateString('ja-JP')}
        </p>
      </div>
      <div 
        className="prose dark:prose-invert lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

// 静的パスを生成する関数（ビルド時に実行）
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src/articles');
  try {
    const filenames = await fs.readdir(postsDirectory);
    return filenames.map((filename) => ({
      slug: filename.replace(/\.md$/, ''),
    }));
  } catch (error) {
    return [];
  }
}
