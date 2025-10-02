import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter'; // gray-matterをインポート

// 投稿を取得する関数
async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/articles');
  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // gray-matterを使ってメタデータとコンテンツを分離
    const { data, content } = matter(fileContent);

    // MarkdownをHTMLに変換
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml)
      .process(content);
    const contentHtml = processedContent.toString();

    return { ...data, contentHtml }; // メタデータとHTMLコンテンツを返す
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
    <article className="prose dark:prose-invert lg:prose-xl mx-auto p-8">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
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
