import type { QuizData } from '@/lib/content';
import { Markdown } from './Markdown';
import { ToggleAll } from './ToggleAll';

/** Contoh soal: tiap soal punya pembahasan yang terbuka bila diklik (<details> bawaan peramban, tanpa skrip). */
export function Quiz({ quiz, id, module, slide }: { quiz: QuizData; id: string; module: string; slide: number }) {
  return (
    <div className="quiz" id={id}>
      {quiz.before ? <Markdown source={quiz.before} module={module} slide={slide} /> : null}
      <p className="quiz__hint">Coba jawab dulu di kertas, baru buka pembahasannya.</p>
      <ol className="quiz__list">
        {quiz.items.map((item, i) => (
          <li key={i} className="quiz__item">
            <div className="quiz__q">
              <Markdown source={item.question} module={module} slide={slide} />
            </div>
            <details className="quiz__a">
              <summary>
                Pembahasan <span className="sr-only">soal {i + 1}</span>
              </summary>
              <div className="quiz__a-body">
                <Markdown source={item.answer} module={module} slide={slide} />
              </div>
            </details>
          </li>
        ))}
      </ol>
      <div className="quiz__tools">
        <ToggleAll targetId={id} />
      </div>
      {quiz.after ? <Markdown source={quiz.after} module={module} slide={slide} /> : null}
    </div>
  );
}
