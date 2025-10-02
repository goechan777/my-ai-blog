import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import { Metadata } from 'next';

// Postの型を明示的に定義
interface PostData {
  title: string;
  date: string;
  [key: string]: unknown;
}

// メタデータ生成関数
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return {};
  }
  const excerpt = post.contentHtml.replace(/<[^>]*>/g, '').substring(0, 120);
  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `https://my-ai-blog-smoky.vercel.app/blog/${params.slug}`,
      images: [
        {
          url: "/ogp-default.svg", // TODO: 各記事のOGP画像を動的に生成する
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

// 投稿を取得する関数
async function getPost(slug: string): Promise<(PostData & { contentHtml: string }) | null> {
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

    return { ...(data as PostData), contentHtml };
  } catch {
    return null;
  }
}

// paramsをPromiseとして扱い、awaitで解決するよう修正
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

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
  } catch {
    return [];
  }
}