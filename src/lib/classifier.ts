import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CATEGORIES = [
  "美容・コスメ",
  "健康・フィットネス",
  "IT・テクノロジー",
  "生活・家事",
  "仕事・キャリア",
  "趣味・エンタメ",
  "その他",
] as const;

export type Category = (typeof CATEGORIES)[number];

export async function classifyNeed(content: string): Promise<Category> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

  const prompt = `以下のテキストを分析し、最も適切なカテゴリを1つだけ選んでください。

カテゴリ一覧:
${CATEGORIES.map((c) => `- ${c}`).join("\n")}

テキスト:
"""
${content}
"""

回答はカテゴリ名のみを出力してください。他の説明は不要です。`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Validate the response is a valid category
    const matchedCategory = CATEGORIES.find(
      (c) => response.includes(c) || c.includes(response)
    );

    return matchedCategory || "その他";
  } catch (error) {
    console.error("Classification error:", error);
    return "その他";
  }
}

// ニーズ検出パターン
const NEED_PATTERNS = [
  // 願望・欲求
  /したい|やりたい/,
  /欲しい|ほしい/,
  /できたらいいな|あったらいいな/,
  /ないかな|ないですか/,
  // 困りごと・課題
  /困って|困った/,
  /大変|しんどい/,
  /めんどくさい|めんどう/,
  /うまくいかない/,
  // 探索・要望
  /探してる|探し中/,
  /おすすめ教えて|教えてください/,
  /知りたい|知ってる人/,
  /ありませんか/,
  // 不満・改善要望
  /使いにくい|分かりにくい/,
  /してほしい|してくれたら/,
  /もっと.*たい|さらに.*たい/,
  /があれば|ができれば/,
  // 比較・選択
  /どっちがいい/,
  /おすすめは/,
  /一番いいの/,
];

export function isNeedContent(content: string): boolean {
  return NEED_PATTERNS.some((pattern) => pattern.test(content));
}
