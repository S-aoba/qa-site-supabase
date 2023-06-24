'use client'

import { Button, MultiSelect, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as z from 'zod'

import Loading from '@/app/loading'
import type { Database } from '@/lib/database.types'
import { editedQuestionDescriptionAtom } from '@/store/question-atom'

import { useDescriptionEditor } from './hooks/useDescriptionEditor'

const schema = z.object({
  title: z
    .string()
    .min(1, { message: '質問タイトルを1文字以上入力してください' })
    .max(100, { message: 'これ以上入力できません' }),
  coding_problem: z.string().min(1, { message: '問題を1つ選択してください' }),
  tags: z.string().array().min(1, { message: 'タグを1つ以上選択してください' }),
})

export const QuestionPost = ({ userId }: { userId: string }) => {
  const editedQuestionDescription = useAtomValue(editedQuestionDescriptionAtom)
  const { questionEditor } = useDescriptionEditor()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  const handleForm = useForm({
    validate: zodResolver(schema),
    initialValues: { title: '', coding_problem: '', tags: [] },
  })

  const handleOnSubmit = async (props: { title: string; coding_problem: string; tags: string[] }) => {
    setLoading(true)
    const { title, coding_problem, tags } = props

    try {
      const { error } = await supabase.from('questions').insert({
        title: title,
        description: editedQuestionDescription,
        tags: tags,
        coding_problem: coding_problem,
        user_id: userId,
      })

      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    // ページリロードするとmantineのコンポーネントが初期化される
    // おそらくまだ app routerに対応していなからだと思う。挙動は、大丈夫そうなのでこのまま実装する。
    <>
      <form className=' flex flex-col justify-center gap-y-7' onSubmit={handleForm.onSubmit(handleOnSubmit)}>
        <TextInput
          {...handleForm.getInputProps('title')}
          placeholder='質問タイトル'
          size='md'
          withAsterisk
          maxLength={100}
          styles={{
            input: {
              height: '70px',
              fontSize: '2rem',
              border: '1px solid #cbd5e1',
              ':focus': { border: '1px solid #cbd5e1' },
            },
          }}
        />
        <Select
          {...handleForm.getInputProps('coding_problem')}
          placeholder='問題を選択してください'
          data={codingProblemList}
          searchable
          styles={{ input: { border: '1px solid #cbd5e1', ':focus': { border: '1px solid #cbd5e1' } } }}
        />
        <MultiSelect
          {...handleForm.getInputProps('tags')}
          data={data}
          placeholder='タグを最大5つまで選択できます'
          searchable
          nothingFound='Nothing found'
          clearable
          withAsterisk
          maxSelectedValues={5}
          styles={{ input: { border: '1px solid #cbd5e1', ':focus-within': { border: '1px solid #cbd5e1' } } }}
        />
        {/* todo: validationを設定する */}
        <RichTextEditor
          editor={questionEditor}
          className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
        >
          <RichTextEditor.Content />
        </RichTextEditor>
        <div className='flex w-full justify-end px-3'>
          {isLoading ? (
            <Loading />
          ) : (
            <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600'>
              質問を投稿
            </Button>
          )}
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
const data = [
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'react', label: 'React' },
  { value: 'next.js', label: 'Next.js' },
]

const codingProblemList = [
  '問題以外の質問',
  '問題1: 引き算',
  '問題2: 掛け算',
  '問題3: 3乗',
  '問題4: 立方体の表面積',
  '問題5: 原点からの点までの距離',
  '問題6: メートルをマイルに変換する',
  '問題7: 最初の文字を返す',
  '問題8: 最後の文字を返す',
  '問題9: 名のイニシャル',
  '問題10: 新幹線のチケットの値段',
  '問題11: レスポンシブデザイン(Bootstrap)',
  '問題12: ドモルガンの法則',
  '問題13: XOR',
  '問題14: 学校の祝日',
  '問題15: ポートレートモード',
  '問題16: 機内食オーダー',
  '問題17: 小文字',
  '問題18: Leetify',
  '問題19: メールアドレス認証',
  '問題20: 部分文字列',
  '問題21: ヒント表示',
  '問題22: アンダースコア',
  '問題23: 文字削除',
  '問題24: 回文',
  '問題25: 文字列の真ん中を返す',
  '問題26: 円周を求める',
  '問題27: 二次方程式の解',
  '問題28: 閏年',
  '問題29: 民泊の値段',
  '問題30: トランプゲーム',
  '問題31: アルファベット判定',
  '問題32: Eメールを隠す',
  '問題33: アルファベットを大文字、小文字に変換する',
  '問題34: パスワード判定',
  '問題35: ランニング',
  '問題36: 借金返済',
  '問題37: 平方根の判定',
  '問題38: 利子の支払い',
  '問題39: リダイレクト',
  '問題40: パスカルの三角形',
  '問題41: 正方形の合計面積',
  '問題42: 羊を数える',
  '問題43: 文字列の逆表示',
  '問題44: 正方形の合計枚数',
  '問題45: 数字を分割して足す',
  '問題46: 3で割り続ける',
  '問題47: フィボナッチ数列',
  '問題48: 約数',
  '問題49: 投資の計算',
  '問題50: 数字の分割',
  '問題51: 素数',
  '問題52: 出席管理',
  '問題53: 割り切れない',
  '問題54: FizzBuzz',
  '問題55: 完全数',
  '問題56: 最初と最後の桁を足す',
  '問題57: 回文（数値）',
  '問題58: 素数の和',
  '問題59: 10進数から2進数への書き換え',
  '問題60: 10進数から16進数への書き換え',
  '問題61: 1の補数',
  '問題62: 2の補数',
  '問題63: リスト内の要素の足し合わせ',
  '問題64: 単語内の文字カウント',
  '問題65: 文字コード',
  '問題66: 最大文字列',
  '問題67: ブラックジャック',
  '問題68: サブスクリプションリスト',
  '問題69: ∠ABC',
  '問題70: 間のアルファベット',
  '問題71: 従業員リスト',
  '問題72: 素数の個数',
  '問題73: 配列のシャッフル',
  '問題74: シャッフルの割合',
  '問題75: ページ付け',
  '問題76: ベクトルの外積',
  '問題77: 行列の積',
  '問題78: 偶奇の並べ替え',
  '問題79: 壁と巨人',
  '問題80: 生徒とキャンディー',
  '問題81: 数字の掛け合わせ',
  '問題82: パスワードに足りない数字',
  '問題83: シャトルラン',
  '問題84: 子音の逆表示',
  '問題85: ハミング距離',
  '問題86: ハミング距離（文字列）',
  '問題87: 表計算ソフト',
  '問題88: アナグラム',
  '問題89: 並べ替えて回文',
  '問題90: 累乗の組み合わせ',
  '問題91: 数字の頻度',
  '問題92: ランクの差',
  '問題93: バーゲンセール',
  '問題94: 2進数の合計値',
  '問題95: カエサルの暗号',
  '問題96: アラブ人による頻度分析',
  '問題97: ペア探し',
  '問題98: 山型',
  '問題99: 単語の逆表示',
  '問題100: 復習のお知らせ機能',
  '問題101: 括弧チェック',
  '問題102: 大文字を含む単語数',
  '問題103: 1文字削除して回文',
  '問題104: パングラム',
  '問題105: 共通の文字',
  '問題106: 部屋替え',
  '問題107: x回出現',
  '問題108: 単語の抽出',
  '問題109: 時計の誤差',
  '問題110: クイズ番組',
  '問題111: マッチングアプリ',
  '問題112: 最大値の個数',
  '問題113: ショッピングリスト',
  '問題114: 連続スコア',
  '問題115: ペアチケット',
  '問題116: 絶対値のペア',
  '問題117: 単語のカウント',
  '問題118: 株式売買',
  '問題119: オンラインゲーム',
  '問題120: 掃除当番',
  '問題121: 協力型ゲーム',
  '問題122: 整列しない生徒',
  '問題123: モンスターの出現回数',
  '問題124: トランプの並べ替え',
  '問題125: ドラマの字幕',
  '問題126: 営業成績',
  '問題127: マッチングアプリ相性',
  '問題128: マッチングアプリユーザー共通点',
  '問題129: ローマ数字を数字に変換',
  '問題130: 数字をローマ数字に変換',
  '問題131: 野球部員',
  '問題132: 本棚整理',
  '問題133: 検索ワード',
  '問題134: xになるまでの組み合わせ',
  '問題135: 年収の中央値',
  '問題136: クイズゲーム',
  '問題137: 回文を探すゲーム',
  '問題138: HP回復',
  '問題139: 本の陳列',
  '問題140: ゲーム内での買い物',
  '問題141: リズムゲーム',
  '問題142: パズルゲーム',
  '問題143: カプレカ数',
  '問題144: フルーツの画像',
  '問題145: 電卓',
  '問題146: パスワード非表示',
  '問題147: カエルジャンプ',
  '問題148: Bill Summation',
  '問題149: 文字列へ変換',
  '問題150: 従業員割り振り',
  '問題152: 1で始まり1で終わる',
  '問題153: 三角形の個数',
  '問題154: 文章作成',
  '問題155: 最も連続で出力される数字',
  '問題156: チョコレートデータ集め',
  '問題157: キャラクター操作',
  '問題158: 重複なし最長部分文字列',
  '問題159: 2番目に大きい値',
  '問題160: 片方向リストへの挿入',
  '問題161: 特定位置に挿入',
  '問題162: 連結リストの交わる点',
  '問題163: 片方向リストn倍',
  '問題164: 最長括弧',
  '問題165: ジム建設',
  '問題166: 空白で文字を反転',
  '問題167: 先頭に挿入',
  '問題168: 末尾に挿入',
  '問題169: 末尾の削除',
  '問題170: 先頭と末尾に挿入',
  '問題171: 最小値の検索',
  '問題172: 連結リスト内の値検索',
  '問題173: 賭けサイコロゲーム',
  '問題174: 株式分析',
  '問題175: サイズkの部分配列の最小値',
  '問題176: Pair of Cards',
  '問題177: 配列の重複',
  '問題178: 配列の重複（区別あり）',
  '問題179: 配列に1を足す',
  '問題180: 文字列の逆表示（置換）',
  '問題181: 新しいカウント方法',
  '問題182: Atoi',
  '問題183: 長針と短針',
  '問題184: 整数の再割り当て',
  '問題185: 文字列を文章化',
  '問題186: ヒット映画',
  '問題187: 白菜の輸出',
  '問題188: ソート済連結リストの合併',
  '問題189: 回文連結リスト',
  '問題190: 占いサイト',
  '問題191: 差が一定',
  '問題192: 右側の最大値',
  '問題193: アルファベット内の数値の合計',
  '問題194: 文字列の逆表示（重複なし）',
  '問題195: カレンダー',
  '問題196: 駅のプラットフォーム',
  '問題197: 信用スコア',
  '問題198: Quadrilateral Shape',
  '問題199: 二分探索木内探索',
  '問題200: 二分探索木内のキー',
  '問題201: 二分探索木内の最小値',
  '問題202: 二分探索木内の最大値',
  '問題203: 二分探索木内の後続ノード',
  '問題204: 二分探索木内の先行ノード',
  '問題205: ソート済み配列を二分探索木へ変換',
  '問題206: 前順（二分木）',
  '問題207: 間順（二分木）',
  '問題208: 後順（二分木）',
  '問題209: 逆間順（二分木）',
  '問題210: 二分木の最大の深さ',
  '問題211: 対称的な二分木',
  '問題212: 有効な二分木',
  '問題213: 階層走査',
  '問題214: 二分探索木への挿入',
  '問題215: 二分探索木から削除',
  '問題216: 最大ヒープ',
  '問題217: 最小ヒープ',
  '問題218: ヒープソート',
  '問題219: K個の最大値',
  '問題220: K個の最小値',
  '問題221: 文字列の合体',
  '問題222: 偶奇の入れ替え',
  '問題223: はじめての大文字',
  '問題224: 掛け算（再帰）',
  '問題225: 文字列の長さ（再帰）',
  '問題226: xのn乗',
  '問題227: 文字列の圧縮',
  '問題228: 共通の接頭辞',
  '問題229: k番目の要素',
  '問題230: 5を減らす',
  '問題231: タイルの数',
  '問題232: 購入できる最大のパンの個数',
  '問題233: 最初と最後の文字が同じ部分文字列',
  '問題234: 最大の要素数',
  '問題235: 数値の言語化',
  '問題236: 整数カウント',
  '問題237: 右側と比較',
  '問題238: デコード',
  '問題239: 括弧全通り',
  '問題240: 回文全通り',
  '問題241: 反転回数',
  '問題242: 整数の最大値',
  '問題243: 最大の偶数',
  '問題244: 並べ替えて最大',
  '問題245: IncreaseとDecrease',
  '問題246: 和がX未満',
  '問題247: 同じ要素',
  '問題248: 抽出してソート',
  '問題250: 双六',
  '問題251: 有効な括弧',
  '問題252: アナグラムに必要な入れ替え',
  '問題253: 文字全通り',
  '問題254: 2乗して並べ替え',
  '問題255: x になるまでの組み合わせ（応用）',
  '問題256: 減り続ける要素',
  '問題257: 要素の変化',
  '問題258: 足して合計値',
  '問題259: 部分配列の反転',
  '問題260: 最も種類の多い文字列',
  '問題261: 頂上の数',
  '問題262: 算術配列',
  '問題263: バケツ移し替え',
  '問題264: 最小部分文字列',
  '問題265: 真ん中のノード',
  '問題266: 片方向リストの並べ替え',
  '問題267: 葉ノードの数',
  '問題268: 同じ木',
  '問題269: BST合体',
  '問題270: 二分木の反転',
  '問題271: 祖父母ノード',
  '問題272: ノードのスワップ',
  '問題273: 片方向リストのノードの削除',
  '問題274: 荷物梱包',
  '問題275: BSTソート',
  '問題276: BSTパターン',
  '問題277: 深さ最小',
  '問題278: 完全二分木',
  '問題279: ノードXの変換',
  '問題280: 0の削除',
  '問題281: 回文経路',
  '問題282: 同じ値（二分木）',
  '問題283: 10進数変換（連結リスト）',
  '問題284: 辞書の作成',
  '問題285: イカサマデッキ',
  '問題286: ゼッケンドルフの定理',
  '問題287: 卵の落下',
  '問題288: ダムの貯水量',
  '問題289: ダム開発',
  '問題290: 経路の足し算',
  '問題291: BST内の検索',
  '問題292: 部分木検索',
  '問題293: 左側の葉ノードの合計',
  '問題294: 階層の最大値',
  '問題295: 数式の解析',
  '問題296: 株式予測',
  '問題297: X桁削除',
  '問題298: 兵士編成',
  '問題299: 連結リスト回転',
  '問題300: 配列シャッフル',
  '問題301: 連結リストシャッフル',
  '問題302: 最左端のノード',
  '問題303: 階層の平均値',
  '問題304: 完全二分木のノード',
  '問題305: 2進数の足し算',
  '問題306: 部分配列の合計値',
  '問題307: ルートの数',
  '問題308: 最小ターン数',
  '問題309: パスカルの三角形の底辺',
  '問題310: すごろくのゴール',
  '問題311: じゃがいもとにんじん',
  '問題312: 宝くじ当選',
  '問題313: 遊園地点検',
  '問題314: 最長の山型',
  '問題315: 各階層の最大値',
  '問題316: 二分探索木のn番目の最小値',
  '問題317: 部分木内のneedle',
  '問題318: 真ん中の文字列',
  '問題319: 桁の入れ替え',
  '問題320: 最後の桁のチェック',
  '問題321: 同じ値のカウント',
  '問題322: 搭乗席の反対側',
  '問題323: 時計の足し合わせ',
  '問題324: パスの結合',
  '問題325: 最後のパス',
  '問題326: ATMの実装',
  '問題327: Zipcodeのチェック',
  '問題328: カラーコードのチェック',
  '問題329: JavaScriptのコメント',
  '問題330: 西暦を世紀へ変換',
  '問題331: 2のべき乗',
  '問題332: ビット演算子',
  '問題333: XORのペア',
  '問題334: ビットのシフト',
  '問題335: アメーバの増殖',
  '問題336: ビットの入れ替え',
  '問題337: 符号チェック（XOR）',
  '問題338: 右端のフラグのOFF',
  '問題339: 1のカウント',
  '問題340: 右端のフラグの位置',
  '問題341: ハミング距離（ビット演算）',
  '問題342: 牛肉のキャンペーン',
  '問題343: 1を足す（ビット演算）',
  '問題344: XORの計算',
  '問題345: 右側のノード',
  '問題346: 積の配列',
  '問題347: 田舎旅行',
  '問題348: 配列の分割',
  '問題349: ピタゴラス数',
  '問題350: 複利の計算',
  '問題351: 物体の自由落下',
  '問題352: ドメインの切り取り',
  '問題353: 法人税',
  '問題354: 高級レストラン',
  '問題355: 緯度経度の計算',
  '問題356: タワーオブテラー',
  '問題357: ウイルス感染',
  '問題358: 足し算（再帰）',
  '問題359: 偶奇判定',
  '問題360: 総和',
  '問題361: 階乗',
  '問題362: 二乗の総和',
  '問題363: kで割り続ける',
  '問題364: 仮想通貨',
  '問題365: 3つの最大公約数',
  '問題366: 既約分数',
  '問題367: 整数上の平方根',
  '問題368: 素数（再帰）',
  '問題369: 総和の総和',
  '問題370: 回文（再帰）',
  '問題371: フィボナッチの合計',
  '問題372: 2の倍数の合計',
  '問題373: 奇数チェック',
  '問題374: 文字列の長さ比較',
  '問題375: 大文字',
  '問題376: @の位置',
  '問題377: アルファベットで置換',
  '問題378: カロリー計算',
  '問題379: 減少した体重',
  '問題380: 空のガソリン',
  '問題381: 変数の宣言と代入',
  '問題382: 変数の上書き',
  '問題383: 変数の加算',
  '問題384: 変数と代入演算子',
  '問題385: 文字列の連結',
  '問題386: リテラル',
  '問題387: 小数の誤差',
  '問題388: 演算子の優先順位',
  '問題389: %演算子',
  '問題390: インデックス演算子',
  '問題391: lengthプロパティ',
  '問題392: Hello World',
  '問題393: コンソール',
  '問題394: ブーリアン型と整数型',
  '問題395: 16進数',
  '問題396: 文字列',
  '問題397: E表記',
  '問題398: Personクラス',
  '問題399: Dogクラス',
  '問題400: Animalクラス',
  '問題401: RGBクラス',
  '問題402: Bank Accountクラス',
  '問題403: Filesクラス',
  '問題404: Productクラス',
  '問題405: Invoice Itemクラス',
  '問題406: Invoiceクラス',
  '問題407: Pointクラス',
  '問題408: Lineクラス',
  '問題409: QuadrilateralShapeクラス',
  '問題410: Stackクラス',
  '問題411: 配列の逆表示',
  '問題412: 単調増加の部分配列',
  '問題413: 数式の解析（応用）',
  '問題414: Queueクラス',
  '問題415: Dequeクラス',
  '問題416: 配列の最大値',
  '問題417: 円の面積を求める',
  '問題418: FizzBuzzの出力',
  '問題419: ゼロの増殖',
  '問題420: SinglyLinkedListクラス',
  '問題421:連結リスト化',
  '問題422: 連結リストのインデックス検索',
  '問題423: 偶数番目を2倍',
  '問題424: 連結リストの逆表示',
  '問題425: DoublyLinkedListクラス',
  '問題426: 連結リストの長さ',
  '問題427: 連結リストの末尾の値',
  '問題428: バリデーション',
  '問題429: 動物と人間の年齢',
  '問題430: ラムダ総和',
  '問題431: 惑星での体重',
  '問題432: 連邦税と州税',
  '問題433: 挨拶',
  '問題434: n進数変換',
  '問題435: 文字列の最大値',
  '問題436: カスタム配列',
  '問題437: 過半数',
  '問題438: 配列のソート',
  '問題439: 文字のスワップ',
  '問題440: 年齢チェック',
  '問題441: 奇数配列',
  '問題442: 回文配列',
  '問題443: 複利計算',
  '問題444: 複数の演算の適用',
  '問題445: reduceMap',
  '問題446: reduceFilter',
  '問題447: Lambda Machine',
  '問題448: ラウンドロビン',
  '問題449: タスクリスト',
  '問題450: 為替',
  '問題451: 優先度付きキュー top',
  '問題452: 優先度付きキュー pop',
  '問題453: Task Queue',
  '問題454: Event Queue',
  '問題455: 寄付',
  '問題456: デコレータ',
  '問題457: 複数のデコレータ',
  '問題458: 二分木の作成',
  '問題459: 二分木の値',
  '問題460: フィボナッチのメモ化',
  '問題461: 階乗のメモ化',
  '問題462: 配列の合計値',
  '問題463: 奇数番目の合計値',
  '問題464: 最大値のインデックス',
  '問題465: 配列内の文字のカウント',
  '問題466: n以降のカウント',
  '問題467: Cardクラス',
  '問題468: Bookクラス',
  '問題469: 2の倍数の配列',
  '問題470: 素数の配列',
  '問題471: 特殊な並べ替え',
  '問題472: Studentクラス',
  '問題473: Classroomクラス',
  '問題474: 成績優秀者',
  '問題475: x未満の最大値',
  '問題476: 合計値が等しい',
  '問題477: 動画視聴',
  '問題478: 車の値段',
  '問題479: 二項係数',
  '問題480: 当選者リスト',
  '問題481: 部分集合',
  '問題482: 最小ステップ',
  '問題483: 木の伐採',
  '問題484: 両替',
  '問題485: 丸太切断',
  '問題486: リスト検索',
  '問題487: 配列の交点',
  '問題488: 重複の要素',
  '問題489: 選択ソート',
  '問題490: 挿入ソート',
  '問題491: 配列の要素を2倍',
  '問題492: ピーク要素',
  '問題493: 欠番',
  '問題494: マージソート',
  '問題495: 配列の合体',
  '問題496: 接頭辞',
  '問題497: クイックソート',
  '問題498: HunterクラスとAnimalクラス',
  '問題499: 食器棚の整理',
  '問題500: ウエディングケーキ',
  '問題501: ストラックアウトゲーム',
  '問題502: ロボットの名前',
  '問題503: 重複した名前',
  '問題504: 攻撃技',
  '問題505: 論理回路I',
  '問題506: 論理回路II',
  '問題507: 論理回路III',
  '問題508: 論理回路IV',
  '問題509: 論理回路V',
  '問題510: 論理回路VI',
  '問題511: 論理回路VII',
  '問題512: 論理回路VIII',
  '問題513: 論理回路IX',
  '問題514: i番目のフラグ確認',
  '問題515: i番目のフラグOFF',
  '問題516: 0と1の反転',
  '問題517: 配列のスワップ',
  '問題518: 暗号化',
  '問題519: 免許更新の通知',
  '問題520: ラーメンのサイドメニュー',
  '問題521: ジェットコースターの乗車制限',
  '問題522: 外出の有無',
  '問題523: アサーションI',
  '問題524: アサーションII',
  '問題525: アサーションIII',
  '問題526: アサーションIV',
  '問題527: アサーションV',
  '問題528: 手動テストI',
  '問題529: 手動テストII',
  '問題530: 自動テストI',
  '問題531: 自動テストII',
  '問題532: 商品データ',
  '問題533: 本の人気度',
  '問題534: 更新ログ',
  '問題535: 製品の種類',
  '問題536: 家計管理',
  '問題537: タンパク質が多い食べ物',
  '問題538: 異常終了デバッグ',
  '問題539: 本の並べ方',
  '問題540: 投稿一覧',
  '問題541: 製品追加',
  '問題542: 投稿削除',
  '問題543: コメント編集',
  '問題544: 工場の勤怠管理システム',
  '問題545: 百貨店の販売管理',
  '問題546: 文字投稿ができるSNS',
  '問題547: 飛行機の予約システム',
  '問題548: 営業管理システム',
  '問題549: アパレルの仕入れ管理システム',
  '問題550: 全ユーザー対象',
  '問題551: 半導体製造会社の売り上げ管理DB',
  '問題552: ファッション通販サイトのDB',
  '問題553: サッカー選手のパフォーマンス分析システム',
  '問題554: 2点間の距離',
  '問題555: 速度の差',
  '問題556: 距離リスト',
  '問題557: 株の損益計算',
]
